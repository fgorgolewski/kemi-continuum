import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ClientRow, ClientInsert, ClientUpdate } from "@/types/database";

const KEY = ["clients"] as const;

export function useClients() {
  return useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<ClientRow[]> => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("phase", { ascending: true })
        .order("full_name", { ascending: true });
      if (error) throw error;
      return data as ClientRow[];
    },
  });
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: [...KEY, id],
    enabled: !!id,
    queryFn: async (): Promise<ClientRow | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as ClientRow | null;
    },
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ClientInsert): Promise<ClientRow> => {
      const { data, error } = await supabase
        .from("clients")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as ClientRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: ClientUpdate;
    }): Promise<ClientRow> => {
      const { data, error } = await supabase
        .from("clients")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as ClientRow;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: [...KEY, id] });
    },
  });
}

export function useArchiveClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("clients")
        .update({ phase: "archived" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useActiveClientCount() {
  const q = useClients();
  const activeCount = (q.data ?? []).filter((c) => c.phase !== "archived").length;
  return { ...q, activeCount };
}
