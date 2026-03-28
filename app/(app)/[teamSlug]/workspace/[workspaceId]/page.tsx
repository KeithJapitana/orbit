import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateBoardDialog } from "@/components/board/CreateBoardDialog";

interface PageProps {
  params: Promise<{ teamSlug: string; workspaceId: string }>;
}

export default async function WorkspacePage({ params }: PageProps) {
  const { teamSlug, workspaceId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get workspace
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .single();

  if (!workspace) {
    redirect(`/${teamSlug}/workspaces`);
  }

  // Get boards
  const { data: boards } = await supabase
    .from("boards")
    .select("*, columns(id)")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  return (
    <div className="container max-w-7xl mx-auto py-8 px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href={`/${teamSlug}/workspaces`} className="hover:text-foreground">
          Workspaces
        </Link>
        <span>/</span>
        <span className="text-foreground">{workspace.name}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
            {workspace.icon || workspace.name[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {workspace.name}
            </h1>
            {workspace.description && (
              <p className="text-muted-foreground mt-1">
                {workspace.description}
              </p>
            )}
          </div>
        </div>
        <CreateBoardDialog workspaceId={workspaceId} teamSlug={teamSlug} />
      </div>

      {boards && boards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board: any) => (
            <Link
              key={board.id}
              href={`/${teamSlug}/board/${board.id}`}
              className="group"
            >
              <Card className="group-hover:border-primary/50 transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{board.name}</span>
                    <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                  {board.description && (
                    <CardDescription className="line-clamp-2">
                      {board.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {board.columns?.length || 0} columns
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Create new board card */}
          <div className="border-dashed border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-center min-h-[150px]">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Create board</p>
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <LayoutGrid className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No boards yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first board to start organizing tasks
            </p>
            <CreateBoardDialog workspaceId={workspaceId} teamSlug={teamSlug} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
