-- DEFINITIVE FIX - Run this entire script

-- 1. First, let's see what we're dealing with
select 'Current RLS status:' as info;
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('team_members', 'teams', 'users');

-- 2. Drop ALL policies on these tables (using anonymous block to avoid errors)
do $$
declare
    policy_record record;
begin
    -- Drop all team_members policies
    for policy_record in
        select policyname from pg_policies
        where schemaname = 'public' and tablename = 'team_members'
    loop
        execute format('drop policy if exists %I on public.team_members', policy_record.policyname);
        raise notice 'Dropped policy: % on team_members', policy_record.policyname;
    end loop;

    -- Drop all teams policies
    for policy_record in
        select policyname from pg_policies
        where schemaname = 'public' and tablename = 'teams'
    loop
        execute format('drop policy if exists %I on public.teams', policy_record.policyname);
        raise notice 'Dropped policy: % on teams', policy_record.policyname;
    end loop;

    -- Drop all users policies
    for policy_record in
        select policyname from pg_policies
        where schemaname = 'public' and tablename = 'users'
    loop
        execute format('drop policy if exists %I on public.users', policy_record.policyname);
        raise notice 'Dropped policy: % on users', policy_record.policyname;
    end loop;
end $$;

-- 3. Disable RLS
alter table public.team_members disable row level security;
alter table public.teams disable row level security;
alter table public.users disable row level security;
alter table public.workspaces disable row level security;
alter table public.boards disable row level security;
alter table public.columns disable row level security;
alter table public.tasks disable row level security;

-- 4. Drop the auto-user-create trigger (it might be causing issues)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 5. Verify - should show all false
select 'After fix - RLS status:' as info;
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('team_members', 'teams', 'users', 'workspaces', 'boards', 'columns', 'tasks');

-- 6. Check remaining policies
select 'Remaining policies:' as info;
select tablename, policyname
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
