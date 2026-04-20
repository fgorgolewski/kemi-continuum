// Supabase Edge Function — Shippo shipping integration
//
// Deploy:  supabase functions deploy shippo --no-verify-jwt
// Secret:  supabase secrets set SHIPPO_API_KEY=shippo_live_...
//
// Actions: rates, purchase_label, track

const SHIPPO_API_KEY = Deno.env.get("SHIPPO_API_KEY")!;
const SHIPPO_BASE = "https://api.goshippo.com";

async function shippoFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${SHIPPO_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `ShippoToken ${SHIPPO_API_KEY}`,
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

// ─── Get shipping rates ───
async function getRates(body: {
  address_from: Record<string, string>;
  address_to: Record<string, string>;
  parcel: Record<string, string | number>;
}) {
  const shipment = await shippoFetch("/shipments", {
    method: "POST",
    body: JSON.stringify({
      address_from: body.address_from,
      address_to: body.address_to,
      parcels: [body.parcel],
      extra: { signature_confirmation: "STANDARD" },
      async: false,
    }),
  });

  // Return simplified rates sorted by price
  const rates = (shipment.rates ?? [])
    .map((r: Record<string, unknown>) => ({
      object_id: r.object_id,
      provider: r.provider,
      service_level: (r.servicelevel as Record<string, string>)?.name ?? "",
      amount: r.amount,
      currency: r.currency,
      estimated_days: r.estimated_days,
      duration_terms: r.duration_terms,
    }))
    .sort(
      (a: { amount: string }, b: { amount: string }) =>
        parseFloat(a.amount) - parseFloat(b.amount),
    );

  return { shipment_id: shipment.object_id, rates };
}

// ─── Purchase a label ───
async function purchaseLabel(body: { rate_id: string }) {
  const transaction = await shippoFetch("/transactions", {
    method: "POST",
    body: JSON.stringify({
      rate: body.rate_id,
      label_file_type: "PDF",
      async: false,
    }),
  });

  return {
    tracking_number: transaction.tracking_number,
    tracking_url: transaction.tracking_url_provider,
    label_url: transaction.label_url,
    status: transaction.status,
    carrier: transaction.tracking_number
      ? (transaction.tracking_url_provider ?? "").includes("dhl")
        ? "dhl"
        : "other"
      : null,
  };
}

// ─── Track a shipment ───
async function trackShipment(body: {
  carrier: string;
  tracking_number: string;
}) {
  const data = await shippoFetch(
    `/tracks/${encodeURIComponent(body.carrier)}/${encodeURIComponent(body.tracking_number)}`,
  );

  return {
    tracking_status: data.tracking_status,
    tracking_history: (data.tracking_history ?? []).slice(0, 10),
    eta: data.eta,
    address_from: data.address_from,
    address_to: data.address_to,
  };
}

Deno.serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    const { action, ...params } = await req.json();

    let result: unknown;

    switch (action) {
      case "rates":
        result = await getRates(params as Parameters<typeof getRates>[0]);
        break;
      case "purchase_label":
        result = await purchaseLabel(
          params as Parameters<typeof purchaseLabel>[0],
        );
        break;
      case "track":
        result = await trackShipment(
          params as Parameters<typeof trackShipment>[0],
        );
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
    }

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Shippo error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Shippo request failed",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
});
