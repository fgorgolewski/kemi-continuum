-- Orders pipeline for Kemissa Continuum Ops
-- Funnel: Ordered → Received → Repacked → Shipping Booked → Shipped → Delivered

create table if not exists orders (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) not null,
  client_id           uuid references clients(id) on delete set null,
  client_name         text not null,

  -- What's being shipped
  description         text,
  items               jsonb not null default '[]',

  -- Pipeline status
  status              text not null default 'ordered'
                      check (status in (
                        'ordered','received','repacked',
                        'shipping_booked','shipped','delivered'
                      )),

  -- Delivery config
  delivery_type       text not null default 'standard'
                      check (delivery_type in ('standard','white_glove')),
  signature_required  boolean not null default true,

  -- Shipping details (filled as order progresses)
  carrier             text check (carrier in ('dhl','fedex','ups','usps','shippo','uber_direct','other')),
  tracking_number     text,
  shipping_label_url  text,
  estimated_delivery  date,

  -- Address
  shipping_address    jsonb,

  -- Stage timestamps (filled as order moves through pipeline)
  ordered_at          timestamptz not null default now(),
  received_at         timestamptz,
  repacked_at         timestamptz,
  shipping_booked_at  timestamptz,
  shipped_at          timestamptz,
  delivered_at        timestamptz,

  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table orders enable row level security;
create policy "Users manage own orders" on orders
  for all using (auth.uid() = user_id);

create index idx_orders_user_status on orders(user_id, status);
create index idx_orders_client on orders(client_id);

create trigger orders_updated_at
  before update on orders
  for each row execute function set_updated_at();
