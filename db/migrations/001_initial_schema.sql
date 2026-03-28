-- Orbit Database Schema
-- This migration creates all core tables for the project management application

-- ============================
-- Users table (extends auth.users)
-- ============================
create table public.users (
  id uuid not null references auth.users on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id)
);

alter table public.users enable row level security;

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can read profiles of team members"
  on public.users for select
  using (
    id in (
      select tm.user_id from public.team_members tm
      where tm.team_id in (
        select tm2.team_id from public.team_members tm2
        where tm2.user_id = auth.uid()
      )
    )
  );

-- ============================
-- Teams table
-- ============================
create table public.teams (
  id uuid not null default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  avatar_url text,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'lite', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_by uuid not null references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id)
);

alter table public.teams enable row level security;

create policy "Team members can read their teams"
  on public.teams for select
  using (
    id in (
      select team_id from public.team_members
      where user_id = auth.uid()
    )
  );

create policy "Authenticated users can create teams"
  on public.teams for insert
  with check (auth.uid() = created_by);

create policy "Team admins can update teams"
  on public.teams for update
  using (
    id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- ============================
-- Team Members table
-- ============================
create table public.team_members (
  id uuid not null default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'guest')),
  created_at timestamptz not null default now(),
  primary key (id),
  unique (team_id, user_id)
);

alter table public.team_members enable row level security;

create policy "Team members can read their team memberships"
  on public.team_members for select
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid()
    )
  );

create policy "Team admins can insert members"
  on public.team_members for insert
  with check (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
    or auth.uid() = user_id -- Allow self-insert when creating a team
  );

create policy "Team admins can update members"
  on public.team_members for update
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "Team admins can delete members"
  on public.team_members for delete
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- ============================
-- Workspaces table
-- ============================
create table public.workspaces (
  id uuid not null default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  name text not null,
  description text,
  icon text,
  created_by uuid not null references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id)
);

alter table public.workspaces enable row level security;

create policy "Team members can read workspaces"
  on public.workspaces for select
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid()
    )
  );

create policy "Team members can create workspaces"
  on public.workspaces for insert
  with check (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin', 'member')
    )
  );

create policy "Team admins can update workspaces"
  on public.workspaces for update
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
    or created_by = auth.uid()
  );

create policy "Team admins can delete workspaces"
  on public.workspaces for delete
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- ============================
-- Boards table
-- ============================
create table public.boards (
  id uuid not null default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id)
);

alter table public.boards enable row level security;

create policy "Team members can read boards"
  on public.boards for select
  using (
    workspace_id in (
      select w.id from public.workspaces w
      join public.team_members tm on tm.team_id = w.team_id
      where tm.user_id = auth.uid()
    )
  );

create policy "Team members can create boards"
  on public.boards for insert
  with check (
    workspace_id in (
      select w.id from public.workspaces w
      join public.team_members tm on tm.team_id = w.team_id
      where tm.user_id = auth.uid() and tm.role in ('owner', 'admin', 'member')
    )
  );

create policy "Team members can update boards"
  on public.boards for update
  using (
    workspace_id in (
      select w.id from public.workspaces w
      join public.team_members tm on tm.team_id = w.team_id
      where tm.user_id = auth.uid() and tm.role in ('owner', 'admin', 'member')
    )
  );

create policy "Team admins can delete boards"
  on public.boards for delete
  using (
    workspace_id in (
      select w.id from public.workspaces w
      join public.team_members tm on tm.team_id = w.team_id
      where tm.user_id = auth.uid() and tm.role in ('owner', 'admin')
    )
  );

-- ============================
-- Columns table
-- ============================
create table public.columns (
  id uuid not null default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id)
);

alter table public.columns enable row level security;

create policy "Team members can read columns"
  on public.columns for select
  using (
    board_id in (
      select b.id from public.boards b
      join public.workspaces w on w.id = b.workspace_id
      join public.team_members tm on tm.team_id = w.team_id
      where tm.user_id = auth.uid()
    )
  );

create policy "Team members can create columns"
  on public.columns for insert
  with check (
    board_id in (
      select b.id from public.boards b
      join public.workspaces w on w.id = b.workspace_id
      join public.team_members tm on tm.team_id = w.team_id
      where tm.user_id = auth.uid() and tm.role in ('owner', 'admin', 'member')
    )
  );

create policy "Team members can update columns"
  on public.columns for update
  using (
    board_id in (
      select b.id from public.boards b
      join public.workspaces w on w.id = b.workspace_id
      join public.team_members tm on tm.team_id = w.team_id
      where tm.user_id = auth.uid() and tm.role in ('owner', 'admin', 'member')
    )
  );

