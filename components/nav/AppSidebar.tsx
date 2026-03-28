"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  CreditCard,
  Plus,
  ChevronDown,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppSidebarProps {
  user: User;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  subscription_tier: string;
}

interface TeamMembership {
  team_id: string;
  role: string;
  teams: Team;
}

interface Workspace {
  id: string;
  name: string;
  icon: string | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const [teams, setTeams] = useState<TeamMembership[]>([]);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const supabase = createClient();

  // Extract team slug from pathname
  const segments = pathname.split("/").filter(Boolean);
  const currentTeamSlug = segments[0] || "";

  useEffect(() => {
    async function loadTeams() {
      const { data } = await supabase
        .from("team_members")
        .select("team_id, role, teams(id, name, slug, subscription_tier)")
        .eq("user_id", user.id);

      if (data) {
        const memberships = data as unknown as TeamMembership[];
        setTeams(memberships);
        const active =
          memberships.find((t) => t.teams.slug === currentTeamSlug) ||
          memberships[0];
        if (active) setActiveTeam(active.teams);
      }
    }
    loadTeams();
  }, [user.id, currentTeamSlug, supabase]);

  useEffect(() => {
    async function loadWorkspaces() {
      if (!activeTeam) return;
      const { data } = await supabase
        .from("workspaces")
        .select("id, name, icon")
        .eq("team_id", activeTeam.id)
        .order("created_at", { ascending: false });

      if (data) setWorkspaces(data);
    }
    loadWorkspaces();
  }, [activeTeam, supabase]);

  const teamSlug = activeTeam?.slug || "";

  const navItems = [
    {
      href: `/${teamSlug}/workspaces`,
      icon: LayoutDashboard,
      label: "Workspaces",
    },
    {
      href: `/${teamSlug}/team/members`,
      icon: Users,
      label: "Team",
    },
    {
      href: `/${teamSlug}/billing`,
      icon: CreditCard,
      label: "Billing",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <div className="w-64 border-r bg-card flex flex-col h-full shrink-0">
      {/* Team Switcher */}
      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="w-full justify-between h-10 px-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {activeTeam?.name?.[0]?.toUpperCase() || "O"}
                  </div>
                  <span className="truncate text-sm font-medium">
                    {activeTeam?.name || "Select team"}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Teams</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {teams.map((membership) => (
              <DropdownMenuItem key={membership.team_id}>
                <Link
                  href={`/${membership.teams.slug}/workspaces`}
                  className="flex items-center w-full"
                >
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                    {membership.teams.name[0]?.toUpperCase()}
                  </div>
                  {membership.teams.name}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/onboarding" className="flex items-center w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create team
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start gap-2 h-8"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}

        <Separator className="my-3" />

        {/* Workspaces List */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Workspaces
            </span>
            <Link href={`/${teamSlug}/workspaces`}>
              <Button variant="ghost" size="icon-xs">
                <Plus className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/${teamSlug}/workspace/${workspace.id}`}
            >
              <Button
                variant={
                  pathname.includes(`/workspace/${workspace.id}`)
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                className="w-full justify-start gap-2 h-8"
              >
                <FolderKanban className="w-4 h-4 text-muted-foreground" />
                <span className="truncate">{workspace.name}</span>
              </Button>
            </Link>
          ))}
          {workspaces.length === 0 && (
            <p className="text-xs text-muted-foreground px-2 py-1">
              No workspaces yet
            </p>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t">
        <div className="flex items-center gap-2 px-2">
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
            {user.user_metadata?.display_name?.[0]?.toUpperCase() ||
              user.email?.[0]?.toUpperCase() ||
              "U"}
          </div>
          <span className="text-xs truncate text-muted-foreground">
            {user.user_metadata?.display_name || user.email}
          </span>
        </div>
      </div>
    </div>
  );
}
