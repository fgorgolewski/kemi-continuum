import { z } from "zod";

export const vendorCategorySchema = z.enum([
  "fabric",
  "clothing",
  "accessories",
  "shoes",
  "tailoring",
  "jewelry",
  "other",
]);

export const vendorFormSchema = z.object({
  name: z.string().min(1, "Vendor name is required").max(200),
  contact_name: z.string().max(200).optional().or(z.literal("")),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  website: z.string().max(500).optional().or(z.literal("")),
  category: vendorCategorySchema,
  specialty: z.string().max(500).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  payment_terms: z.string().max(200).optional().or(z.literal("")),
  account_number: z.string().max(100).optional().or(z.literal("")),
  notes: z.string().max(8000).optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

export type VendorFormInput = z.infer<typeof vendorFormSchema>;

export const VENDOR_CATEGORY_LABEL: Record<
  z.infer<typeof vendorCategorySchema>,
  string
> = {
  fabric: "Fabric",
  clothing: "Clothing",
  accessories: "Accessories",
  shoes: "Shoes",
  tailoring: "Tailoring",
  jewelry: "Jewelry",
  other: "Other",
};
