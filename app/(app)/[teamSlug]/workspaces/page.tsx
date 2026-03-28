import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, FolderKanban, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PageProps {
  params: Promise<{ teamSlug: string }>;
}

export default async function WorkspacesPage({ params }: PageProps) {
  const { teamSlug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get team
  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("slug", teamSlug)
    .single();

  if (!team) {
    redirect("/dashboard");
  }

  // Get workspaces
  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("*")
    .eq("team_id", team.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container max-w-7xl mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground mt-1">
            Organize your projects into workspaces and boards
          </p>
        </div>
        <Link href={`/${teamSlug}/workspaces/new`}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Workspace
          </Button>
        </Link>
      </div>

      {workspaces && workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/${teamSlug}/workspace/${workspace.id}`}
            >
              <Card className="group hover:border-primary/50 transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                      {workspace.icon || workspace.name[0]?.toUpperCase()}
                    </div>
                    <FolderKanban className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">{workspace.name}</CardTitle>
                  {workspace.description && (
                    <CardDescription className="line-clamp-2">
                      {workspace.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>0 boards</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Create new workspace card */}
          <Link href={`/${teamSlug}/workspaces/new`}>
            <Card className="border-dashed hover:bg-muted/50 transition-colors cursor-pointer h-full flex items-center justify-center min-h-[200px]">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-medium">Create workspace</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Organize projects and boards
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FolderKanban className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No workspaces yet</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              Create your first workspace to start organizing projects and boards
            </p>
            <Link href={`/${teamSlug}/workspaces/new`}>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Workspace
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
