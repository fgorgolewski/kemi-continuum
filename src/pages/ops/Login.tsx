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
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!loading && session) {
    const from = (location.state as { from?: string } | null)?.from ?? "/ops";
    return <Navigate to={from} replace />;
  }

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/ops`,
      },
    });
    if (error) {
      setGoogleLoading(false);
      setStatus("error");
      setMessage(error.message);
    }
    // On success the browser is redirected to Google; no further state updates needed.
  };

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
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px w-10 bg-border" />
          <div className="h-1.5 w-1.5 rotate-45 bg-muted-foreground/70" />
          <div className="h-px w-10 bg-border" />
        </div>
        <div className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground text-center mb-3">
          Continuum Ops
        </div>
        <h1 className="text-2xl font-serif text-center mb-2">Sign in</h1>
        <p className="text-xs italic font-serif text-muted-foreground text-center mb-8">
          By invitation. Operators only.
        </p>

        <Button
          type="button"
          variant="outline"
          className="w-full h-11 gap-3 font-medium"
          onClick={handleGoogle}
          disabled={googleLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
        </Button>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            or email link
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

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