create policy "Team admins can delete columns"
  on public.columns for delete
  using (
    board_id in (
      select b.id from public.boards b
      join public.workspaces w on w.id = b.workspace_id
      join public.team_members tm on tm.team_id = w.team_id
      where tm.user_id = auth.uid() and tm.role in ('owner', 'admin')
    )
  );

-- ============================
-- Tasks table
-- ============================
create table public.tasks (
  id uuid not null default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  column_id uuid not null references public.columns(id) on delete cascade,
  title text not null,
  description text,
  position integer not null default 0,
  assignee_id uuid references public.users(id) on delete set null,
  priority text not null default 'none' check (priority in ('none', 'low', 'medium', 'high', 'urgent')),
  status text not null default 'todo' check (status in ('backlog', 'todo', 'in_progress', 'done', 'canceled')),
  created_by uuid not null references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id)
);

alter table public.tasks enable row level security;

create policy "Team members can read tasks"
  on public.tasks for select
  using (
    board_id in (
      select b.id from public.boards b
      join public.workspaces w on w.id = b.workspace_id
      join public.team_members tm on tm.team_id = w.team_id
      where tm.user_id = auth.uid()
    )
  );

create policy "Team members can create tasks"
  on public.tasks for insert
  with check (
    board_id in (
      select b.id from public.boards b
      join public.workspaces w on w.id = b.workspace_id
      join public.team_members tm on tm.team_id = w.team_id
      where tm.user_id = auth.uid() and tm.role in ('owner', 'admin', 'member')
    )
  );

create policy "Team members can update tasks"
  on public.tasks for update
  using (
    board_id in (
      select b.id from public.boards b
      join public.workspaces w on w.id = b.workspace_id
      join public.team_members tm on tm.team_id = w.team_id
      where tm.user_id = auth.uid() and tm.role in ('owner', 'admin', 'member')
    )
  );

create policy "Team admins can delete tasks"
  on public.tasks for delete
  using (
    board_id in (
      select b.id from public.boards b
      join public.workspaces w on w.id = b.workspace_id
      join public.team_members tm on tm.team_id = w.team_id
      where tm.user_id = auth.uid() and tm.role in ('owner', 'admin')
    )
    or created_by = auth.uid()
  );

-- ============================
-- Team Invites table
-- ============================
create table public.team_invites (
  id uuid not null default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('admin', 'member', 'guest')),
  token text not null unique,
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_by uuid not null references public.users(id),
  created_at timestamptz not null default now(),
  primary key (id)
);

alter table public.team_invites enable row level security;

create policy "Team admins can read invites"
  on public.team_invites for select
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "Team admins can create invites"
  on public.team_invites for insert
  with check (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "Team admins can delete invites"
  on public.team_invites for delete
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- ============================
-- AI Usage table (for rate limiting)
-- ============================
create table public.ai_usage (
  id uuid not null default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.users(id),
  feature text not null,
  tokens_used integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (id)
);

alter table public.ai_usage enable row level security;

create policy "Users can read own AI usage"
  on public.ai_usage for select
  using (user_id = auth.uid());

create policy "Users can insert own AI usage"
  on public.ai_usage for insert
  with check (user_id = auth.uid());

-- ============================
-- Indexes
-- ============================
create index idx_team_members_user_id on public.team_members(user_id);
create index idx_team_members_team_id on public.team_members(team_id);
create index idx_workspaces_team_id on public.workspaces(team_id);
create index idx_boards_workspace_id on public.boards(workspace_id);
create index idx_columns_board_id on public.columns(board_id);
create index idx_columns_position on public.columns(board_id, position);
create index idx_tasks_board_id on public.tasks(board_id);
create index idx_tasks_column_id on public.tasks(column_id);
create index idx_tasks_assignee_id on public.tasks(assignee_id);
create index idx_tasks_position on public.tasks(column_id, position);
create index idx_team_invites_token on public.team_invites(token);
create index idx_team_invites_email on public.team_invites(email);
create index idx_teams_slug on public.teams(slug);

-- ============================
-- Functions & Triggers
-- ============================

-- Auto-update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at before update on public.users
  for each row execute function public.update_updated_at_column();

create trigger update_teams_updated_at before update on public.teams
  for each row execute function public.update_updated_at_column();

create trigger update_workspaces_updated_at before update on public.workspaces
  for each row execute function public.update_updated_at_column();

create trigger update_boards_updated_at before update on public.boards
  for each row execute function public.update_updated_at_column();

create trigger update_columns_updated_at before update on public.columns
  for each row execute function public.update_updated_at_column();

create trigger update_tasks_updated_at before update on public.tasks
  for each row execute function public.update_updated_at_column();

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
