-- One row per club account. A user with a clubs row is a club, any other signed-up user is a student.
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null,
  draft_description text not null default '',
  published_description text not null default '',
  draft_images text[] not null default '{}',
  published_images text[] not null default '{}',
  application_url text,
  application_status text not null default 'not_accepting'
    check (application_status in ('accepting', 'not_accepting')),
  status_reason text
    check (status_reason is null or char_length(status_reason) <= 100)
);

-- Checks club names are unique (ignoring case)
create unique index if not exists clubs_name_unique
  on public.clubs (lower(name));

-- Block direct browser access. Only the Express server (secret key) can use it.
alter table public.clubs enable row level security;