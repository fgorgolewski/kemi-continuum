// Executive Assistant types — mirrors ea_* tables in Supabase.

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type MessageRole = "user" | "assistant";

/* ───────── Tasks ───────── */

export interface EATaskRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assigned_to: string | null;
  category: string | null;
  created_by: "user" | "assistant";
  created_at: string;
  updated_at: string;
}

export type EATaskInsert = Omit<EATaskRow, "id" | "user_id" | "created_at" | "updated_at">;
export type EATaskUpdate = Partial<Pick<EATaskRow, "title" | "description" | "status" | "priority" | "due_date" | "assigned_to" | "category">>;

/* ───────── Reminders ───────── */

export interface EAReminderRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  remind_at: string;
  status: "active" | "snoozed" | "completed" | "dismissed";
  created_at: string;
}

export type EAReminderInsert = Omit<EAReminderRow, "id" | "user_id" | "created_at">;

/* ───────── Invoice drafts ───────── */

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface EAInvoiceDraftRow {
  id: string;
  user_id: string;
  client_id: string | null;
  client_name: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  total: number;
  notes: string | null;
  status: "draft" | "sent" | "paid";
  created_at: string;
  updated_at: string;
}

export type EAInvoiceDraftInsert = Omit<EAInvoiceDraftRow, "id" | "user_id" | "created_at" | "updated_at">;

/* ───────── Health checks ───────── */

export interface EAHealthCheckRow {
  id: string;
  url: string;
  status: "healthy" | "degraded" | "down";
  response_time_ms: number | null;
  last_checked_at: string;
  error_message: string | null;
}

/* ───────── Alert config ───────── */

export interface EAAlertConfigRow {
  id: string;
  user_id: string;
  alert_type: "site_down" | "slow_response" | "error_spike" | "custom";
  target_url: string | null;
  threshold_ms: number | null;
  notify_emails: string[];
  is_active: boolean;
  created_at: string;
}

/* ───────── Chat (local state, not persisted for now) ───────── */

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  actions?: ChatAction[];
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatAction {
  type: "task_created" | "reminder_set" | "invoice_drafted" | "alert_sent" | "recommendation" | "health_check";
  label: string;
  data?: Record<string, unknown>;
}

/* ───────── Quick actions ───────── */

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  prompt: string;
  category: string;
}
