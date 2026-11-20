-- One row per club account. A user with a clubs row is a club, any other signed-up user is a student.
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null constraint clubs_name_not_blank check (char_length(trim(name)) > 0),
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
  on public.clubs (lower(trim(name)));

-- Block direct browser access. Only the Express server (secret key) can use it.
alter table public.clubs enable row level security;

--SH7, made so a club can have any number of links, each tagged with one type.
create table if not exists public.club_links (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  type text not null
    check (type in ('website', 'instagram', 'linkedin', 'discord', 'slack')),
  url text not null check (url ~* '^https?://'),
  created_at timestamptz not null default now(),
  unique (club_id, url)
);

create index if not exists club_links_club_id_idx on public.club_links (club_id);

alter table public.club_links enable row level security;