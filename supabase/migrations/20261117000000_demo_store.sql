-- Teziko Home demo store: optional Supabase adapter schema.
-- Every row expires 14 days after creation and is purged daily by pg_cron.
-- All access goes through Next.js route handlers using the service role key (server-only),
-- so RLS is enabled on every table with NO policies for anon/authenticated roles:
-- the browser can never read or write these tables directly.

create extension if not exists pg_cron;

create table if not exists public.orders (
  number      text primary key,
  email       text not null,
  status      text not null,
  data        jsonb not null,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default now() + interval '14 days'
);
create index if not exists orders_email_idx on public.orders (email, created_at desc);

create table if not exists public.profiles (
  email       text primary key,
  data        jsonb not null,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default now() + interval '14 days'
);

create table if not exists public.reviews (
  id          uuid primary key,
  product_id  text not null,
  data        jsonb not null,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default now() + interval '14 days'
);
create index if not exists reviews_product_idx on public.reviews (product_id, created_at desc);

create table if not exists public.contact_messages (
  id          uuid primary key,
  name        text not null,
  email       text not null,
  topic       text not null,
  message     text not null check (char_length(message) <= 1500),
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default now() + interval '14 days'
);

create table if not exists public.newsletter_subscribers (
  id          uuid primary key,
  email       text not null,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default now() + interval '14 days'
);

-- Row Level Security on every table. No policies = deny all for anon and authenticated.
-- The service role bypasses RLS and is only ever used server-side.
alter table public.orders                 enable row level security;
alter table public.profiles               enable row level security;
alter table public.reviews                enable row level security;
alter table public.contact_messages       enable row level security;
alter table public.newsletter_subscribers enable row level security;

alter table public.orders                 force row level security;
alter table public.profiles               force row level security;
alter table public.reviews                force row level security;
alter table public.contact_messages       force row level security;
alter table public.newsletter_subscribers force row level security;

revoke all on public.orders, public.profiles, public.reviews, public.contact_messages, public.newsletter_subscribers from anon, authenticated;

-- Daily purge of expired demo data at 03:15 UTC.
create or replace function public.purge_expired_demo_data()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.orders                 where expires_at < now();
  delete from public.profiles               where expires_at < now();
  delete from public.reviews                where expires_at < now();
  delete from public.contact_messages       where expires_at < now();
  delete from public.newsletter_subscribers where expires_at < now();
$$;

revoke all on function public.purge_expired_demo_data() from public, anon, authenticated;

select cron.schedule(
  'teziko-demo-purge',
  '15 3 * * *',
  $$select public.purge_expired_demo_data();$$
);
