import { useMemo, useState } from "react";
import {
  useVendors,
  useCreateVendor,
  useUpdateVendor,
} from "@/hooks/queries/useVendors";
import {
  VENDOR_CATEGORY_LABEL,
  vendorFormSchema,
  type VendorFormInput,
} from "@/lib/vendors";
import type { VendorRow } from "@/types/vendors";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface FormState {
  open: boolean;
  editing: VendorRow | null;
}

const EMPTY_FORM: VendorFormInput = {
  name: "",
  contact_name: "",
  email: "",
  phone: "",
  website: "",
  category: "other",
  specialty: "",
  country: "",
  city: "",
  payment_terms: "",
  account_number: "",
  notes: "",
  is_active: true,
};

export function Vendors() {
  const { data: vendors = [], isLoading } = useVendors();
  const create = useCreateVendor();
  const update = useUpdateVendor();

  const [form, setForm] = useState<FormState>({ open: false, editing: null });
  const [values, setValues] = useState<VendorFormInput>(EMPTY_FORM);

  const activeCount = useMemo(
    () => vendors.filter((v) => v.is_active).length,
    [vendors],
  );

  const openCreate = () => {
    setValues(EMPTY_FORM);
    setForm({ open: true, editing: null });
  };

  const openEdit = (v: VendorRow) => {
    setValues({
      name: v.name,
      contact_name: v.contact_name ?? "",
      email: v.email ?? "",
      phone: v.phone ?? "",
      website: v.website ?? "",
      category: v.category,
      specialty: v.specialty ?? "",
      country: v.country ?? "",
      city: v.city ?? "",
      payment_terms: v.payment_terms ?? "",
      account_number: v.account_number ?? "",
      notes: v.notes ?? "",
      is_active: v.is_active,
    });
    setForm({ open: true, editing: v });
  };

  const closeForm = () => setForm({ open: false, editing: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = vendorFormSchema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input.");
      return;
    }
    const payload = {
      ...parsed.data,
      contact_name: parsed.data.contact_name || null,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      website: parsed.data.website || null,
      specialty: parsed.data.specialty || null,
      country: parsed.data.country || null,
      city: parsed.data.city || null,
      payment_terms: parsed.data.payment_terms || null,
      account_number: parsed.data.account_number || null,
      notes: parsed.data.notes || null,
    };

    try {
      if (form.editing) {
        await update.mutateAsync({ id: form.editing.id, patch: payload });
        toast.success("Vendor updated.");
      } else {
        await create.mutateAsync(payload);
        toast.success("Vendor added.");
      }
      closeForm();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Request failed.";
      toast.error(msg);
    }
  };

  const locationDisplay = (v: VendorRow) => {
    const parts = [v.city, v.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "\u2014";
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif">Vendors</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeCount} active.
          </p>
        </div>
        <Button onClick={openCreate}>
          New vendor
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading.</div>
      ) : vendors.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No vendors yet. Add the first one from the button above.
        </div>
      ) : (
        <div className="border border-border/60 rounded">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border/60">
                <th className="p-3 font-normal">Name</th>
                <th className="p-3 font-normal">Category</th>
                <th className="p-3 font-normal">Contact</th>
                <th className="p-3 font-normal">City / Country</th>
                <th className="p-3 font-normal">Status</th>
                <th className="p-3 font-normal w-24"></th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-border/40 last:border-b-0"
                >
                  <td className="p-3">
                    <span className="font-medium">{v.name}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {VENDOR_CATEGORY_LABEL[v.category]}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {v.contact_name || "\u2014"}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {locationDisplay(v)}
                  </td>
                  <td className="p-3">
                    {v.is_active ? (
                      <Badge variant="secondary">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(v)}
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
              {form.editing ? "Edit vendor" : "New vendor"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="name">Vendor name</Label>
                <Input
                  id="name"
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={values.category}
                  onValueChange={(v) =>
                    setValues({
                      ...values,
                      category: v as VendorFormInput["category"],
                    })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(VENDOR_CATEGORY_LABEL).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contact_name">Contact name</Label>
                <Input
                  id="contact_name"
                  value={values.contact_name ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, contact_name: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={values.email ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={values.phone ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, phone: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={values.website ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, website: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  value={values.specialty ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, specialty: e.target.value })
                  }
                  placeholder="e.g. Italian silks, bespoke suiting"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={values.city ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, city: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={values.country ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, country: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="payment_terms">Payment terms</Label>
                <Input
                  id="payment_terms"
                  value={values.payment_terms ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, payment_terms: e.target.value })
                  }
                  placeholder="e.g. Net 30, COD"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="account_number">Account number</Label>
                <Input
                  id="account_number"
                  value={values.account_number ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, account_number: e.target.value })
                  }
                />
              </div>

              {form.editing && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="is_active">Status</Label>
                  <Select
                    value={values.is_active ? "true" : "false"}
                    onValueChange={(v) =>
                      setValues({ ...values, is_active: v === "true" })
                    }
                  >
                    <SelectTrigger id="is_active">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={values.notes ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={create.isPending || update.isPending}>
                {form.editing ? "Save changes" : "Create vendor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
