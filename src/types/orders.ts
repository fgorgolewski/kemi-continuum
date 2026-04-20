// Orders pipeline types — mirrors the orders table in Supabase.

export type OrderStatus =
  | "ordered"
  | "received"
  | "repacked"
  | "shipping_booked"
  | "shipped"
  | "delivered";

export type DeliveryType = "standard" | "white_glove";

export type Carrier =
  | "dhl"
  | "fedex"
  | "ups"
  | "usps"
  | "shippo"
  | "uber_direct"
  | "other";

export interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface OrderRow {
  id: string;
  user_id: string;
  client_id: string | null;
  client_name: string;
  description: string | null;
  items: OrderItem[];
  status: OrderStatus;
  delivery_type: DeliveryType;
  signature_required: boolean;
  carrier: Carrier | null;
  tracking_number: string | null;
  shipping_label_url: string | null;
  estimated_delivery: string | null;
  shipping_address: ShippingAddress | null;
  ordered_at: string;
  received_at: string | null;
  repacked_at: string | null;
  shipping_booked_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderInsert = Omit<
  OrderRow,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export type OrderUpdate = Partial<
  Pick<
    OrderRow,
    | "client_name"
    | "description"
    | "items"
    | "status"
    | "delivery_type"
    | "signature_required"
    | "carrier"
    | "tracking_number"
    | "shipping_label_url"
    | "estimated_delivery"
    | "shipping_address"
    | "ordered_at"
    | "received_at"
    | "repacked_at"
    | "shipping_booked_at"
    | "shipped_at"
    | "delivered_at"
    | "notes"
  >
>;
