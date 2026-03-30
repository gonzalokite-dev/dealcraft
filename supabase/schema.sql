-- ============================================================
-- DealCraft — Esquema de base de datos
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- Tabla: profiles
-- Se crea automáticamente al registrarse un usuario
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  business_name   text,
  primary_color   text default '#2563EB',
  secondary_color text default '#1E293B',
  footer_text     text,
  logo_url        text,
  plan            text default 'free' check (plan in ('free', 'pro', 'agency')),
  created_at      timestamptz default now()
);

-- Tabla: proposals
create table if not exists public.proposals (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  client_name       text not null,
  client_company    text,
  service_type      text not null,
  input_data        jsonb not null default '{}',
  generated_content jsonb not null default '{}',
  created_at        timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.proposals enable row level security;

-- Policies: profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Policies: proposals
create policy "Users can view their own proposals"
  on public.proposals for select
  using (auth.uid() = user_id);

create policy "Users can create their own proposals"
  on public.proposals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own proposals"
  on public.proposals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own proposals"
  on public.proposals for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Trigger: crear perfil automáticamente al registrarse
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Storage: bucket para logos
-- ============================================================

insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

create policy "Users can upload their own logo"
  on storage.objects for insert
  with check (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Logos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'logos');

create policy "Users can delete their own logo"
  on storage.objects for delete
  using (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);
