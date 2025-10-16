-- Waitlist table
create extension if not exists citext;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  created_at timestamptz not null default now(),
  referer text,
  user_agent text,
  ip_hash text
);

-- index for querying by ip_hash and created_at
create index if not exists idx_waitlist_ip_created on public.waitlist (ip_hash, created_at desc);
