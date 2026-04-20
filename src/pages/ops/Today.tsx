import { useActiveClientCount } from "@/hooks/queries/useClients";

export function Today() {
  const { activeCount, isLoading } = useActiveClientCount();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-serif mb-2">Today</h1>
      <p className="text-sm text-muted-foreground mb-10">
        {isLoading
          ? "Loading roster."
          : `${activeCount} active client${activeCount !== 1 ? "s" : ""}.`}
      </p>
      <div className="text-sm text-muted-foreground">
        Day view is intentionally minimal for now. Events, pending
        decisions, and sourcing items land here once the surfaces are
        wired up.
      </div>
    </div>
  );
}
