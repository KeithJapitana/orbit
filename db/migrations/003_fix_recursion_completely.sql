-- Complete fix for infinite recursion - avoid querying team_members in INSERT policies

-- Drop all existing policies on team_members
drop policy if exists "Team members can read their team memberships" on public.team_members;
drop policy if exists "Users can insert themselves as team member" on public.team_members;
drop policy if exists "Team admins can add members to their teams" on public.team_members;
drop policy if exists "Team members can update their own role" on public.team_members;
drop policy if exists "Team owners can update member roles" on public.team_members;
drop policy if exists "Team owners can delete members" on public.team_members;

-- Read policy - keeps existing but safe
create policy "Team members can read their team memberships"
  on public.team_members for select
  using (auth.uid() = user_id);

-- Insert policy - ONLY check teams table, never team_members
create policy "Users can insert themselves as member of teams they created"
  on public.team_members for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.teams
      where id = team_id and created_by = auth.uid()
    )
  );

-- Alternative: Allow insert if user is authenticated and inserting themselves
-- This works for team creation since the team is created first, then the member
create policy "Authenticated users can insert themselves as team members"
  on public.team_members for insert
  with check (auth.uid() = user_id);

-- Update policy - only allow updating own record
create policy "Users can update their own team membership"
  on public.team_members for update
  using (auth.uid() = user_id);

-- Delete policy - allow deleting own membership or if team creator
create policy "Users can delete their own team membership"
  on public.team_members for delete
  using (auth.uid() = user_id);

create policy "Team creators can delete team memberships"
  on public.team_members for delete
  using (
    exists (
      select 1 from public.teams
      where id = team_id and created_by = auth.uid()
    )
  );
