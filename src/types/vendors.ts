export type VendorCategory =
  | "fabric"
  | "clothing"
  | "accessories"
  | "shoes"
  | "tailoring"
  | "jewelry"
  | "other";

export interface VendorRow {
  id: string;
  user_id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  category: VendorCategory;
  specialty: string | null;
  country: string | null;
  city: string | null;
  payment_terms: string | null;
  account_number: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type VendorInsert = Omit<
  VendorRow,
  "id" | "created_at" | "updated_at"
> & {
  id?: string;
};

export type VendorUpdate = Partial<VendorInsert>;
