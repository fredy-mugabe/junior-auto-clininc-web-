-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  type text not null check (type in ('job', 'internship')),
  message text,
  cv_path text,
  created_at timestamptz not null default now()
);

create index if not exists applications_created_at_idx on public.applications (created_at desc);

-- Optional: enable RLS. The Express API uses the service role key and bypasses RLS.
-- alter table public.applications enable row level security;
