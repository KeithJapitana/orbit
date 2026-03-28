-- Check and fix teams table policies that might cause issues

-- Drop problematic policies
drop policy if exists "Authenticated users can create teams" on public.teams;
drop policy if exists "Team admins can update teams" on public.teams;

-- Simple create policy - any authenticated user can create teams
create policy "Authenticated users can create teams"
  on public.teams for insert
  with check (auth.uid() = created_by);

-- Update policy - only team creator can update
create policy "Team creators can update teams"
  on public.teams for update
  using (created_by = auth.uid());
