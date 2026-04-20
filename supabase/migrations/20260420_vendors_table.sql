-- Vendors table for Kemissa Continuum Ops
-- Fashion suppliers, fabric houses, tailors, boutiques, etc.

create table if not exists vendors (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) not null,
  name            text not null,
  contact_name    text,
  email           text,
  phone           text,
  website         text,
  category        text not null default 'other'
                  check (category in (
                    'fabric','clothing','accessories','shoes',
                    'tailoring','jewelry','other'
                  )),
  specialty       text,
  country         text,
  city            text,
  payment_terms   text,
  account_number  text,
  notes           text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table vendors enable row level security;
create policy "Users manage own vendors" on vendors
  for all using (auth.uid() = user_id);

create index idx_vendors_user_active on vendors(user_id, is_active);
create index idx_vendors_category on vendors(user_id, category);

create trigger vendors_updated_at
  before update on vendors
  for each row execute function set_updated_at();
