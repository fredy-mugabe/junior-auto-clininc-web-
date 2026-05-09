-- =============================================================================
-- Junior Auto Clinic — full `applications` setup (Supabase SQL Editor)
-- Run this ONCE per project. Use the same Supabase project as SUPABASE_URL / Vercel.
-- =============================================================================

-- UUIDs for id default (if this errors, skip — Supabase often has pgcrypto already)
create extension if not exists pgcrypto;

-- Core table (matches what the API inserts)
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

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Your Vercel/Express API must use the **service_role** JWT in
-- SUPABASE_SERVICE_ROLE_KEY — it bypasses RLS.
-- If you mistakenly put the **anon** key in env, inserts fail with RLS errors.
-- Fix the env first. The line below is only a safety net for misconfigured RLS.
-- ---------------------------------------------------------------------------
alter table public.applications disable row level security;

-- Verify (should return 0 rows, no error):
-- select id, full_name, email, type, created_at from public.applications order by created_at desc limit 5;
