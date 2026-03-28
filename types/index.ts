import { UUID } from "crypto";

// Database table types based on Supabase schema
export interface User {
  id: UUID;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: UUID;
  name: string;
  slug: string;
  avatar_url: string | null;
  subscription_tier: "free" | "lite" | "pro";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_by: UUID;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: UUID;
  team_id: UUID;
  user_id: UUID;
  role: "owner" | "admin" | "member" | "guest";
  created_at: string;
}

export interface Workspace {
  id: UUID;
  team_id: UUID;
  name: string;
  description: string | null;
  icon: string | null;
  created_by: UUID;
  created_at: string;
  updated_at: string;
}

export interface Board {
  id: UUID;
  workspace_id: UUID;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: UUID;
  board_id: UUID;
  title: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: UUID;
  board_id: UUID;
  column_id: UUID;
  title: string;
  description: string | null;
  position: number;
  assignee_id: UUID | null;
  priority: "none" | "low" | "medium" | "high" | "urgent";
  status: "backlog" | "todo" | "in_progress" | "done" | "canceled";
  created_by: UUID;
  created_at: string;
  updated_at: string;
}

export interface TeamInvite {
  id: UUID;
  team_id: UUID;
  email: string;
  role: "admin" | "member" | "guest";
  token: string;
  expires_at: string;
  created_by: UUID;
  created_at: string;
}

// Join types with relations
export interface TeamMemberWithUser extends TeamMember {
  user: User;
  team: Team;
}

export interface WorkspaceWithBoards extends Workspace {
  boards: Board[];
}

export interface BoardWithColumns extends Board {
  columns: (Column & { tasks: Task[] })[];
}
