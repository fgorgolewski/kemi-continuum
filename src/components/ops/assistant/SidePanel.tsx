import { useState } from "react";
import { format, formatDistanceToNow, parseISO, isPast } from "date-fns";
import {
  Plus,
  Check,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
  Activity,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useEATasks,
  useCreateEATask,
  useUpdateEATask,
  useDeleteEATask,
  useEAReminders,
  useCreateEAReminder,
  useDismissEAReminder,
} from "@/hooks/queries/useAssistant";
import { PRIORITY_LABEL, STATUS_LABEL } from "@/lib/ea";
import type { HealthPing } from "@/lib/ea";
import { toast } from "sonner";

const PRIORITY_COLOR: Record<string, string> = {
  low: "text-muted-foreground",
  medium: "text-blue-600 dark:text-blue-400",
  high: "text-orange-600 dark:text-orange-400",
  urgent: "text-red-600 dark:text-red-400",
};

/* ────────────────────────── Tasks Tab ────────────────────────── */

function TasksTab() {
  const [filter, setFilter] = useState("pending");
  const { data: tasks = [], isLoading } = useEATasks(filter);
  const createTask = useCreateEATask();
  const updateTask = useUpdateEATask();
  const deleteTask = useDeleteEATask();
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("medium");

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      await createTask.mutateAsync({
        title: newTitle.trim(),
        description: null,
        status: "pending",
        priority: newPriority as "low" | "medium" | "high" | "urgent",
        due_date: null,
        assigned_to: null,
        category: null,
        created_by: "user",
      });
      setNewTitle("");
      setNewPriority("medium");
      setShowNew(false);
      toast.success("Task created.");
    } catch {
      toast.error("Failed to create task.");
    }
  };

  const toggleComplete = async (id: string, current: string) => {
    const next = current === "completed" ? "pending" : "completed";
    await updateTask.mutateAsync({ id, patch: { status: next } });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/40">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In progress</SelectItem>
            <SelectItem value="completed">Done</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" onClick={() => setShowNew(true)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add
        </Button>
      </div>

      {showNew && (
        <div className="p-3 border-b border-border/40 space-y-2">
          <Input
            placeholder="Task title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
          <div className="flex gap-2">
            <Select value={newPriority} onValueChange={setNewPriority}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PRIORITY_LABEL).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleCreate} disabled={createTask.isPending}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowNew(false)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading...</div>
        ) : tasks.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No tasks. Create one or ask the EA.
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {tasks.map((task) => (
              <div key={task.id} className="px-4 py-3 flex items-start gap-2 group">
                <button
                  onClick={() => toggleComplete(task.id, task.status)}
                  className="mt-0.5 flex-shrink-0"
                >
                  {task.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-border" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div
                    className={[
                      "text-sm",
                      task.status === "completed"
                        ? "line-through text-muted-foreground"
                        : "",
                    ].join(" ")}
                  >
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[0.65rem] ${PRIORITY_COLOR[task.priority]}`}>
                      {PRIORITY_LABEL[task.priority]}
                    </span>
                    {task.due_date && (
                      <span className="text-[0.65rem] text-muted-foreground">
                        {format(parseISO(task.due_date), "MMM d")}
                      </span>
                    )}
                    {task.created_by === "assistant" && (
                      <Badge variant="outline" className="text-[0.6rem] h-4 px-1">
                        EA
                      </Badge>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask.mutate(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

/* ────────────────────── Reminders Tab ────────────────────── */

function RemindersTab() {
  const { data: reminders = [], isLoading } = useEAReminders();
  const createReminder = useCreateEAReminder();
  const dismissReminder = useDismissEAReminder();
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  const handleCreate = async () => {
    if (!newTitle.trim() || !newDate) return;
    try {
      await createReminder.mutateAsync({
        title: newTitle.trim(),
        description: null,
        remind_at: new Date(newDate).toISOString(),
        status: "active",
      });
      setNewTitle("");
      setNewDate("");
      setShowNew(false);
      toast.success("Reminder set.");
    } catch {
      toast.error("Failed to create reminder.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-end px-4 py-2 border-b border-border/40">
        <Button variant="ghost" size="sm" onClick={() => setShowNew(true)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add
        </Button>
      </div>

      {showNew && (
        <div className="p-3 border-b border-border/40 space-y-2">
          <Input
            placeholder="Reminder title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex-1 text-xs"
            />
            <Button size="sm" onClick={handleCreate} disabled={createReminder.isPending}>
              Set
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowNew(false)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading...</div>
        ) : reminders.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No active reminders.
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {reminders.map((r) => {
              const overdue = isPast(parseISO(r.remind_at));
              return (
                <div key={r.id} className="px-4 py-3 flex items-start gap-2">
                  <Clock
                    className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      overdue ? "text-red-500" : "text-muted-foreground"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{r.title}</div>
                    <div className={`text-[0.65rem] mt-0.5 ${overdue ? "text-red-500" : "text-muted-foreground"}`}>
                      {overdue ? "Overdue — " : ""}
                      {formatDistanceToNow(parseISO(r.remind_at), { addSuffix: true })}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => dismissReminder.mutate(r.id)}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

/* ────────────────────── Health Tab ────────────────────── */

function HealthTab({ health }: { health: HealthPing | null; isChecking: boolean }) {
  return (
    <div className="p-4">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        kemissa.com
      </h3>

      {!health ? (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking...
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {health.status === "healthy" ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : health.status === "degraded" ? (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="text-sm font-medium capitalize">{health.status}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-border/40 rounded p-2.5">
              <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                Response
              </div>
              <div className="text-lg font-mono mt-0.5">
                {health.responseMs}<span className="text-xs text-muted-foreground">ms</span>
              </div>
            </div>
            <div className="border border-border/40 rounded p-2.5">
              <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                Status
              </div>
              <div className="text-lg font-mono mt-0.5 capitalize">
                {health.status}
              </div>
            </div>
          </div>

          {health.error && (
            <div className="text-xs text-red-600 bg-red-50 dark:bg-red-950/30 rounded p-2">
              {health.error}
            </div>
          )}

          <p className="text-[0.65rem] text-muted-foreground">
            Checked just now. Configure alerts in the chat: "Set up alerts for site downtime".
          </p>
        </div>
      )}
    </div>
  );
}

/* ────────────────────── Main SidePanel ────────────────────── */

interface SidePanelProps {
  health: HealthPing | null;
  isCheckingHealth: boolean;
}

export function SidePanel({ health, isCheckingHealth }: SidePanelProps) {
  return (
    <Tabs defaultValue="tasks" className="flex flex-col h-full">
      <TabsList className="mx-4 mt-2 grid grid-cols-3">
        <TabsTrigger value="tasks" className="text-xs">Tasks</TabsTrigger>
        <TabsTrigger value="reminders" className="text-xs">Reminders</TabsTrigger>
        <TabsTrigger value="health" className="text-xs">
          <Activity className="h-3 w-3 mr-1" />
          Health
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tasks" className="flex-1 mt-0 overflow-hidden">
        <TasksTab />
      </TabsContent>

      <TabsContent value="reminders" className="flex-1 mt-0 overflow-hidden">
        <RemindersTab />
      </TabsContent>

      <TabsContent value="health" className="flex-1 mt-0 overflow-hidden">
        <HealthTab health={health} isChecking={isCheckingHealth} />
      </TabsContent>
    </Tabs>
  );
}
