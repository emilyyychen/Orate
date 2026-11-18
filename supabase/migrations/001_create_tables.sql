-- ============================================
-- Orate Database Schema
-- Migration 001: Create all tables
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. PROFILES (points at auth.users)
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  role text not null default 'member' check (role in ('lead', 'member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- 2. WORKSPACES
-- ============================================
create table public.workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ============================================
-- 3. TEAMS
-- ============================================
create table public.teams (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- ============================================
-- 4. MEMBERSHIPS (links profiles to teams)
-- ============================================
create table public.memberships (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  role text not null default 'member' check (role in ('lead', 'member')),
  joined_at timestamptz not null default now(),
  unique(profile_id, team_id)
);

-- ============================================
-- 5. CHECK-INS
-- ============================================
create table public.check_ins (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  body text not null,
  mood text check (mood in ('great', 'good', 'okay', 'struggling')),
  photo_urls text[] default '{}',
  created_at timestamptz not null default now()
);

-- ============================================
-- 6. HEALTH SCORES
-- ============================================
create table public.health_scores (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  score integer not null check (score between 1 and 10),
  week_of date not null,
  notes text,
  created_at timestamptz not null default now()
);

-- ============================================
-- 7. FLAGS
-- ============================================
create table public.flags (
  id uuid primary key default uuid_generate_v4(),
  check_in_id uuid not null references public.check_ins(id) on delete cascade,
  raised_by uuid not null references public.profiles(id),
  reason text not null,
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved')),
  created_at timestamptz not null default now()
);

-- ============================================
-- 8. SUPPORT ACTIONS
-- ============================================
create table public.support_actions (
  id uuid primary key default uuid_generate_v4(),
  flag_id uuid not null references public.flags(id) on delete cascade,
  assigned_to uuid references public.profiles(id),
  action text not null,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'done')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.teams enable row level security;
alter table public.memberships enable row level security;
alter table public.check_ins enable row level security;
alter table public.health_scores enable row level security;
alter table public.flags enable row level security;
alter table public.support_actions enable row level security;

-- PROFILES: users can read/update their own profile
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- WORKSPACES: members can read their workspace
create policy "Members can read workspace"
  on public.workspaces for select using (
    exists (select 1 from public.memberships where workspace_id = workspaces.id and profile_id = auth.uid())
  );

-- TEAMS: members can read their team
create policy "Members can read team"
  on public.teams for select using (
    exists (select 1 from public.memberships where team_id = teams.id and profile_id = auth.uid())
  );

-- MEMBERSHIPS: members can see their own team's memberships
create policy "Members can read team memberships"
  on public.memberships for select using (
    team_id in (select team_id from public.memberships where profile_id = auth.uid())
  );

-- CHECK-INS: only the author can read their own check-in
-- Team members can read summaries (via health_scores), not individual check-ins
create policy "Author can read own check-ins"
  on public.check_ins for select using (author_id = auth.uid());
create policy "Author can insert check-ins"
  on public.check_ins for insert with check (author_id = auth.uid());

-- HEALTH SCORES: team members can read their team's scores
create policy "Team members can read health scores"
  on public.health_scores for select using (
    team_id in (select team_id from public.memberships where profile_id = auth.uid())
  );

-- FLAGS: only the raiser and leads can see flags
create policy "Flag raiser and leads can read flags"
  on public.flags for select using (
    raised_by = auth.uid() or
    exists (
      select 1 from public.memberships m
      join public.check_ins c on c.team_id = m.team_id
      where c.id = flags.check_in_id and m.profile_id = auth.uid() and m.role = 'lead'
    )
  );

-- SUPPORT ACTIONS: assigned user and leads can see
create policy "Assigned and leads can read support actions"
  on public.support_actions for select using (
    assigned_to = auth.uid() or
    exists (
      select 1 from public.memberships m
      join public.flags f on f.id = support_actions.flag_id
      join public.check_ins c on c.id = f.check_in_id
      where c.team_id = m.team_id and m.profile_id = auth.uid() and m.role = 'lead'
    )
  );

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- STORAGE BUCKET
-- ============================================
insert into storage.buckets (id, name, public) values ('work-photos', 'work-photos', false);

create policy "Team members can upload photos"
  on storage.objects for insert with check (
    bucket_id = 'work-photos' and auth.role() = 'authenticated'
  );

create policy "Team members can read photos"
  on storage.objects for select using (
    bucket_id = 'work-photos' and auth.role() = 'authenticated'
  );
