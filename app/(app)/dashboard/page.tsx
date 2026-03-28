import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's teams
  const { data: teams } = await supabase
    .from("team_members")
    .select("*, teams(*)")
    .eq("user_id", user.id);

  // If user has no teams, redirect to onboarding
  if (!teams || teams.length === 0) {
    redirect("/onboarding");
  }

  // Get the first team
  const firstTeam = teams[0]?.teams;
  const teamSlug = firstTeam?.slug;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg rotate-45" />
                  <div className="absolute inset-0.5 bg-background rounded-lg rotate-45" />
                  <div className="absolute inset-1.5 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-sm rotate-45" />
                </div>
                <span className="text-lg font-bold">Orbit</span>
              </div>
              {teamSlug && (
                <Link
                  href={`/${teamSlug}/workspaces`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {firstTeam?.name}
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/${teamSlug}/workspaces`}>
                <Button size="sm">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Welcome */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user.user_metadata?.display_name || user.email}
            </h1>
            <p className="text-muted-foreground mt-2">
              Here&apos;s what&apos;s happening with your projects
            </p>
          </div>

          {/* Teams */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams?.map((teamMember) => (
              <Card
                key={teamMember.teams.id}
                className="group hover:border-primary/50 transition-colors cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {teamMember.teams.name}
                    <span className="text-xs capitalize px-2 py-1 bg-muted rounded-full">
                      {teamMember.role}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {teamMember.teams.subscription_tier} plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/${teamMember.teams.slug}/workspaces`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Open Workspace
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}

            {/* Create new team */}
            <Card className="border-dashed hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-muted-foreground" />
                  Create Team
                </CardTitle>
                <CardDescription>
                  Start a new workspace for your projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/onboarding">
                  <Button variant="outline" size="sm" className="w-full">
                    Create Team
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Tasks</CardDescription>
                <CardTitle className="text-3xl">12</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>In Progress</CardDescription>
                <CardTitle className="text-3xl">5</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Completed This Week</CardDescription>
                <CardTitle className="text-3xl">23</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
