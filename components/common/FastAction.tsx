//@/components/common/FastAction.tsx

"use client";

import { Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ItemActionsProps {
  itemId?: string; //

  onEdit?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  onDone?: () => void;
}

export function FastAction({
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isLoading = false,
  disabled = false,
}: ItemActionsProps) {
  return (
    <div className="flex gap-2">
      {onMoveUp && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onMoveUp}
          disabled={isLoading || disabled}
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      )}
      {onMoveDown && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onMoveDown}
          disabled={isLoading || disabled}
        >
          <ArrowDown className="w-4 h-4" />
        </Button>
      )}
      {onEdit && (
        <Button
          size="icon"
          variant="outline"
          onClick={onEdit}
          disabled={isLoading || disabled}
        >
          <Edit className="w-4 h-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          size="icon"
          variant="destructive"
          onClick={onDelete}
          disabled={isLoading || disabled}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
