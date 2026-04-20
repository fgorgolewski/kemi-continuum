import { format } from "date-fns";
import { useActiveClientCount, useClients } from "@/hooks/queries/useClients";
import { useOrders } from "@/hooks/queries/useOrders";
import { useEATasks, useEAReminders } from "@/hooks/queries/useAssistant";
import { CalendarWidget } from "@/components/ops/CalendarWidget";
import { STAGE_LABEL, STAGE_COLOR } from "@/lib/orders";
import { PRIORITY_LABEL } from "@/lib/ea";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Users,
  Package,
  CheckSquare,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  to,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="border border-border/60 rounded-lg p-5 hover:border-border transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <ArrowRight className="h-3 w-3 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
      </div>
      <div className="text-2xl font-serif">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </Link>
  );
}

export function Today() {
  const { activeCount } = useActiveClientCount();
  const { data: orders = [] } = useOrders();
  const { data: tasks = [] } = useEATasks("pending");
  const { data: reminders = [] } = useEAReminders();

  const activeOrders = orders.filter((o) => o.status !== "delivered");
  const pendingTasks = tasks.slice(0, 5);
  const activeReminders = reminders.slice(0, 4);
  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif">Today</h1>
        <p className="text-sm text-muted-foreground mt-1">{today}</p>
      </div>

      {/* Calendar */}
      <div className="mb-8">
        <CalendarWidget />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Active clients"
          value={activeCount}
          icon={Users}
          to="/ops/clients"
        />
        <StatCard
          label="Orders in pipeline"
          value={activeOrders.length}
          icon={Package}
          to="/ops/orders"
        />
        <StatCard
          label="Pending tasks"
          value={pendingTasks.length}
          icon={CheckSquare}
          to="/ops/dila"
        />
        <StatCard
          label="Reminders"
          value={activeReminders.length}
          icon={Clock}
          to="/ops/dila"
        />
      </div>

      {/* Two-column bottom */}
      <div className="grid grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="border border-border/60 rounded-lg">
          <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">
              Tasks
            </span>
            <Link
              to="/ops/dila"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </Link>
          </div>
          {pendingTasks.length === 0 ? (
            <div className="p-5">
              <div className="space-y-3">
                {["Follow up with client", "Review sourcing options", "Prepare invoice"].map((ph, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border border-border/40" />
                    <span className="text-sm text-muted-foreground/30">{ph}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/40 mt-4">
                Tasks appear here when created manually or by Dila.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {pendingTasks.map((task) => (
                <div key={task.id} className="px-5 py-3 flex items-start gap-3">
                  <div className="h-4 w-4 rounded-full border border-border mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{task.title}</div>
                    <span className="text-[0.65rem] text-muted-foreground">
                      {PRIORITY_LABEL[task.priority]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Orders */}
        <div className="border border-border/60 rounded-lg">
          <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">
              Orders
            </span>
            <Link
              to="/ops/orders"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </Link>
          </div>
          {activeOrders.length === 0 ? (
            <div className="p-5">
              <div className="space-y-3">
                {[
                  { client: "Client name", stage: "Ordered" },
                  { client: "Client name", stage: "Shipped" },
                ].map((ph, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground/30">{ph.client}</span>
                    <span className="text-xs text-muted-foreground/20 border border-border/20 rounded-full px-2 py-0.5">
                      {ph.stage}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/40 mt-4">
                Active orders from the pipeline appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {activeOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm">{order.client_name}</div>
                    {order.description && (
                      <div className="text-xs text-muted-foreground truncate max-w-[12rem]">
                        {order.description}
                      </div>
                    )}
                  </div>
                  <Badge className={`text-[0.6rem] ${STAGE_COLOR[order.status]}`}>
                    {STAGE_LABEL[order.status]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
