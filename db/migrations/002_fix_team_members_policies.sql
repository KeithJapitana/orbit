-- Fixed RLS Policies for team_members to avoid infinite recursion

-- First, drop the problematic policies
drop policy if exists "Team admins can insert members" on public.team_members;
drop policy if exists "Team admins can update members" on public.team_members;
drop policy if exists "Team admins can delete members" on public.team_members;
drop policy if exists "Team members can read their team memberships" on public.team_members;

-- Fixed read policy
create policy "Team members can read their team memberships"
  on public.team_members for select
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid()
    )
  );

-- Fixed insert policy - check teams table instead of team_members
create policy "Users can insert themselves as team member"
  on public.team_members for insert
  with check (
    auth.uid() = user_id and
    team_id in (
      select id from public.teams
      where created_by = auth.uid()
    )
  );

-- Additional insert policy for admins to add others (check teams ownership)
create policy "Team admins can add members to their teams"
  on public.team_members for insert
  with check (
    team_id in (
      select tm.team_id from public.team_members tm
      join public.teams t on t.id = tm.team_id
      where tm.user_id = auth.uid() and tm.role in ('owner', 'admin')
      and t.created_by != auth.uid() -- Not the creator, but an admin
    )
  );

-- Update policy
create policy "Team members can update their own role"
  on public.team_members for update
  using (auth.uid() = user_id);

create policy "Team owners can update member roles"
  on public.team_members for update
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role = 'owner'
    )
  );

-- Delete policy
create policy "Team owners can delete members"
  on public.team_members for delete
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role = 'owner'
    )
    or auth.uid() = user_id -- Can delete self
  );
