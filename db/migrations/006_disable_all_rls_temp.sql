-- Disable RLS on ALL tables to isolate the recursion issue
-- Run this to test if the app works without RLS

alter table public.users disable row level security;
alter table public.teams disable row level security;
alter table public.team_members disable row level security;
alter table public.workspaces disable row level security;
alter table public.boards disable row level security;
alter table public.columns disable row level security;
alter table public.tasks disable row level security;
alter table public.team_invites disable row level security;
alter table public.ai_usage disable row level security;
