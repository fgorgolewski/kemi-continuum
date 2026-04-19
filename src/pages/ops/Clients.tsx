import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { differenceInDays, parseISO } from "date-fns";
import {
  useClients,
  useCreateClient,
  useUpdateClient,
} from "@/hooks/queries/useClients";
import {
  CLIENT_CAP,
  INDUSTRY_LABEL,
  PHASE_LABEL,
  clientFormSchema,
  type ClientFormInput,
} from "@/lib/schemas";
import type { ClientRow } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";

function phaseDurationDays(startedAt: string): number {
  try {
    return Math.max(0, differenceInDays(new Date(), parseISO(startedAt)));
  } catch {
    return 0;
  }
}

interface FormState {
  open: boolean;
  editing: ClientRow | null;
}

const EMPTY_FORM: ClientFormInput = {
  full_name: "",
  short_name: "",
  industry: undefined,
  transition_context: "",
  phase: "initial",
  referral_source: "",
  intake_notes: "",
  no_go_list: [],
  sizing: {},
  preferences: {},
};

export function Clients() {
  const { data: clients = [], isLoading } = useClients();
  const create = useCreateClient();
  const update = useUpdateClient();

  const [form, setForm] = useState<FormState>({ open: false, editing: null });
  const [values, setValues] = useState<ClientFormInput>(EMPTY_FORM);
  const [noGoInput, setNoGoInput] = useState("");

  const activeCount = useMemo(
    () => clients.filter((c) => c.phase !== "archived").length,
    [clients],
  );

  const atCap = activeCount >= CLIENT_CAP;

  const openCreate = () => {
    if (atCap) {
      toast.error(
        `Client cap reached (${CLIENT_CAP}). Archive one before adding another.`,
      );
      return;
    }
    setValues(EMPTY_FORM);
    setNoGoInput("");
    setForm({ open: true, editing: null });
  };

  const openEdit = (c: ClientRow) => {
    setValues({
      full_name: c.full_name,
      short_name: c.short_name ?? "",
      industry: c.industry ?? undefined,
      transition_context: c.transition_context ?? "",
      phase: c.phase,
      referral_source: c.referral_source ?? "",
      intake_notes: c.intake_notes ?? "",
      no_go_list: c.no_go_list ?? [],
      sizing: c.sizing ?? {},
      preferences: c.preferences ?? {},
    });
    setNoGoInput("");
    setForm({ open: true, editing: c });
  };

  const closeForm = () => setForm({ open: false, editing: null });

  const addNoGo = () => {
    const v = noGoInput.trim();
    if (!v) return;
    if (values.no_go_list.includes(v)) return;
    setValues({ ...values, no_go_list: [...values.no_go_list, v] });
    setNoGoInput("");
  };

  const removeNoGo = (tag: string) => {
    setValues({
      ...values,
      no_go_list: values.no_go_list.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = clientFormSchema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input.");
      return;
    }
    const payload = {
      ...parsed.data,
      short_name: parsed.data.short_name || null,
      transition_context: parsed.data.transition_context || null,
      referral_source: parsed.data.referral_source || null,
      intake_notes: parsed.data.intake_notes || null,
      industry: parsed.data.industry ?? null,
    };

    try {
      if (form.editing) {
        await update.mutateAsync({ id: form.editing.id, patch: payload });
        toast.success("Client updated.");
      } else {
        await create.mutateAsync(payload);
        toast.success("Client added.");
      }
      closeForm();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Request failed.";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeCount} of {CLIENT_CAP} active.
          </p>
        </div>
        <Button onClick={openCreate} disabled={atCap}>
          New client
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading.</div>
      ) : clients.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No clients yet. Add the first one from the button above.
        </div>
      ) : (
        <div className="border border-border/60 rounded">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border/60">
                <th className="p-3 font-normal">Name</th>
                <th className="p-3 font-normal">Phase</th>
                <th className="p-3 font-normal">In phase</th>
                <th className="p-3 font-normal">Industry</th>
                <th className="p-3 font-normal w-24"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border/40 last:border-b-0"
                >
                  <td className="p-3">
                    <Link
                      to={`/ops/clients/${c.id}`}
                      className="hover:underline"
                    >
                      {c.full_name}
                    </Link>
                    {c.short_name && (
                      <span className="text-muted-foreground ml-2">
                        ({c.short_name})
                      </span>
                    )}
                  </td>
                  <td className="p-3">{PHASE_LABEL[c.phase]}</td>
                  <td className="p-3 text-muted-foreground">
                    {phaseDurationDays(c.phase_started_at)}d
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {c.industry ? INDUSTRY_LABEL[c.industry] : "—"}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(c)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={form.open} onOpenChange={(o) => !o && closeForm()}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {form.editing ? "Edit client" : "New client"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  id="full_name"
                  value={values.full_name}
                  onChange={(e) =>
                    setValues({ ...values, full_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="short_name">Short name</Label>
                <Input
                  id="short_name"
                  value={values.short_name ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, short_name: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={values.industry ?? ""}
                  onValueChange={(v) =>
                    setValues({
                      ...values,
                      industry: (v || undefined) as ClientFormInput["industry"],
                    })
                  }
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(INDUSTRY_LABEL).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phase">Phase</Label>
                <Select
                  value={values.phase}
                  onValueChange={(v) =>
                    setValues({
                      ...values,
                      phase: v as ClientFormInput["phase"],
                    })
                  }
                >
                  <SelectTrigger id="phase">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PHASE_LABEL).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="referral_source">Referral source</Label>
                <Input
                  id="referral_source"
                  value={values.referral_source ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, referral_source: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="transition_context">Transition context</Label>
                <Textarea
                  id="transition_context"
                  rows={2}
                  value={values.transition_context ?? ""}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      transition_context: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-2 col-span-2">
                <Label>No-go list</Label>
                <div className="flex gap-2">
                  <Input
                    value={noGoInput}
                    onChange={(e) => setNoGoInput(e.target.value)}
                    placeholder="Tag, then press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addNoGo();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addNoGo}>
                    Add
                  </Button>
                </div>
                {values.no_go_list.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {values.no_go_list.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => removeNoGo(tag)}
                        className="text-xs border border-border/60 rounded px-2 py-1 hover:bg-muted"
                      >
                        {tag} <span className="text-muted-foreground">×</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="intake_notes">Intake notes</Label>
                <Textarea
                  id="intake_notes"
                  rows={4}
                  value={values.intake_notes ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, intake_notes: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={create.isPending || update.isPending}>
                {form.editing ? "Save changes" : "Create client"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
