-- Run this in the Supabase SQL editor once, on a fresh project.

create extension if not exists "pgcrypto";

-- Site-wide CMS-editable settings (single row, id = 'default')
create table if not exists site_settings (
  id text primary key default 'default',
  site_name text not null default 'Studio',
  tagline text not null default 'Identity systems built to be believed.',
  bg_color text not null default '#000000',
  surface_color text not null default '#0a0a0c',
  text_color text not null default '#f5f5f7',
  muted_color text not null default '#86868b',
  accent_color text not null default '#f5f5f7',
  font_display text not null default '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
  font_body text not null default '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
  about_text text not null default 'A design studio focused on identity systems for brands that need to feel considered, not decorated.',
  location text not null default '',
  email text not null default '',
  instagram_url text not null default '',
  behance_url text not null default '',
  updated_at timestamptz not null default now()
);

insert into site_settings (id) values ('default')
  on conflict (id) do nothing;

-- Case studies / projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  year text not null default '',
  description text not null default '',
  cover_image_url text,
  pdf_url text,
  body jsonb not null default '[]'::jsonb, -- flexible case-study content blocks
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table site_settings enable row level security;
alter table projects enable row level security;

-- Anyone can read site settings
create policy "public read site_settings" on site_settings
  for select using (true);

-- Only authenticated users (you) can update settings
create policy "auth update site_settings" on site_settings
  for update using (auth.role() = 'authenticated');

-- Anyone can read published projects
create policy "public read published projects" on projects
  for select using (published = true);

-- Authenticated users can read everything (drafts included), and write
create policy "auth read all projects" on projects
  for select using (auth.role() = 'authenticated');

create policy "auth insert projects" on projects
  for insert with check (auth.role() = 'authenticated');

create policy "auth update projects" on projects
  for update using (auth.role() = 'authenticated');

create policy "auth delete projects" on projects
  for delete using (auth.role() = 'authenticated');

-- Storage buckets: run these once, or create via Dashboard > Storage
-- insert into storage.buckets (id, name, public) values ('covers', 'covers', true);
-- insert into storage.buckets (id, name, public) values ('pdfs', 'pdfs', true);

-- Storage policies (after creating the buckets above)
create policy "public read covers" on storage.objects
  for select using (bucket_id = 'covers');
create policy "auth write covers" on storage.objects
  for insert with check (bucket_id = 'covers' and auth.role() = 'authenticated');
create policy "auth update covers" on storage.objects
  for update using (bucket_id = 'covers' and auth.role() = 'authenticated');
create policy "auth delete covers" on storage.objects
  for delete using (bucket_id = 'covers' and auth.role() = 'authenticated');

create policy "public read pdfs" on storage.objects
  for select using (bucket_id = 'pdfs');
create policy "auth write pdfs" on storage.objects
  for insert with check (bucket_id = 'pdfs' and auth.role() = 'authenticated');
create policy "auth update pdfs" on storage.objects
  for update using (bucket_id = 'pdfs' and auth.role() = 'authenticated');
create policy "auth delete pdfs" on storage.objects
  for delete using (bucket_id = 'pdfs' and auth.role() = 'authenticated');
