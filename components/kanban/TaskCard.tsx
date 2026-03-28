"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Flag } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
}

interface TaskCardProps {
  task: Task;
  isDragOverlay?: boolean;
}

const priorityColors: Record<string, string> = {
  urgent: "text-red-500",
  high: "text-orange-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
  none: "text-muted-foreground",
};

export function TaskCard({ task, isDragOverlay }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragOverlay) {
    return (
      <Card className="p-3 cursor-grab shadow-lg rotate-3 opacity-90">
        <div className="flex items-start gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{task.title}</p>
            {task.description && (
              <p className="text-xs text-muted-foreground truncate mt-1">
                {task.description}
              </p>
            )}
          </div>
          {task.priority !== "none" && (
            <Flag className={`w-3 h-3 ${priorityColors[task.priority]} shrink-0`} />
          )}
        </div>
      </Card>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-50" : ""}
    >
      <Card
        className="p-3 cursor-grab hover:bg-accent/50 transition-colors"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-start gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{task.title}</p>
            {task.description && (
              <p className="text-xs text-muted-foreground truncate mt-1">
                {task.description}
              </p>
            )}
          </div>
          {task.priority !== "none" && (
            <Flag
              className={`w-3 h-3 ${priorityColors[task.priority]} shrink-0 mt-0.5`}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
