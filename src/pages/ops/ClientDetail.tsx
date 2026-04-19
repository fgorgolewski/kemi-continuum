import { useParams, Link } from "react-router-dom";
import { useClient } from "@/hooks/queries/useClients";
import { INDUSTRY_LABEL, PHASE_LABEL } from "@/lib/schemas";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="text-sm text-muted-foreground">
      {title} surface is not wired up yet. Schema is in place; UI lands
      in the next commits.
    </div>
  );
}

export function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading, error } = useClient(id);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading.</div>;
  }
  if (error || !client) {
    return (
      <div className="text-sm">
        Client not found.{" "}
        <Link to="/ops/clients" className="underline">
          Back to clients
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="text-xs text-muted-foreground mb-2">
        <Link to="/ops/clients" className="hover:underline">
          Clients
        </Link>{" "}
        / {client.full_name}
      </div>
      <h1 className="text-2xl font-serif mb-1">{client.full_name}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {PHASE_LABEL[client.phase]}
        {client.industry ? ` · ${INDUSTRY_LABEL[client.industry]}` : ""}
        {client.referral_source ? ` · referred by ${client.referral_source}` : ""}
      </p>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="annual-map">Annual Map</TabsTrigger>
          <TabsTrigger value="wardrobe">Wardrobe</TabsTrigger>
          <TabsTrigger value="decisions">Decisions</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="welcome">Welcome Package</TabsTrigger>
          <TabsTrigger value="intensives">Intensives</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <dl className="grid grid-cols-[10rem_1fr] gap-y-3 text-sm max-w-2xl">
            <dt className="text-muted-foreground">Transition</dt>
            <dd>{client.transition_context || "—"}</dd>
            <dt className="text-muted-foreground">No-go list</dt>
            <dd>
              {(client.no_go_list ?? []).length > 0
                ? (client.no_go_list ?? []).join(", ")
                : "—"}
            </dd>
            <dt className="text-muted-foreground">Intake notes</dt>
            <dd className="whitespace-pre-wrap">{client.intake_notes || "—"}</dd>
            <dt className="text-muted-foreground">Phase started</dt>
            <dd>{client.phase_started_at}</dd>
          </dl>
        </TabsContent>
        <TabsContent value="annual-map" className="mt-6">
          <PlaceholderPanel title="Annual Map" />
        </TabsContent>
        <TabsContent value="wardrobe" className="mt-6">
          <PlaceholderPanel title="Wardrobe" />
        </TabsContent>
        <TabsContent value="decisions" className="mt-6">
          <PlaceholderPanel title="Decisions" />
        </TabsContent>
        <TabsContent value="communications" className="mt-6">
          <PlaceholderPanel title="Communications" />
        </TabsContent>
        <TabsContent value="documents" className="mt-6">
          <PlaceholderPanel title="Documents" />
        </TabsContent>
        <TabsContent value="welcome" className="mt-6">
          <PlaceholderPanel title="Welcome Package" />
        </TabsContent>
        <TabsContent value="intensives" className="mt-6">
          <PlaceholderPanel title="Intensives" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
