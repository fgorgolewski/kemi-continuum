// Supabase Edge Function — Kemissa Executive Assistant
//
// Deploy:  supabase functions deploy ea-chat
// Secret:  supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Architecture: Single Claude agent with tool calling.
// The agent routes to the right capability based on the user's message.
// Tools let it create tasks, reminders, draft invoices, check health,
// and send alerts — all via Supabase admin client.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const SYSTEM_PROMPT = `You are Dila — Kemissa's executive assistant. You are a world-class AI assistant for Kemissa, a luxury personal styling and wardrobe consultancy.

Your name is Dila. Your operator is Kemissa (the founder) and her team. You help them run operations efficiently.

CAPABILITIES:
1. **Customer Service** — Draft professional, warm, on-brand responses to client inquiries. Kemissa's tone is refined, personal, and never generic.
2. **Sourcing** — Help find fashion items, suppliers, fabrics, and materials. Ask for client preferences, budget, and occasion. Suggest specific items when possible.
3. **Email Triage** — When shown emails, categorize by urgency (urgent/important/routine/low), suggest responses, and flag items needing immediate attention.
4. **Tasks & Reminders** — Create, manage, and prioritize tasks. Set reminders for follow-ups, deadlines, and appointments. Use the tools to persist them.
5. **Invoice Preparation** — Help draft invoices with proper line items. Ask for client, services, hours, and rates. Use the invoice tool.
6. **Recommendations** — Provide personalized styling recommendations based on client profiles, preferences, and occasions.
7. **Site Monitoring & Alerts** — Check kemissa.com health and notify the team when issues arise.

BRAND VOICE:
- Professional but warm
- Concise but thorough
- Proactive — anticipate what the user needs next
- Never use excessive emojis or casual language

RULES:
- When creating tasks or reminders, ALWAYS use the provided tools so they persist
- If you're unsure about something, ask for clarification
- For invoices, always confirm details before creating
- When triaging emails, provide a clear priority matrix
- For sourcing, consider the client's existing wardrobe preferences and no-go list

