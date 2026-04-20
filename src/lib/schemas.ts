import { z } from "zod";

export const clientIndustrySchema = z.enum([
  "finance",
  "private_equity",
  "tech_leadership",
  "medicine",
  "law",
  "other",
]);

export const clientPhaseSchema = z.enum([
  "initial",
  "retainer",
  "paused",
  "archived",
]);

// Form input for create/edit. `phase_started_at` is set server-side on
// insert; edits can override it.
export const clientFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required").max(200),
  short_name: z.string().max(80).optional().or(z.literal("")),
  industry: clientIndustrySchema.optional(),
  transition_context: z.string().max(2000).optional().or(z.literal("")),
  phase: clientPhaseSchema,
  referral_source: z.string().max(200).optional().or(z.literal("")),
  intake_notes: z.string().max(8000).optional().or(z.literal("")),
  no_go_list: z.array(z.string().min(1)).default([]),
  sizing: z.record(z.string(), z.string()).default({}),
  preferences: z.record(z.string(), z.string()).default({}),
});

export type ClientFormInput = z.infer<typeof clientFormSchema>;

export const INDUSTRY_LABEL: Record<z.infer<typeof clientIndustrySchema>, string> = {
  finance: "Finance",
  private_equity: "Private equity",
  tech_leadership: "Tech leadership",
  medicine: "Medicine",
  law: "Law",
  other: "Other",
};

export const PHASE_LABEL: Record<z.infer<typeof clientPhaseSchema>, string> = {
  initial: "Initial engagement",
  retainer: "Retainer",
  paused: "Paused",
  archived: "Archived",
};
