import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { VendorRow, VendorInsert, VendorUpdate } from "@/types/vendors";

const KEY = ["vendors"] as const;

export function useVendors() {
  return useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<VendorRow[]> => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("is_active", { ascending: false })
        .order("name", { ascending: true });
      if (error) throw error;
      return data as VendorRow[];
    },
  });
}

export function useVendor(id: string | undefined) {
  return useQuery({
    queryKey: [...KEY, id],
    enabled: !!id,
    queryFn: async (): Promise<VendorRow | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as VendorRow | null;
    },
  });
}

export function useCreateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: VendorInsert): Promise<VendorRow> => {
      const { data, error } = await supabase
        .from("vendors")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as VendorRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: VendorUpdate;
    }): Promise<VendorRow> => {
      const { data, error } = await supabase
        .from("vendors")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as VendorRow;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: [...KEY, id] });
    },
  });
}

export function useArchiveVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("vendors")
        .update({ is_active: false })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
