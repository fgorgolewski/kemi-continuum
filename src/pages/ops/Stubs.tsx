// Placeholder pages for surfaces that are scoped but not yet built.
// Each is a thin component so the nav routes resolve and layout is
// consistent. Real implementations land in subsequent commits per
// build_plan.md weeks 2–4.

function Stub({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-serif mb-2">{title}</h1>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

export function AnnualMap() {
  return (
    <Stub
      title="Annual Map"
      body="Cross-client calendar of events, travel, and visibility moments. Built in Week 4."
    />
  );
}

export function WardrobeOps() {
  return (
    <Stub
      title="Wardrobe Ops"
      body="Sourcing pipeline and tailoring queue across clients. Built in Weeks 2–3."
    />
  );
}

export function WelcomePackages() {
  return (
    <Stub
      title="Welcome Packages"
      body="Checklist board: letter drafted → object → book → packed → dispatched → delivered. Built in Week 3."
    />
  );
}

export function Collaborators() {
  return (
    <Stub
      title="Collaborators"
      body="Tailor, grooming specialist, cobbler, boutique partners. Built in Week 3."
    />
  );
}

export function Intensives() {
  return (
    <Stub
      title="Intensives"
      body="Event styling, travel wardrobe, seasonal resets, expanded gifting, grooming systems. Built in Week 4."
    />
  );
}

export function Financials() {
  return (
    <Stub
      title="Financials"
      body="USD run-rate vs. $111–140K target. EUR invoices converted via stored equivalent. Stripe columns are placeholder-only in this phase."
    />
  );
}

export function OpsNotFound() {
  return (
    <Stub
      title="Not found"
      body="The page requested is not part of the ops surface. Use the sidebar."
    />
  );
}
