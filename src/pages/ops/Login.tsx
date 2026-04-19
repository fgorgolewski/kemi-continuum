import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "idle" | "sending" | "sent" | "error";

export function OpsLogin() {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  if (!loading && session) {
    const from = (location.state as { from?: string } | null)?.from ?? "/ops";
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/ops`,
      },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
    setMessage("Link sent. Check the inbox for the email above.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background text-foreground">
      <div className="w-full max-w-sm">
        <div className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground mb-6">
          Continuum Ops
        </div>
        <h1 className="text-2xl font-serif mb-8">Sign in</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending" || status === "sent"}
            />
          </div>
          <Button type="submit" disabled={status === "sending" || status === "sent" || !email}>
            {status === "sending" ? "Sending..." : status === "sent" ? "Sent" : "Send link"}
          </Button>
          {message && (
            <p
              className={
                status === "error"
                  ? "text-sm text-destructive"
                  : "text-sm text-muted-foreground"
              }
            >
              {message}
            </p>
          )}
        </form>

        <p className="mt-10 text-xs text-muted-foreground">
          Access is limited to the Continuum operators. Email addresses
          outside the allowlist will be rejected silently by the database.
        </p>
      </div>
    </div>
  );
}
