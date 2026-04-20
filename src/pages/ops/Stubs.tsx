import {
  Calendar,
  Shirt,
  Gift,
  Users,
  Sparkles,
  DollarSign,
  Plus,
  Search,
  Package,
  Scissors,
  Eye,
  Plane,
  Star,
  FileText,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ───────── Shared empty-state helpers ───────── */

function EmptyColumn({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="border border-border/60 rounded-lg flex-1 min-w-[10rem]">
      <div className="px-4 py-3 border-b border-border/40">
        <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground font-medium">
          {label}
        </span>
      </div>
      <div className="p-4 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 py-2 border-b border-border/20 last:border-0">
            <div className="h-3 w-3 rounded-full border border-border/30 flex-shrink-0" />
            <span className="text-sm text-muted-foreground/30">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyRow({ cells }: { cells: string[] }) {
  return (
    <tr className="border-b border-border/20 last:border-0">
      {cells.map((cell, i) => (
        <td key={i} className="p-3 text-sm text-muted-foreground/25">{cell}</td>
      ))}
    </tr>
  );
}

/* ───────── Annual Map ───────── */

export function AnnualMap() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif">Annual Map</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cross-client calendar of events, travel, and visibility moments.
          </p>
        </div>
        <Button disabled><Plus className="h-4 w-4 mr-1" /> Add event</Button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {months.map((m, i) => (
          <div key={m} className="border border-border/40 rounded-lg p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground/40 mb-3 font-medium">{m}</div>
            <div className="space-y-2">
              {i === 3 || i === 5 || i === 11 ? (
                <><div className="h-2 rounded-full bg-border/30 w-3/4" /><div className="h-2 rounded-full bg-border/20 w-1/2" /></>
              ) : (
                <div className="h-8" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-border/40 rounded-lg p-5">
        <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-4 font-medium">Event types</div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Calendar, label: "Social events", desc: "Galas, dinners, fundraisers" },
            { icon: Plane, label: "Travel", desc: "Business trips, vacations, conferences" },
            { icon: Eye, label: "Visibility moments", desc: "Press, speaking, photo ops" },
            { icon: Star, label: "Personal milestones", desc: "Birthdays, anniversaries" },
            { icon: Shirt, label: "Seasonal resets", desc: "Wardrobe transitions by season" },
            { icon: Sparkles, label: "Intensives", desc: "Deep-dive styling sessions" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="h-4 w-4 text-muted-foreground/30 mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground/40">{label}</div>
                <div className="text-xs text-muted-foreground/25">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── Wardrobe Ops ───────── */

export function WardrobeOps() {
  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif">Wardrobe Ops</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sourcing pipeline and tailoring queue across all clients.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled><Search className="h-4 w-4 mr-1" /> Source item</Button>
          <Button disabled><Plus className="h-4 w-4 mr-1" /> Add to queue</Button>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3 font-medium">Sourcing pipeline</div>
        <div className="flex gap-3">
          <EmptyColumn label="Requested" items={["Navy cashmere blazer", "Silk pocket squares x3"]} />
          <EmptyColumn label="Sourcing" items={["Italian leather belt", "Linen shirts (summer)"]} />
          <EmptyColumn label="Ordered" items={["Bespoke suit fabric"]} />
          <EmptyColumn label="Delivered" items={["Monogrammed cufflinks"]} />
        </div>
      </div>

      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3 font-medium">Tailoring queue</div>
        <div className="border border-border/60 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Client</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Item</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Tailor</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Status</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Due</th>
              </tr>
            </thead>
            <tbody>
              <EmptyRow cells={["Client name", "Suit jacket — sleeve shorten", "Tailor name", "In progress", "Apr 28"]} />
              <EmptyRow cells={["Client name", "Trousers — hem and taper", "Tailor name", "Pending pickup", "May 2"]} />
              <EmptyRow cells={["Client name", "Dress shirt — collar adjust", "Tailor name", "Scheduled", "May 10"]} />
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3 font-medium">Wardrobe inventory</div>
        <div className="grid grid-cols-4 gap-3">
          {["Suits & Blazers", "Shirts & Tops", "Trousers & Bottoms", "Accessories", "Outerwear", "Shoes", "Formalwear", "Casual"].map((cat) => (
            <div key={cat} className="border border-border/40 rounded-lg p-4 text-center">
              <div className="text-2xl font-serif text-muted-foreground/20 mb-1">0</div>
              <div className="text-xs text-muted-foreground/30">{cat}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── Welcome Packages ───────── */

export function WelcomePackages() {
  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif">Welcome Packages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Onboarding kits for new clients. Letter, curated object, book, all packed and dispatched.
          </p>
        </div>
        <Button disabled><Plus className="h-4 w-4 mr-1" /> New package</Button>
      </div>

      <div className="flex gap-3">
        <EmptyColumn label="Letter drafted" items={["Personal welcome letter", "Style philosophy note"]} />
        <EmptyColumn label="Object selected" items={["Curated accessory", "Monogrammed item"]} />
        <EmptyColumn label="Book chosen" items={["Style reference book", "Art/culture title"]} />
        <EmptyColumn label="Packed" items={["Gift wrapped", "Branded packaging"]} />
        <EmptyColumn label="Dispatched" items={["White glove delivery", "Tracking confirmed"]} />
        <EmptyColumn label="Delivered" items={["Signature received", "Follow-up scheduled"]} />
      </div>
    </div>
  );
}

/* ───────── Collaborators ───────── */

export function Collaborators() {
  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif">Collaborators</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Trusted partners: tailors, grooming specialists, cobblers, boutique contacts.
          </p>
        </div>
        <Button disabled><Plus className="h-4 w-4 mr-1" /> Add collaborator</Button>
      </div>

      <div className="border border-border/60 rounded-lg overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40">
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Name</th>
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Specialty</th>
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Location</th>
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Contact</th>
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            <EmptyRow cells={["Tailor name", "Bespoke suiting", "City", "email@example.com", "Active"]} />
            <EmptyRow cells={["Grooming specialist", "Men's grooming", "City", "email@example.com", "Active"]} />
            <EmptyRow cells={["Cobbler", "Shoe restoration", "City", "email@example.com", "Active"]} />
            <EmptyRow cells={["Boutique partner", "Luxury accessories", "City", "email@example.com", "Active"]} />
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Scissors, label: "Tailoring", count: 0 },
          { icon: Users, label: "Grooming", count: 0 },
          { icon: Package, label: "Boutiques", count: 0 },
          { icon: Star, label: "Jewelers", count: 0 },
          { icon: Shirt, label: "Dry cleaning", count: 0 },
          { icon: Gift, label: "Gifting partners", count: 0 },
        ].map(({ icon: Icon, label, count }) => (
          <div key={label} className="border border-border/40 rounded-lg p-4 flex items-center gap-3">
            <Icon className="h-4 w-4 text-muted-foreground/25" />
            <div>
              <div className="text-sm text-muted-foreground/40">{label}</div>
              <div className="text-xs text-muted-foreground/25">{count} partners</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Intensives ───────── */

export function Intensives() {
  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif">Intensives</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Deep-dive sessions: event styling, travel wardrobes, seasonal resets, grooming systems.
          </p>
        </div>
        <Button disabled><Plus className="h-4 w-4 mr-1" /> Schedule intensive</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { icon: Sparkles, title: "Event Styling", desc: "Complete look for galas, weddings, keynotes.", fields: ["Client","Event","Date","Dress code","Look direction","Items needed"] },
          { icon: Plane, title: "Travel Wardrobe", desc: "Capsule packing for business trips, vacations.", fields: ["Client","Destination","Duration","Climate","Occasions","Luggage type"] },
          { icon: Shirt, title: "Seasonal Reset", desc: "Full wardrobe audit. Archive, repair, replace, source.", fields: ["Client","Season","Audit date","Items reviewed","Items archived","Gaps identified"] },
          { icon: Gift, title: "Gifting System", desc: "Curated gift lists for key relationships.", fields: ["Client","Recipient","Occasion","Budget","Preferences","Status"] },
        ].map(({ icon: Icon, title, desc, fields }) => (
          <div key={title} className="border border-border/60 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-muted-foreground/30" />
              <h3 className="text-sm font-medium text-muted-foreground/40">{title}</h3>
            </div>
            <p className="text-xs text-muted-foreground/30 mb-4">{desc}</p>
            <div className="space-y-2">
              {fields.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground/25 min-w-[6rem]">{f}</span>
                  <div className="flex-1 h-px bg-border/20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-border/60 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40">
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Client</th>
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Type</th>
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Date</th>
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            <EmptyRow cells={["Client name", "Event Styling", "May 15, 2026", "Scheduled"]} />
            <EmptyRow cells={["Client name", "Seasonal Reset", "Jun 1, 2026", "Pending"]} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────── Financials ───────── */

export function Financials() {
  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif">Financials</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Revenue tracking, invoices, and run-rate against targets.
          </p>
        </div>
        <Button variant="outline" disabled><FileText className="h-4 w-4 mr-1" /> Export</Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Monthly revenue", value: "$0", icon: DollarSign, sub: "Target: $9,250–11,667" },
          { label: "Outstanding invoices", value: "0", icon: FileText, sub: "$0 pending" },
          { label: "Annual run-rate", value: "$0", icon: TrendingUp, sub: "Target: $111–140K" },
          { label: "Avg. client value", value: "$0", icon: CreditCard, sub: "Per active client" },
        ].map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="border border-border/60 rounded-lg p-5">
            <Icon className="h-4 w-4 text-muted-foreground/30 mb-3" />
            <div className="text-2xl font-serif text-muted-foreground/20">{value}</div>
            <div className="text-xs text-muted-foreground/40 mt-1">{label}</div>
            <div className="text-[0.65rem] text-muted-foreground/25 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <div className="border border-border/60 rounded-lg p-6 mb-6">
        <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground/40 mb-4 font-medium">Monthly revenue</div>
        <div className="flex items-end gap-2 h-32">
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-border/20 rounded-t" style={{ height: `${10 + (i * 7) % 50}%` }} />
              <span className="text-[0.6rem] text-muted-foreground/25">{m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-border/60 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40">
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Invoice</th>
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Client</th>
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Amount</th>
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Currency</th>
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Status</th>
              <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground/40 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            <EmptyRow cells={["INV-0001", "Client name", "$2,400.00", "USD", "Paid", "2026-04-01"]} />
            <EmptyRow cells={["INV-0002", "Client name", "€1,800.00", "EUR", "Pending", "2026-04-15"]} />
            <EmptyRow cells={["INV-0003", "Client name", "$3,200.00", "USD", "Draft", "2026-04-20"]} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────── Not Found ───────── */

export function OpsNotFound() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-serif mb-2">Not found</h1>
      <p className="text-sm text-muted-foreground">
        This page doesn't exist in the ops dashboard. Use the sidebar to navigate.
      </p>
    </div>
  );
}
