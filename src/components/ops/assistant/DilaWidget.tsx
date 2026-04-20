import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatMessage } from "@/lib/ea";
import type { ChatMessage } from "@/types/assistant";

function uid() {
  return crypto.randomUUID();
}

export function DilaWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");

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
      const errMsg = err instanceof Error ? err.message : "Something went wrong.";
      const isNotDeployed =
        errMsg.includes("404") ||
        errMsg.includes("FunctionsRelayError") ||
        errMsg.includes("not found");

      const fallback = isNotDeployed
        ? "Dila isn't connected yet. Deploy the edge function to activate me. Go to the full Dila page for details."
        : `Error: ${errMsg}`;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholderId
            ? { ...m, content: fallback, isStreaming: false }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 w-[22rem] h-[28rem] bg-background border border-border/60 rounded-xl shadow-lg flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full border border-border/60 flex items-center justify-center">
                <Bot className="h-3 w-3" />
              </div>
              <span className="text-sm font-medium">Dila</span>
            </div>
            <div className="flex items-center gap-1">
              <Link to="/ops/dila">
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Open full view">
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-3" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <Bot className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Hi, I'm Dila</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[14rem]">
                  Ask me anything — tasks, sourcing, emails, invoices, or client questions.
                </p>
              </div>
            ) : (
              <div className="py-3 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="h-5 w-5 rounded-full border border-border/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="h-2.5 w-2.5" />
                      </div>
                    )}
                    <div
                      className={[
                        "max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/60",
                      ].join(" ")}
                    >
                      {msg.isStreaming ? (
                        <span className="flex items-center gap-1.5">
                          <Loader2 className="h-2.5 w-2.5 animate-spin" />
                          Thinking...
                        </span>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="h-5 w-5 rounded-full border border-border/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="h-2.5 w-2.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border/40 p-3">
            <div className="flex gap-2 items-end">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Dila..."
                className="min-h-[2rem] max-h-20 resize-none text-xs"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-8 w-8 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={[
          "fixed bottom-6 right-6 h-12 w-12 rounded-full flex items-center justify-center shadow-lg z-50 transition-colors",
          open
            ? "bg-muted text-foreground"
            : "bg-primary text-primary-foreground hover:opacity-90",
        ].join(" ")}
        title={open ? "Close Dila" : "Talk to Dila"}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </button>
    </>
  );
}
