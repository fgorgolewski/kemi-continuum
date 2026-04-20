-- Executive Assistant tables for Kemissa Continuum Ops
-- Run via Supabase dashboard → SQL Editor, or `supabase db push`.

/* ───────── Tasks ───────── */

create table if not exists ea_tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) not null,
  title       text not null,
  description text,
  status      text not null default 'pending'
              check (status in ('pending','in_progress','completed','cancelled')),
  priority    text not null default 'medium'
              check (priority in ('low','medium','high','urgent')),
  due_date    timestamptz,
  assigned_to text,
  category    text,
  created_by  text not null default 'user'
              check (created_by in ('user','assistant')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table ea_tasks enable row level security;
create policy "Users manage own tasks" on ea_tasks
  for all using (auth.uid() = user_id);
create index idx_ea_tasks_user_status on ea_tasks(user_id, status);

/* ───────── Reminders ───────── */

create table if not exists ea_reminders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) not null,
  title       text not null,
  description text,
  remind_at   timestamptz not null,
  status      text not null default 'active'
              check (status in ('active','snoozed','completed','dismissed')),
  created_at  timestamptz not null default now()
);

alter table ea_reminders enable row level security;
create policy "Users manage own reminders" on ea_reminders
  for all using (auth.uid() = user_id);
create index idx_ea_reminders_user on ea_reminders(user_id, status);

/* ───────── Invoice drafts ───────── */

create table if not exists ea_invoice_drafts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) not null,
  client_id   uuid references clients(id) on delete set null,
  client_name text not null,
  items       jsonb not null default '[]',
  subtotal    numeric(10,2) not null default 0,
  tax_rate    numeric(5,4) not null default 0,
  total       numeric(10,2) not null default 0,
  notes       text,
  status      text not null default 'draft'
              check (status in ('draft','sent','paid')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table ea_invoice_drafts enable row level security;
create policy "Users manage own invoices" on ea_invoice_drafts
  for all using (auth.uid() = user_id);

/* ───────── Health checks ───────── */

create table if not exists ea_health_checks (
  id               uuid primary key default gen_random_uuid(),
  url              text not null,
  status           text not null default 'healthy'
                   check (status in ('healthy','degraded','down')),
  response_time_ms integer,
  last_checked_at  timestamptz not null default now(),
  error_message    text
);

alter table ea_health_checks enable row level security;
create policy "Authenticated users can read health checks" on ea_health_checks
  for select using (auth.role() = 'authenticated');

/* ───────── Alert config ───────── */

create table if not exists ea_alert_configs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) not null,
  alert_type    text not null
                check (alert_type in ('site_down','slow_response','error_spike','custom')),
  target_url    text,
  threshold_ms  integer,
  notify_emails text[] not null default '{}',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table ea_alert_configs enable row level security;
create policy "Users manage own alerts" on ea_alert_configs
  for all using (auth.uid() = user_id);

/* ───────── updated_at triggers ───────── */

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger ea_tasks_updated_at
  before update on ea_tasks
  for each row execute function set_updated_at();

create trigger ea_invoice_drafts_updated_at
  before update on ea_invoice_drafts
  for each row execute function set_updated_at();
