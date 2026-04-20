import { useRef, useEffect, useState } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Mail,
  Search,
  MessageSquare,
  CheckSquare,
  FileText,
  Sparkles,
  Clock,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { ChatMessage } from "@/types/assistant";
import { QUICK_ACTIONS } from "@/lib/ea";

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  sourcing: <Search className="h-4 w-4" />,
  customer_service: <MessageSquare className="h-4 w-4" />,
  tasks: <CheckSquare className="h-4 w-4" />,
  invoices: <FileText className="h-4 w-4" />,
  recommendations: <Sparkles className="h-4 w-4" />,
  reminders: <Clock className="h-4 w-4" />,
  alerts: <Activity className="h-4 w-4" />,
};

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSend: (message: string) => void;
}

export function ChatPanel({ messages, isLoading, onSend }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    onSend(text);
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt: string) => {
    onSend(prompt);
  };

  const showQuickActions = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        {showQuickActions ? (
          <div className="py-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full border border-border/60 mb-4">
                <Bot className="h-7 w-7 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-serif mb-2">Dila</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your executive assistant for customer service, sourcing, email triage,
                invoicing, and more. How can I help today?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:bg-muted/50 text-left transition-colors"
                >
                  <span className="mt-0.5 text-muted-foreground">
                    {CATEGORY_ICON[action.category] ?? <Sparkles className="h-4 w-4" />}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{action.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {action.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="h-7 w-7 rounded-full border border-border/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={[
                    "max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60",
                  ].join(" ")}
                >
                  {msg.isStreaming ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Thinking...
                    </span>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-border/30">
                      {msg.actions.map((action, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {action.label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="h-7 w-7 rounded-full border border-border/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input bar */}
      <div className="border-t border-border/60 p-4">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Dila anything..."
            className="min-h-[2.5rem] max-h-32 resize-none"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-[0.65rem] text-muted-foreground mt-2 text-center">
          Shift + Enter for new line. Dila is powered by Claude.
        </p>
      </div>
    </div>
  );
}
