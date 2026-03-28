-- TEMPORARY: Disable RLS on team_members to test if this fixes the issue
-- WARNING: This makes team_members publicly accessible - only for testing!

alter table public.team_members disable row level security;