You have access to the Kemissa client database. Use it to personalize your responses.`;

// Tool definitions for Claude
const TOOLS = [
  {
    name: "create_task",
    description:
      "Create a task in the Kemissa ops dashboard. Use this whenever the user asks to track, remember, or follow up on something actionable.",
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Short task title" },
        description: {
          type: "string",
          description: "Optional details",
        },
        priority: {
          type: "string",
          enum: ["low", "medium", "high", "urgent"],
          description: "Task priority level",
        },
        due_date: {
          type: "string",
          description: "ISO 8601 date string for the due date, if mentioned",
        },
        category: {
          type: "string",
          description:
            "Category: sourcing, customer_service, invoicing, follow_up, admin, other",
        },
      },
      required: ["title", "priority"],
    },
  },
  {
    name: "create_reminder",
    description:
      "Set a reminder that will appear in the dashboard. Use when the user says 'remind me' or needs a time-based alert.",
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "What to remember" },
        description: { type: "string", description: "Optional details" },
        remind_at: {
          type: "string",
          description:
            "ISO 8601 datetime for when to remind. Interpret relative times from now.",
        },
      },
      required: ["title", "remind_at"],
    },
  },
  {
    name: "draft_invoice",
    description:
      "Create an invoice draft. Use when the user wants to prepare a bill for a client.",
    input_schema: {
      type: "object" as const,
      properties: {
        client_name: { type: "string", description: "Client's full name" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              description: { type: "string" },
              quantity: { type: "number" },
              unit_price: { type: "number" },
            },
            required: ["description", "quantity", "unit_price"],
          },
          description: "Line items for the invoice",
        },
        tax_rate: {
          type: "number",
          description: "Tax rate as decimal (e.g. 0.20 for 20%). Default 0.",
        },
        notes: {
          type: "string",
          description: "Optional notes to include on the invoice",
        },
      },
      required: ["client_name", "items"],
    },
  },
  {
    name: "search_clients",
    description:
      "Search the client database for matching clients. Use to look up client details, preferences, or wardrobe info.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Name or keyword to search for",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "check_site_health",
    description:
      "Check if kemissa.com is up and responsive. Returns status and response time.",
    input_schema: {
      type: "object" as const,
      properties: {
        url: {
          type: "string",
          description: "URL to check. Defaults to https://kemissa.com",
        },
      },
      required: [],
    },
  },
  {
    name: "send_alert",
    description:
      "Send an alert notification to the team (e.g. when the site is down or something urgent happens). Only use when genuinely critical.",
    input_schema: {
      type: "object" as const,
      properties: {
        message: { type: "string", description: "Alert message" },
        severity: {
          type: "string",
          enum: ["info", "warning", "critical"],
          description: "Severity level",
        },
        notify_emails: {
          type: "array",
          items: { type: "string" },
          description: "Email addresses to notify",
        },
      },
      required: ["message", "severity"],
    },
  },
];

// Execute tool calls against Supabase
async function executeTool(
  name: string,
  input: Record<string, unknown>,
  userId: string,
) {
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  switch (name) {
    case "create_task": {
      const { data, error } = await admin
        .from("ea_tasks")
        .insert({
          user_id: userId,
          title: input.title,
          description: input.description ?? null,
          priority: input.priority ?? "medium",
          due_date: input.due_date ?? null,
          category: input.category ?? null,
          created_by: "assistant",
          status: "pending",
        })
        .select()
        .single();
      if (error) return { error: error.message };
      return { success: true, task: data };
    }

    case "create_reminder": {
      const { data, error } = await admin
        .from("ea_reminders")
        .insert({
          user_id: userId,
          title: input.title,
          description: input.description ?? null,
          remind_at: input.remind_at,
          status: "active",
        })
        .select()
        .single();
      if (error) return { error: error.message };
      return { success: true, reminder: data };
    }

    case "draft_invoice": {
      const items = (input.items as Array<Record<string, unknown>>) ?? [];
      const computed = items.map((item) => ({
        description: item.description,
        quantity: item.quantity as number,
        unit_price: item.unit_price as number,
        total: (item.quantity as number) * (item.unit_price as number),
      }));
      const subtotal = computed.reduce((s, i) => s + i.total, 0);
      const taxRate = (input.tax_rate as number) ?? 0;
      const total = subtotal * (1 + taxRate);

      const { data, error } = await admin
        .from("ea_invoice_drafts")
        .insert({
          user_id: userId,
          client_name: input.client_name,
          items: computed,
          subtotal,
          tax_rate: taxRate,
          total,
          notes: input.notes ?? null,
          status: "draft",
        })
        .select()
        .single();
      if (error) return { error: error.message };
      return { success: true, invoice: data };
    }

    case "search_clients": {
      const query = (input.query as string) ?? "";
      const { data, error } = await admin
        .from("clients")
        .select("*")
        .or(
          `full_name.ilike.%${query}%,short_name.ilike.%${query}%,industry.ilike.%${query}%`,
        )
        .limit(5);
      if (error) return { error: error.message };
      return { clients: data };
    }

    case "check_site_health": {
      const url = (input.url as string) || "https://kemissa.com";
      const start = Date.now();
      try {
        const res = await fetch(url, { method: "HEAD" });
        const ms = Date.now() - start;
        const status = res.ok
          ? ms > 3000
            ? "degraded"
            : "healthy"
          : "degraded";

        // Store the check
        await admin.from("ea_health_checks").insert({
          url,
          status,
          response_time_ms: ms,
        });

        return { url, status, response_time_ms: ms, http_status: res.status };
      } catch (err) {
        const ms = Date.now() - start;
        await admin.from("ea_health_checks").insert({
          url,
          status: "down",
          response_time_ms: ms,
          error_message: err instanceof Error ? err.message : "Unreachable",
        });
        return {
          url,
          status: "down",
          response_time_ms: ms,
          error: err instanceof Error ? err.message : "Unreachable",
        };
      }
    }

    case "send_alert": {
      // For now, log the alert. In production, wire up to email/Slack.
      // Could use Supabase's built-in email or a Resend integration.
      console.log(
        `[ALERT] ${input.severity}: ${input.message}`,
        input.notify_emails,
      );

      // Store as a health check entry with error for visibility
      await admin.from("ea_health_checks").insert({
        url: "alert",
        status: input.severity === "critical" ? "down" : "degraded",
        error_message: `[${input.severity}] ${input.message}`,
      });

      return {
        success: true,
        message: "Alert logged. Email/Slack integration pending setup.",
        severity: input.severity,
      };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

Deno.serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    // Auth — verify user via their JWT
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    });
    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();

    // Build Claude messages
    const claudeMessages = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      }),
    );

    // Agentic loop — keep calling Claude until we get a final text response
    let response: Record<string, unknown>;
    let loopMessages = [...claudeMessages];
    let iterations = 0;
    const MAX_ITERATIONS = 5;

    while (iterations < MAX_ITERATIONS) {
      iterations++;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          tools: TOOLS,
          messages: loopMessages,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Anthropic API error ${res.status}: ${body}`);
      }

      response = await res.json();
      const stopReason = response.stop_reason as string;
      const content = response.content as Array<Record<string, unknown>>;

      if (stopReason === "end_turn" || stopReason !== "tool_use") {
        // Extract text from response
        const textBlock = content.find((b) => b.type === "text");
        const reply = (textBlock?.text as string) ?? "I'm not sure how to help with that.";
        return new Response(JSON.stringify({ reply }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // Process tool calls
      const toolUseBlocks = content.filter((b) => b.type === "tool_use");
      const toolResults = [];

      for (const block of toolUseBlocks) {
        const result = await executeTool(
          block.name as string,
          block.input as Record<string, unknown>,
          user.id,
        );
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(result),
        });
      }

      // Add assistant message + tool results to conversation
      loopMessages = [
        ...loopMessages,
        { role: "assistant", content },
        { role: "user", content: toolResults },
      ];
    }

    // Max iterations reached
    return new Response(
      JSON.stringify({
        reply: "I've completed several actions. Please check the Tasks and Reminders panels for updates.",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (err) {
    console.error("EA error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Internal error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
});
