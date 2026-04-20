// Orders pipeline constants and helpers.

import type { OrderStatus, DeliveryType, Carrier } from "@/types/orders";

/* ───────── Pipeline stages (in order) ───────── */

export const ORDER_STAGES: OrderStatus[] = [
  "ordered",
  "received",
  "repacked",
  "shipping_booked",
  "shipped",
  "delivered",
];

export const STAGE_LABEL: Record<OrderStatus, string> = {
  ordered: "Ordered",
  received: "Received",
  repacked: "Repacked",
  shipping_booked: "Shipping Booked",
  shipped: "Shipped",
  delivered: "Delivered",
};

export const STAGE_COLOR: Record<OrderStatus, string> = {
  ordered: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  received: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  repacked: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  shipping_booked: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  shipped: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

export const DELIVERY_LABEL: Record<DeliveryType, string> = {
  standard: "Standard",
  white_glove: "White Glove",
};

export const CARRIER_LABEL: Record<Carrier, string> = {
  dhl: "DHL Express",
  fedex: "FedEx",
  ups: "UPS",
  usps: "USPS",
  shippo: "Shippo",
  uber_direct: "Uber Direct",
  other: "Other",
};

/* ───────── Stage progression ───────── */

export function nextStage(current: OrderStatus): OrderStatus | null {
  const idx = ORDER_STAGES.indexOf(current);
  return idx < ORDER_STAGES.length - 1 ? ORDER_STAGES[idx + 1] : null;
}

export function prevStage(current: OrderStatus): OrderStatus | null {
  const idx = ORDER_STAGES.indexOf(current);
  return idx > 0 ? ORDER_STAGES[idx - 1] : null;
}

/** Returns the timestamp field name for a given stage */
export function stageTimestampField(
  stage: OrderStatus,
): string {
  return `${stage}_at`;
}
