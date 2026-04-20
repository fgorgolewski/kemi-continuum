import { useState, useEffect, useCallback } from "react";
import { ChatPanel } from "@/components/ops/assistant/ChatPanel";
import { SidePanel } from "@/components/ops/assistant/SidePanel";
import { sendChatMessage, pingUrl, KEMISSA_URL } from "@/lib/ea";
import type { ChatMessage } from "@/types/assistant";
import type { HealthPing } from "@/lib/ea";

function uid() {
  return crypto.randomUUID();
}

export function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [health, setHealth] = useState<HealthPing | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(true);

  // Check site health on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await pingUrl(KEMISSA_URL);
      if (!cancelled) {
        setHealth(result);
        setIsCheckingHealth(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      const placeholderId = uid();
      const placeholderMsg: ChatMessage = {
        id: placeholderId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, placeholderMsg]);
      setIsLoading(true);

      try {
        // Build history for context
        const history = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const reply = await sendChatMessage(history);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholderId
              ? { ...m, content: reply, isStreaming: false }
              : m,
          ),
        );
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : "Something went wrong.";

        // Check if this is a "function not deployed" error and provide helpful guidance
        const isNotDeployed =
          errMsg.includes("404") ||
          errMsg.includes("FunctionsRelayError") ||
          errMsg.includes("not found");

        const fallbackContent = isNotDeployed
          ? `I'm not connected to my AI backend yet. To activate Dila:\n\n1. Deploy the edge function: \`supabase functions deploy ea-chat\`\n2. Set the secret: \`supabase secrets set ANTHROPIC_API_KEY=sk-ant-...\`\n\nIn the meantime, you can still use the **Tasks**, **Reminders**, and **Health** panels on the right.`
          : `Sorry, I encountered an error: ${errMsg}\n\nYou can still use the sidebar panels for tasks and reminders.`;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholderId
              ? { ...m, content: fallbackContent, isStreaming: false }
              : m,
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages],
  );

  return (
    <div className="h-[calc(100vh-7.5rem)]">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-serif">Dila</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your executive assistant — powered by Claude
          </p>
        </div>
        {health && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                health.status === "healthy"
                  ? "bg-green-500"
                  : health.status === "degraded"
                    ? "bg-orange-500"
                    : "bg-red-500"
              }`}
            />
            kemissa.com {health.status}
          </div>
        )}
      </div>

      <div className="grid grid-cols-[1fr_20rem] gap-0 border border-border/60 rounded-lg overflow-hidden h-[calc(100%-3.5rem)]">
        {/* Chat */}
        <div className="border-r border-border/60 flex flex-col">
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            onSend={handleSend}
          />
        </div>

        {/* Sidebar */}
        <div className="flex flex-col overflow-hidden">
          <SidePanel health={health} isCheckingHealth={isCheckingHealth} />
        </div>
      </div>
    </div>
  );
}
