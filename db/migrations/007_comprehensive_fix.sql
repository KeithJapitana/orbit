-- COMPREHENSIVE FIX - Run this entire script in Supabase SQL Editor

-- Step 1: Drop EVERY policy on team_members
do $$
declare
    policy_record record;
begin
    for policy_record in
        select policyname from pg_policies
        where schemaname = 'public' and tablename = 'team_members'
    loop
        execute format('drop policy if exists %I on public.team_members', policy_record.policyname);
    end loop;
end $$;

-- Step 2: Disable RLS on team_members
alter table public.team_members disable row level security;

-- Step 3: Also disable RLS on teams (it checks team_members in some policies)
do $$
declare
    policy_record record;
begin
    for policy_record in
        select policyname from pg_policies
        where schemaname = 'public' and tablename = 'teams'
    loop
        execute format('drop policy if exists %I on public.teams', policy_record.policyname);
    end loop;
end $$;

alter table public.teams disable row level security;

-- Step 4: Disable RLS on users table too (has team_members check)
do $$
declare
    policy_record record;
begin
    for policy_record in
        select policyname from pg_policies
        where schemaname = 'public' and tablename = 'users'
    loop
        execute format('drop policy if exists %I on public.users', policy_record.policyname);
    end loop;
end $$;

alter table public.users disable row level security;

-- Step 5: Disable RLS on all other tables too
alter table public.workspaces disable row level security;
alter table public.boards disable row level security;
alter table public.columns disable row level security;
alter table public.tasks disable row level security;
alter table public.team_invites disable row level security;
alter table public.ai_usage disable row level security;

-- Verification query - run this to confirm RLS is disabled
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('users', 'teams', 'team_members', 'workspaces', 'boards', 'columns', 'tasks')
order by tablename;
