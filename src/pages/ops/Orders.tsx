import { useMemo, useState } from "react";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import {
  useOrders,
  useCreateOrder,
  useUpdateOrder,
  useAdvanceOrder,
} from "@/hooks/queries/useOrders";
import { useClients } from "@/hooks/queries/useClients";
import {
  ORDER_STAGES,
  STAGE_LABEL,
  STAGE_COLOR,
  DELIVERY_LABEL,
  CARRIER_LABEL,
  nextStage,
} from "@/lib/orders";
import type {
  OrderRow,
  OrderStatus,
  DeliveryType,
  Carrier,
} from "@/types/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronRight,
  Plus,
  Package,
  Truck,
  Pen,
  ExternalLink,
  Star,
} from "lucide-react";
import { toast } from "sonner";

/* ────────────────────── Order Card ────────────────────── */

function OrderCard({
  order,
  onAdvance,
  onEdit,
}: {
  order: OrderRow;
  onAdvance: () => void;
  onEdit: () => void;
}) {
  const next = nextStage(order.status);
  const stageTs = order[`${order.status}_at` as keyof OrderRow] as string | null;

  return (
    <div className="border border-border/50 rounded-lg p-3 bg-background hover:border-border transition-colors group">
      <div className="flex items-start justify-between mb-2">
        <div className="font-medium text-sm truncate flex-1">
          {order.client_name}
        </div>
        <button
          onClick={onEdit}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pen className="h-3 w-3 text-muted-foreground hover:text-foreground" />
        </button>
      </div>

      {order.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {order.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mb-2">
        {order.delivery_type === "white_glove" && (
          <Badge variant="outline" className="text-[0.6rem] h-4 px-1.5 gap-0.5">
            <Star className="h-2.5 w-2.5" /> White Glove
          </Badge>
        )}
        {order.carrier && (
          <Badge variant="outline" className="text-[0.6rem] h-4 px-1.5">
            {CARRIER_LABEL[order.carrier]}
          </Badge>
        )}
        {order.tracking_number && (
          <Badge variant="outline" className="text-[0.6rem] h-4 px-1.5 gap-0.5">
            <Truck className="h-2.5 w-2.5" /> {order.tracking_number.slice(-6)}
          </Badge>
        )}
      </div>

      {order.items.length > 0 && (
        <div className="text-[0.65rem] text-muted-foreground mb-2">
          {order.items.length} item{order.items.length > 1 ? "s" : ""}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[0.6rem] text-muted-foreground">
          {stageTs
            ? formatDistanceToNow(parseISO(stageTs), { addSuffix: true })
            : ""}
        </span>
        {next && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[0.65rem] gap-1"
            onClick={onAdvance}
          >
            {STAGE_LABEL[next]} <ChevronRight className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

/* ────────────────────── Pipeline Column ────────────────────── */

function PipelineColumn({
  stage,
  orders,
  onAdvance,
  onEdit,
}: {
  stage: OrderStatus;
  orders: OrderRow[];
  onAdvance: (id: string) => void;
  onEdit: (order: OrderRow) => void;
}) {
  return (
    <div className="flex flex-col min-w-[13rem] max-w-[15rem] flex-1">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Badge className={`text-[0.6rem] ${STAGE_COLOR[stage]}`}>
          {STAGE_LABEL[stage]}
        </Badge>
        <span className="text-xs text-muted-foreground">{orders.length}</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-1">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAdvance={() => onAdvance(order.id)}
              onEdit={() => onEdit(order)}
            />
          ))}
          {orders.length === 0 && (
            <div className="text-xs text-muted-foreground/60 text-center py-6">
              No orders
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

/* ────────────────────── Create / Edit Dialog ────────────────────── */

interface FormState {
  open: boolean;
  editing: OrderRow | null;
}

const EMPTY_FORM = {
  client_name: "",
  description: "",
  delivery_type: "standard" as DeliveryType,
  carrier: "" as string,
  tracking_number: "",
  notes: "",
  itemsText: "",
};

function OrderDialog({
  form,
  onClose,
}: {
  form: FormState;
  onClose: () => void;
}) {
  const { data: clients = [] } = useClients();
  const create = useCreateOrder();
  const update = useUpdateOrder();

  const [values, setValues] = useState(EMPTY_FORM);

  // Reset form when dialog opens
  useState(() => {
    if (form.editing) {
      setValues({
        client_name: form.editing.client_name,
        description: form.editing.description ?? "",
        delivery_type: form.editing.delivery_type,
        carrier: form.editing.carrier ?? "",
        tracking_number: form.editing.tracking_number ?? "",
        notes: form.editing.notes ?? "",
        itemsText: form.editing.items
          .map((i) => `${i.name}${i.quantity > 1 ? ` x${i.quantity}` : ""}`)
          .join("\n"),
      });
    } else {
      setValues(EMPTY_FORM);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.client_name.trim()) {
      toast.error("Client name is required.");
      return;
    }

    const items = values.itemsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^(.+?)\s*x(\d+)$/i);
        return match
          ? { name: match[1].trim(), quantity: parseInt(match[2]) }
          : { name: line, quantity: 1 };
      });

    try {
      if (form.editing) {
        await update.mutateAsync({
          id: form.editing.id,
          patch: {
            client_name: values.client_name,
            description: values.description || null,
            delivery_type: values.delivery_type,
            carrier: (values.carrier || null) as Carrier | null,
            tracking_number: values.tracking_number || null,
            notes: values.notes || null,
            items,
          },
        });
        toast.success("Order updated.");
      } else {
        await create.mutateAsync({
          client_name: values.client_name,
          client_id: clients.find((c) => c.full_name === values.client_name)?.id ?? null,
          description: values.description || null,
          items,
          status: "ordered",
          delivery_type: values.delivery_type,
          signature_required: true,
          carrier: (values.carrier || null) as Carrier | null,
          tracking_number: values.tracking_number || null,
          shipping_label_url: null,
          estimated_delivery: null,
          shipping_address: null,
          ordered_at: new Date().toISOString(),
          received_at: null,
          repacked_at: null,
          shipping_booked_at: null,
          shipped_at: null,
          delivered_at: null,
          notes: values.notes || null,
        });
        toast.success("Order created.");
      }
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Request failed.";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={form.open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {form.editing ? "Edit order" : "New order"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 col-span-2">
              <Label htmlFor="client_name">Client name</Label>
              <Input
                id="client_name"
                value={values.client_name}
                onChange={(e) =>
                  setValues({ ...values, client_name: e.target.value })
                }
                list="client-suggestions"
                required
              />
              <datalist id="client-suggestions">
                {clients.map((c) => (
                  <option key={c.id} value={c.full_name} />
                ))}
              </datalist>
            </div>

            <div className="flex flex-col gap-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={values.description}
                onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
                }
                placeholder="e.g. Spring wardrobe refresh"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="delivery_type">Delivery type</Label>
              <Select
                value={values.delivery_type}
                onValueChange={(v) =>
                  setValues({ ...values, delivery_type: v as DeliveryType })
                }
              >
                <SelectTrigger id="delivery_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DELIVERY_LABEL).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Select
                value={values.carrier}
                onValueChange={(v) => setValues({ ...values, carrier: v })}
              >
                <SelectTrigger id="carrier">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CARRIER_LABEL).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 col-span-2">
              <Label htmlFor="tracking">Tracking number</Label>
              <Input
                id="tracking"
                value={values.tracking_number}
                onChange={(e) =>
                  setValues({ ...values, tracking_number: e.target.value })
                }
                placeholder="Added when shipping is booked"
              />
            </div>

            <div className="flex flex-col gap-2 col-span-2">
              <Label htmlFor="items">
                Items <span className="text-muted-foreground font-normal">(one per line, e.g. "Navy blazer x2")</span>
              </Label>
              <Textarea
                id="items"
                rows={3}
                value={values.itemsText}
                onChange={(e) =>
                  setValues({ ...values, itemsText: e.target.value })
                }
                placeholder={"Cashmere scarf\nSilk blouse x2\nLeather belt"}
              />
            </div>

            <div className="flex flex-col gap-2 col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={2}
                value={values.notes}
                onChange={(e) =>
                  setValues({ ...values, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={create.isPending || update.isPending}
            >
              {form.editing ? "Save changes" : "Create order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ────────────────────── Main Orders Page ────────────────────── */

export function Orders() {
  const { data: orders = [], isLoading } = useOrders();
  const advance = useAdvanceOrder();

  const [form, setForm] = useState<FormState>({ open: false, editing: null });

  const byStage = useMemo(() => {
    const grouped: Record<OrderStatus, OrderRow[]> = {
      ordered: [],
      received: [],
      repacked: [],
      shipping_booked: [],
      shipped: [],
      delivered: [],
    };
    for (const order of orders) {
      grouped[order.status]?.push(order);
    }
    return grouped;
  }, [orders]);

  const activeCount = orders.filter((o) => o.status !== "delivered").length;

  const handleAdvance = async (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    const next = nextStage(order.status);
    if (!next) return;

    try {
      await advance.mutateAsync({ id, nextStatus: next });
      toast.success(`Moved to ${STAGE_LABEL[next]}.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to advance.";
      toast.error(msg);
    }
  };

  const openCreate = () => setForm({ open: true, editing: null });
  const openEdit = (order: OrderRow) => setForm({ open: true, editing: order });
  const closeForm = () => setForm({ open: false, editing: null });

  return (
    <div className="h-[calc(100vh-7.5rem)]">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeCount} active order{activeCount !== 1 ? "s" : ""} in pipeline.
            All deliveries require signature.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> New order
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading.</div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4 h-[calc(100%-4rem)]">
          {ORDER_STAGES.map((stage) => (
            <PipelineColumn
              key={stage}
              stage={stage}
              orders={byStage[stage]}
              onAdvance={handleAdvance}
              onEdit={openEdit}
            />
          ))}
        </div>
      )}

      <OrderDialog form={form} onClose={closeForm} />
    </div>
  );
}
