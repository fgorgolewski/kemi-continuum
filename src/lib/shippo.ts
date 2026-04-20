// Shippo API client — calls the Supabase Edge Function.

import { supabase } from "./supabase";

const SHIPPO_FUNCTION =
  import.meta.env.VITE_SHIPPO_FUNCTION_URL ??
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shippo`;

async function shippoCall<T>(body: Record<string, unknown>): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(SHIPPO_FUNCTION, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Shippo error ${res.status}: ${err}`);
  }

  return res.json();
}

/* ───────── Types ───────── */

export interface ShippoRate {
  object_id: string;
  provider: string;
  service_level: string;
  amount: string;
  currency: string;
  estimated_days: number | null;
  duration_terms: string | null;
}

export interface ShippoAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

export interface ShippoParcel {
  length: number;
  width: number;
  height: number;
  distance_unit: "in" | "cm";
  weight: number;
  mass_unit: "lb" | "kg";
}

export interface ShippoLabel {
  tracking_number: string;
  tracking_url: string | null;
  label_url: string;
  status: string;
  carrier: string | null;
}

export interface ShippoTrackingStatus {
  status: string;
  status_details: string;
  status_date: string;
  location: {
    city: string;
    state: string;
    country: string;
  } | null;
}

export interface ShippoTrackingResult {
  tracking_status: ShippoTrackingStatus | null;
  tracking_history: ShippoTrackingStatus[];
  eta: string | null;
}

/* ───────── API calls ───────── */

export async function getShippingRates(
  addressFrom: ShippoAddress,
  addressTo: ShippoAddress,
  parcel: ShippoParcel,
): Promise<{ shipment_id: string; rates: ShippoRate[] }> {
  return shippoCall({
    action: "rates",
    address_from: addressFrom,
    address_to: addressTo,
    parcel,
  });
}

export async function purchaseLabel(rateId: string): Promise<ShippoLabel> {
  return shippoCall({
    action: "purchase_label",
    rate_id: rateId,
  });
}

export async function trackShipment(
  carrier: string,
  trackingNumber: string,
): Promise<ShippoTrackingResult> {
  return shippoCall({
    action: "track",
    carrier,
    tracking_number: trackingNumber,
  });
}

/* ───────── Default parcel (standard styling box) ───────── */

export const DEFAULT_PARCEL: ShippoParcel = {
  length: 16,
  width: 12,
  height: 8,
  distance_unit: "in",
  weight: 5,
  mass_unit: "lb",
};

/* ───────── Kemissa return address (update with real address) ───────── */

export const KEMISSA_ADDRESS: ShippoAddress = {
  name: "Kemissa Continuum",
  street1: "",   // Fill in your address
  city: "",
  state: "",
  zip: "",
  country: "US",
};
