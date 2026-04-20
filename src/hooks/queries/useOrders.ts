import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { OrderRow, OrderInsert, OrderUpdate, OrderStatus } from "@/types/orders";

const KEY = ["orders"] as const;

export function useOrders() {
  return useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<OrderRow[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("ordered_at", { ascending: false });
      if (error) throw error;
      return data as OrderRow[];
    },
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: [...KEY, id],
    enabled: !!id,
    queryFn: async (): Promise<OrderRow | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as OrderRow | null;
    },
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: OrderInsert): Promise<OrderRow> => {
      const { data, error } = await supabase
        .from("orders")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as OrderRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: OrderUpdate;
    }): Promise<OrderRow> => {
      const { data, error } = await supabase
        .from("orders")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as OrderRow;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: [...KEY, id] });
    },
  });
}

/** Move an order to the next stage, stamping the stage timestamp */
export function useAdvanceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      nextStatus,
    }: {
      id: string;
      nextStatus: OrderStatus;
    }): Promise<OrderRow> => {
      const patch: Record<string, unknown> = {
        status: nextStatus,
        [`${nextStatus}_at`]: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from("orders")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as OrderRow;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: [...KEY, id] });
    },
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
