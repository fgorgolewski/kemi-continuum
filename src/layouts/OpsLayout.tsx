import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DilaWidget } from "@/components/ops/assistant/DilaWidget";

const NAV = [
  { to: "/ops", label: "Today", end: true },
  { to: "/ops/dila", label: "Dila" },
  { to: "/ops/clients", label: "Clients" },
  { to: "/ops/annual-map", label: "Annual Map" },
  { to: "/ops/wardrobe", label: "Wardrobe Ops" },
  { to: "/ops/welcome-packages", label: "Welcome Packages" },
  { to: "/ops/collaborators", label: "Collaborators" },
  { to: "/ops/intensives", label: "Intensives" },
  { to: "/ops/financials", label: "Financials" },
];

function initialsFor(email: string | undefined | null): string {
  if (!email) return "—";
  const local = email.split("@")[0] ?? "";
  const first = local[0]?.toUpperCase() ?? "";
  const dot = local.split(/[._-]/)[1]?.[0]?.toUpperCase() ?? "";
  return `${first}${dot}`.slice(0, 2) || first || "—";
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
        <nav className="flex flex-col gap-1 text-sm">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "px-2 py-1.5 rounded",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
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
