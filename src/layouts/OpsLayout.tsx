import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DilaWidget } from "@/components/ops/assistant/DilaWidget";

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

interface NavGroup {
  label: string;
  children: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

const NAV: NavEntry[] = [
  { to: "/ops", label: "Today", end: true },
  { to: "/ops/dila", label: "Dila" },
  { to: "/ops/clients", label: "Clients" },
  { to: "/ops/orders", label: "Orders" },
  {
    label: "Client Services",
    children: [
      { to: "/ops/annual-map", label: "Annual Map" },
      { to: "/ops/wardrobe", label: "Wardrobe Ops" },
      { to: "/ops/welcome-packages", label: "Welcome Packages" },
      { to: "/ops/intensives", label: "Intensives" },
    ],
  },
  {
    label: "Business",
    children: [
      { to: "/ops/vendors", label: "Vendors" },
      { to: "/ops/collaborators", label: "Collaborators" },
      { to: "/ops/financials", label: "Financials" },
    ],
  },
];

function initialsFor(email: string | undefined | null): string {
  if (!email) return "—";
  const local = email.split("@")[0] ?? "";
  const first = local[0]?.toUpperCase() ?? "";
  const dot = local.split(/[._-]/)[1]?.[0]?.toUpperCase() ?? "";
  return `${first}${dot}`.slice(0, 2) || first || "—";
}

function NavLinkItem({ item, nested }: { item: NavItem; nested?: boolean }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        [
          "block py-1.5 transition-colors duration-200",
          nested ? "px-0" : "px-2 rounded",
          isActive
            ? nested
              ? "text-foreground"
              : "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground",
        ].join(" ")
      }
    >
      {item.label}
    </NavLink>
  );
}

function NavGroupItem({ group }: { group: NavGroup }) {
  const location = useLocation();
  const childActive = group.children.some((c) =>
    location.pathname.startsWith(c.to),
  );
  const [open, setOpen] = useState(childActive);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [open]);

  // Auto-open when a child becomes active
  useEffect(() => {
    if (childActive && !open) setOpen(true);
  }, [childActive]);

  return (
    <div className="mt-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className={[
          "w-full px-2 py-1.5 rounded text-left transition-colors duration-200",
          "text-[0.65rem] uppercase tracking-[0.15em] font-medium",
          childActive
            ? "text-foreground"
            : "text-muted-foreground/70 hover:text-muted-foreground",
        ].join(" ")}
      >
        {group.label}
      </button>

      <div
        style={{
          maxHeight: open ? `${height}px` : "0px",
          opacity: open ? 1 : 0,
        }}
        className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <div ref={contentRef} className="flex flex-col gap-0.5 pl-4 pb-1">
          {group.children.map((child, i) => (
            <div
              key={child.to}
              style={{
                transitionDelay: open ? `${i * 40}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "translateX(0)" : "translateX(-6px)",
              }}
              className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <NavLinkItem item={child} nested />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OpsLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const onDilaPage = location.pathname === "/ops/dila";

  const handleSignOut = async () => {
    await signOut();
    navigate("/ops/login", { replace: true });
  };

  return (
    <div className="min-h-screen grid grid-cols-[14rem_1fr] bg-background text-foreground">
      <aside className="border-r border-border/60 p-6 flex flex-col gap-6">
        <div className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
          Continuum Ops
        </div>
        <nav className="flex flex-col gap-0.5 text-sm">
          {NAV.map((entry) =>
            isGroup(entry) ? (
              <NavGroupItem key={entry.label} group={entry} />
            ) : (
              <NavLinkItem key={entry.to} item={entry} />
            ),
          )}
        </nav>
      </aside>

      <div className="flex flex-col min-h-screen">
        <header className="h-14 border-b border-border/60 px-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{user?.email}</div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full border border-border/60 flex items-center justify-center text-xs tracking-wide">
              {initialsFor(user?.email)}
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>

      {/* Floating Dila chat — hidden on the full Dila page */}
      {!onDilaPage && <DilaWidget />}
    </div>
  );
}
