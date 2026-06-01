-- Electricidad Lakuntza - proyectos realizados
-- Ejecutar en Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_title text,
  category text not null,
  location text,
  year integer,
  description text not null,
  long_description text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  public_url text not null,
  storage_path text,
  alt text,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.project_images enable row level security;

create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (published = true);

create policy "Public can read images from published projects"
on public.project_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_images.project_id
      and projects.published = true
  )
);

create index if not exists projects_published_featured_idx
on public.projects (published, featured, sort_order, created_at desc);

create index if not exists project_images_project_sort_idx
on public.project_images (project_id, sort_order);

-- Bucket recomendado en Supabase Storage:
-- Nombre: project-images
-- Público: sí
-- Límite recomendado por archivo: 5 MB
-- Formatos recomendados: image/jpeg, image/png, image/webp
