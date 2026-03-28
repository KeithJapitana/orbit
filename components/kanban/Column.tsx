"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GripVertical, MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
}

interface ColumnData {
  id: string;
  title: string;
  position: number;
  tasks: Task[];
}

interface ColumnProps {
  column: ColumnData;
  children: ReactNode;
}

export function Column({ column, children }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const taskIds = column.tasks.map((task) => task.id);

  return (
    <div className="flex flex-col w-80 min-w-[320px] bg-muted/30 rounded-lg border shrink-0 h-fit max-h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">{column.title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {column.tasks.length}
          </span>
        </div>
        <button className="p-1 hover:bg-muted rounded transition-colors">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Tasks */}
      <div ref={setNodeRef} className="flex flex-col min-h-[100px]">
        {children}
      </div>
    </div>
  );
}
