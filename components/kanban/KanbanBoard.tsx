"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { CreateTaskDialog } from "./CreateTaskDialog";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  position: number;
  assignee_id: string | null;
  created_by: string;
  column_id: string;
  board_id: string;
}

interface ColumnData {
  id: string;
  title: string;
  position: number;
  tasks: Task[];
}

interface KanbanBoardProps {
  boardId: string;
  columns: ColumnData[];
  teamSlug: string;
}

export function KanbanBoard({
  boardId,
  columns: initialColumns,
  teamSlug,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState<ColumnData[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [creatingInColumn, setCreatingInColumn] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const task = columns
      .flatMap((col) => col.tasks)
      .find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  }, [columns]);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;

      if (!over) return;

      const activeTaskId = active.id as string;
      const overId = over.id as string;

      // Find source and destination columns
      let sourceColumn = columns.find((col) =>
        col.tasks.some((t) => t.id === activeTaskId)
      );
      let destColumn = columns.find((col) =>
        col.tasks.some((t) => t.id === overId)
      );

      // If dragging over a column (empty column), not a task
      if (!destColumn) {
        destColumn = columns.find((col) => col.id === overId);
      }

      if (!sourceColumn || !destColumn) return;

      const task = sourceColumn.tasks.find((t) => t.id === activeTaskId);
      if (!task) return;

      // Optimistic update
      const newColumns = columns.map((col) => {
        if (col.id === sourceColumn!.id) {
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== activeTaskId),
          };
        }
        if (col.id === destColumn!.id) {
          const tasks = [...col.tasks];
          const overIndex = tasks.findIndex((t) => t.id === overId);
          const insertIndex = overIndex >= 0 ? overIndex : tasks.length;
          tasks.splice(insertIndex, 0, { ...task, column_id: col.id });
          return {
            ...col,
            tasks: tasks.map((t, i) => ({ ...t, position: i })),
          };
        }
        return col;
      });

      setColumns(newColumns);

      // Persist to database
      const allTasks = newColumns.flatMap((col) =>
        col.tasks.map((t) => ({
          id: t.id,
          column_id: col.id,
          position: t.position,
        }))
      );

      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: allTasks }),
      });
    },
    [columns]
  );

  const handleCreateTask = useCallback(
    (columnId: string, title: string) => {
      const column = columns.find((c) => c.id === columnId);
      if (!column) return;

      const newTask: Task = {
        id: `temp-${Date.now()}`,
        title,
        description: null,
        priority: "none",
        status: "todo",
        position: column.tasks.length,
        assignee_id: null,
        created_by: "",
        column_id: columnId,
        board_id: boardId,
      };

      setColumns(
        columns.map((col) =>
          col.id === columnId
            ? { ...col, tasks: [...col.tasks, newTask] }
            : col
        )
      );
      setCreatingInColumn(null);
    },
    [columns, boardId]
  );

  return (
    <div className="h-full p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 h-full overflow-x-auto pb-4">
          {columns.map((column) => (
            <Column key={column.id} column={column}>
              <SortableContext
                items={column.tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex-1 space-y-2 p-2 min-h-[100px]">
                  {column.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </SortableContext>
              <div className="p-2 pt-0">
                {creatingInColumn === column.id ? (
                  <CreateTaskDialog
                    columnId={column.id}
                    boardId={boardId}
                    onCreate={(title) => handleCreateTask(column.id, title)}
                    onCancel={() => setCreatingInColumn(null)}
                  />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-muted-foreground"
                    onClick={() => setCreatingInColumn(column.id)}
                  >
                    <Plus className="w-4 h-4" />
                    Add task
                  </Button>
                )}
              </div>
            </Column>
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
