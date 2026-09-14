-- Orchid Homestay — run this once in your Supabase project SQL editor.
-- Project: https://okzynbwryhhzynaahlfy.supabase.co

-- ---------- settings (about / contact / theme, one row per key) ----------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;

-- ---------- gallery photos ----------
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text not null default '',
  storage_path text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.gallery_photos to anon;
grant select, insert, update, delete on public.gallery_photos to authenticated;
grant all on public.gallery_photos to service_role;
alter table public.gallery_photos enable row level security;

-- ---------- amenities ----------
create table if not exists public.amenities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  note text not null default '',
  sort_order int not null default 0
);
grant select on public.amenities to anon;
grant select, insert, update, delete on public.amenities to authenticated;
grant all on public.amenities to service_role;
alter table public.amenities enable row level security;

-- ---------- social links ----------
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  sort_order int not null default 0
);
grant select on public.social_links to anon;
grant select, insert, update, delete on public.social_links to authenticated;
grant all on public.social_links to service_role;
alter table public.social_links enable row level security;

-- ---------- distances / directions ----------
create table if not exists public.distances (
  id uuid primary key default gen_random_uuid(),
  place text not null,
  km text not null,
  sort_order int not null default 0
);
grant select on public.distances to anon;
grant select, insert, update, delete on public.distances to authenticated;
grant all on public.distances to service_role;
alter table public.distances enable row level security;

-- ---------- click tracking ----------
create table if not exists public.click_events (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  label text,
  path text,
  created_at timestamptz not null default now()
);
grant insert on public.click_events to anon;
grant select, insert, delete on public.click_events to authenticated;
grant all on public.click_events to service_role;
alter table public.click_events enable row level security;

-- ---------- policies ----------
drop policy if exists "public read" on public.site_settings;
create policy "public read" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "admin write" on public.site_settings;
create policy "admin write" on public.site_settings for all to authenticated using (true) with check (true);

drop policy if exists "public read" on public.gallery_photos;
create policy "public read" on public.gallery_photos for select to anon, authenticated using (true);
drop policy if exists "admin write" on public.gallery_photos;
create policy "admin write" on public.gallery_photos for all to authenticated using (true) with check (true);

drop policy if exists "public read" on public.amenities;
create policy "public read" on public.amenities for select to anon, authenticated using (true);
drop policy if exists "admin write" on public.amenities;
create policy "admin write" on public.amenities for all to authenticated using (true) with check (true);

drop policy if exists "public read" on public.social_links;
create policy "public read" on public.social_links for select to anon, authenticated using (true);
drop policy if exists "admin write" on public.social_links;
create policy "admin write" on public.social_links for all to authenticated using (true) with check (true);

drop policy if exists "public read" on public.distances;
create policy "public read" on public.distances for select to anon, authenticated using (true);
drop policy if exists "admin write" on public.distances;
create policy "admin write" on public.distances for all to authenticated using (true) with check (true);


drop policy if exists "anyone can log a click" on public.click_events;
create policy "anyone can log a click" on public.click_events
  for insert to anon, authenticated with check (true);

drop policy if exists "admins read clicks" on public.click_events;
create policy "admins read clicks" on public.click_events
  for select to authenticated using (true);

drop policy if exists "admins clear clicks" on public.click_events;
create policy "admins clear clicks" on public.click_events
  for delete to authenticated using (true);

-- ---------- photo storage bucket ----------
insert into storage.buckets (id, name, public)
values ('site-photos', 'site-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "site photos are public" on storage.objects;
create policy "site photos are public" on storage.objects
  for select to anon, authenticated using (bucket_id = 'site-photos');

drop policy if exists "admins manage site photos" on storage.objects;
create policy "admins manage site photos" on storage.objects
  for all to authenticated using (bucket_id = 'site-photos') with check (bucket_id = 'site-photos');
