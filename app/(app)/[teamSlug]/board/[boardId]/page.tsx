import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

interface PageProps {
  params: Promise<{ teamSlug: string; boardId: string }>;
}

export default async function BoardPage({ params }: PageProps) {
  const { teamSlug, boardId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get board
  const { data: board } = await supabase
    .from("boards")
    .select("*, workspaces(id, name)")
    .eq("id", boardId)
    .single();

  if (!board) {
    redirect(`/${teamSlug}/workspaces`);
  }

  // Get columns with tasks
  const { data: columns } = await supabase
    .from("columns")
    .select("*, tasks(*)")
    .eq("board_id", boardId)
    .order("position", { ascending: true });

  // Sort tasks within columns
  const sortedColumns = columns?.map((col) => ({
    ...col,
    tasks: (col.tasks || []).sort((a: any, b: any) => a.position - b.position),
  }));

  const workspace = board.workspaces as { id: string; name: string };

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="border-b bg-card px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href={`/${teamSlug}/workspaces`}
            className="hover:text-foreground"
          >
            Workspaces
          </Link>
          <span>/</span>
          <Link
            href={`/${teamSlug}/workspace/${workspace.id}`}
            className="hover:text-foreground"
          >
            {workspace.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{board.name}</span>
        </div>
      </div>

      {/* Board Header */}
      <div className="border-b bg-card px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">{board.name}</h1>
        {board.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {board.description}
          </p>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          boardId={boardId}
          columns={sortedColumns || []}
          teamSlug={teamSlug}
        />
      </div>
    </div>
  );
}
