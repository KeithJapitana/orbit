import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspace_id");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspace_id is required" },
      { status: 400 }
    );
  }

  const { data: boards, error } = await supabase
    .from("boards")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ boards });
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
  const { name, description, workspace_id } = body;

  if (!name || !workspace_id) {
    return NextResponse.json(
      { error: "Name and workspace_id are required" },
      { status: 400 }
    );
  }

  // Create board
  const { data: board, error } = await supabase
    .from("boards")
    .insert({
      name,
      description,
      workspace_id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create default columns
  const defaultColumns = [
    { title: "Backlog", position: 0 },
    { title: "To Do", position: 1 },
    { title: "In Progress", position: 2 },
    { title: "In Review", position: 3 },
    { title: "Done", position: 4 },
  ];

  const { error: columnsError } = await supabase.from("columns").insert(
    defaultColumns.map((col) => ({
      ...col,
      board_id: board.id,
    }))
  );

  if (columnsError) {
    return NextResponse.json({ error: columnsError.message }, { status: 500 });
  }

  return NextResponse.json({ board }, { status: 201 });
}
