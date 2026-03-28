"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CreateTaskDialogProps {
  columnId: string;
  boardId: string;
  onCreate: (title: string) => void;
  onCancel: () => void;
}

export function CreateTaskDialog({
  onCreate,
  onCancel,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      onCreate(title.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSubmit}
        autoFocus
        className="h-8"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>Press Enter to save</span>
        <button
          onClick={onCancel}
          className="hover:text-foreground transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
