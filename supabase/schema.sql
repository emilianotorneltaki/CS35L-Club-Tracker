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

-- Events on a club's timeline. Students see them sorted by date.
create table if not exists public.club_events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  name text not null constraint club_events_name_not_blank check (char_length(trim(name)) > 0),
  event_date date not null,
  description text not null default ''
    constraint club_events_description_length check (char_length(description) <= 200),
  created_at timestamptz not null default now()
);

create index if not exists club_events_club_date
  on public.club_events (club_id, event_date);

alter table public.club_events enable row level security;

-- Open recruitment positions shown under a club's "Open Positions" tab.
create table if not exists public.club_positions (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  title text not null constraint club_positions_title_not_blank check (char_length(trim(title)) > 0),
  description text not null constraint club_positions_description_not_blank check (char_length(trim(description)) > 0),
  requirements text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists club_positions_club
  on public.club_positions (club_id, created_at);

alter table public.club_positions enable row level security;

-- Checks club names are unique (ignoring case)
create unique index if not exists clubs_name_unique
  on public.clubs (lower(trim(name)));

-- Block direct browser access. Only the Express server (secret key) can use it.
alter table public.clubs enable row level security;