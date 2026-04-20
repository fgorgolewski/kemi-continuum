// Executive Assistant API helpers.
// Chat calls the Supabase Edge Function; CRUD goes direct to Supabase.

import { supabase } from "./supabase";
import type { ChatMessage } from "@/types/assistant";

/* ───────── Chat (Edge Function) ───────── */

const EA_FUNCTION =
  import.meta.env.VITE_EA_FUNCTION_URL ??
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ea-chat`;

export async function sendChatMessage(
  messages: Pick<ChatMessage, "role" | "content">[],
): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await fetch(EA_FUNCTION, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`EA error ${res.status}: ${body}`);
  }

  const data = await res.json();
  return data.reply as string;
}

/* ───────── Health check (client-side ping) ───────── */

export interface HealthPing {
  url: string;
  status: "healthy" | "degraded" | "down";
  responseMs: number;
  error?: string;
}

export async function pingUrl(url: string): Promise<HealthPing> {
  const start = performance.now();
  try {
    const res = await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-store",
    });
    const ms = Math.round(performance.now() - start);
    // no-cors gives opaque response; res.ok is always false, but fetch
    // succeeding means the server responded.
    const status = ms > 3000 ? "degraded" : "healthy";
    return { url, status, responseMs: ms };
  } catch (err) {
    const ms = Math.round(performance.now() - start);
    return {
      url,
      status: "down",
      responseMs: ms,
      error: err instanceof Error ? err.message : "Unreachable",
    };
  }
}

/* ───────── Constants ───────── */

export const KEMISSA_URL = "https://kemissa.com";

export const QUICK_ACTIONS = [
  {
    id: "email",
    label: "Triage Inbox",
    description: "Review and categorize recent emails, flag urgent items",
    prompt: "Review and triage my inbox. Categorize emails by urgency and suggest responses for anything that needs my attention today.",
    category: "email",
  },
  {
    id: "source",
    label: "Source Items",
    description: "Find products, suppliers, or materials for a client",
    prompt: "Help me source items for a client. I'll describe what I'm looking for and the client's preferences.",
    category: "sourcing",
  },
  {
    id: "customer",
    label: "Customer Inquiry",
    description: "Draft a response to a customer question or request",
    prompt: "Help me respond to a customer inquiry. I'll share the details and you draft a professional, on-brand response.",
    category: "customer_service",
  },
  {
    id: "tasks",
    label: "Manage Tasks",
    description: "Review, prioritize, or create tasks",
    prompt: "Show me my pending tasks, help me prioritize them, and suggest what I should focus on today.",
    category: "tasks",
  },
  {
    id: "invoice",
    label: "Draft Invoice",
    description: "Prepare an invoice for a client",
    prompt: "Help me prepare an invoice. I'll provide the client name, services rendered, and amounts.",
    category: "invoices",
  },
  {
    id: "recommend",
    label: "Recommendations",
    description: "Get styling or service recommendations for a client",
    prompt: "Give me personalized recommendations for a client. I'll share their profile and what they're looking for.",
    category: "recommendations",
  },
  {
    id: "reminder",
    label: "Set Reminder",
    description: "Set a reminder for a follow-up or deadline",
    prompt: "Help me set a reminder. I'll tell you what I need to remember and when.",
    category: "tasks",
  },
  {
    id: "health",
    label: "Site Health",
    description: "Check kemissa.com status and configure alerts",
    prompt: "Check the website status for kemissa.com and tell me if everything is running smoothly. Also review any active alerts.",
    category: "alerts",
  },
] as const;

export const PRIORITY_LABEL: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Done",
  cancelled: "Cancelled",
};
