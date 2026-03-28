import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get("board_id");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!boardId) {
    return NextResponse.json(
      { error: "board_id is required" },
      { status: 400 }
    );
  }

  // Get columns with tasks
  const { data: columns, error } = await supabase
    .from("columns")
    .select("*, tasks(*)")
    .eq("board_id", boardId)
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Sort tasks within columns by position
  const sortedColumns = columns?.map((col: any) => ({
    ...col,
    tasks: (col.tasks || []).sort(
      (a: any, b: any) => a.position - b.position
    ),
  }));

  return NextResponse.json({ columns: sortedColumns });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, column_id, board_id, priority, assignee_id } =
    body;

  if (!title || !column_id || !board_id) {
    return NextResponse.json(
      { error: "Title, column_id, and board_id are required" },
      { status: 400 }
    );
  }

  // Get the highest position in this column
  const { data: existingTasks } = await supabase
    .from("tasks")
    .select("position")
    .eq("column_id", column_id)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = (existingTasks?.[0]?.position ?? -1) + 1;

  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      title,
      description,
      column_id,
      board_id,
      priority: priority || "none",
      assignee_id: assignee_id || null,
      status: "todo",
      position: nextPosition,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ task }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { tasks } = body as { tasks: { id: string; column_id: string; position: number }[] };

  if (!tasks || !Array.isArray(tasks)) {
    return NextResponse.json(
      { error: "tasks array is required" },
      { status: 400 }
    );
  }

  // Update positions for all moved tasks
  const updates = tasks.map((task) =>
    supabase
      .from("tasks")
      .update({ column_id: task.column_id, position: task.position })
      .eq("id", task.id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Failed to update some tasks" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
