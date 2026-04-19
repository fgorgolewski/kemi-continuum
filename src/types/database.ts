// Minimal Supabase Database type for the ops dashboard.
// Regenerate with `supabase gen types typescript --project-id <ref>` once
// the Supabase CLI is wired; until then this hand-authored shape mirrors
// `supabase_schema_v2.sql`.

export type ClientPhase = "initial" | "retainer" | "paused" | "archived";

export type ClientIndustry =
  | "finance"
  | "private_equity"
  | "tech_leadership"
  | "medicine"
  | "law"
  | "other";

export interface ClientRow {
  id: string;
  full_name: string;
  short_name: string | null;
  industry: ClientIndustry | null;
  transition_context: string | null;
  phase: ClientPhase;
  phase_started_at: string; // ISO date
  referral_source: string | null;
  intake_notes: string | null;
  no_go_list: string[] | null;
  sizing: Record<string, string> | null;
  preferences: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export type ClientInsert = Omit<
  ClientRow,
  "id" | "created_at" | "updated_at" | "phase_started_at"
> & {
  id?: string;
  phase_started_at?: string;
};

export type ClientUpdate = Partial<ClientInsert>;
