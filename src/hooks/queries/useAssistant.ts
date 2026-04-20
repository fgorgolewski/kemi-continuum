import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type {
  EATaskRow,
  EATaskInsert,
  EATaskUpdate,
  EAReminderRow,
  EAReminderInsert,
  EAInvoiceDraftRow,
  EAHealthCheckRow,
} from "@/types/assistant";

/* ───────── Tasks ───────── */

const TASKS_KEY = ["ea_tasks"] as const;

export function useEATasks(statusFilter?: string) {
  return useQuery({
    queryKey: [...TASKS_KEY, statusFilter],
    queryFn: async (): Promise<EATaskRow[]> => {
      let q = supabase
        .from("ea_tasks")
        .select("*")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });
      if (statusFilter && statusFilter !== "all") {
        q = q.eq("status", statusFilter);
      }
      const { data, error } = await q;
      if (error) throw error;
      return data as EATaskRow[];
    },
  });
}

export function useCreateEATask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: EATaskInsert): Promise<EATaskRow> => {
      const { data, error } = await supabase
        .from("ea_tasks")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as EATaskRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

export function useUpdateEATask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: EATaskUpdate }) => {
      const { error } = await supabase
        .from("ea_tasks")
        .update(patch)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

export function useDeleteEATask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ea_tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

/* ───────── Reminders ───────── */

const REMINDERS_KEY = ["ea_reminders"] as const;

export function useEAReminders() {
  return useQuery({
    queryKey: REMINDERS_KEY,
    queryFn: async (): Promise<EAReminderRow[]> => {
      const { data, error } = await supabase
        .from("ea_reminders")
        .select("*")
        .in("status", ["active", "snoozed"])
        .order("remind_at", { ascending: true });
      if (error) throw error;
      return data as EAReminderRow[];
    },
  });
}

export function useCreateEAReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: EAReminderInsert): Promise<EAReminderRow> => {
      const { data, error } = await supabase
        .from("ea_reminders")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as EAReminderRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: REMINDERS_KEY }),
  });
}

export function useDismissEAReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ea_reminders")
        .update({ status: "dismissed" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: REMINDERS_KEY }),
  });
}

/* ───────── Invoice drafts ───────── */

const INVOICES_KEY = ["ea_invoices"] as const;

export function useEAInvoices() {
  return useQuery({
    queryKey: INVOICES_KEY,
    queryFn: async (): Promise<EAInvoiceDraftRow[]> => {
      const { data, error } = await supabase
        .from("ea_invoice_drafts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as EAInvoiceDraftRow[];
    },
  });
}

/* ───────── Health checks ───────── */

const HEALTH_KEY = ["ea_health"] as const;

export function useEAHealthChecks() {
  return useQuery({
    queryKey: HEALTH_KEY,
    queryFn: async (): Promise<EAHealthCheckRow[]> => {
      const { data, error } = await supabase
        .from("ea_health_checks")
        .select("*")
        .order("last_checked_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as EAHealthCheckRow[];
    },
    refetchInterval: 60_000, // poll every minute
  });
}
