import { motion } from "framer-motion";
import { Bookmark, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RememberedItemCardProps {
  id?: string;
  title: string;
  description: string;
  className?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function RememberedItemCard({
  id,
  title,
  description,
  className,
  onEdit,
  onDelete,
}: RememberedItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("glass-card-hover p-4 space-y-3", className)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-primary flex-shrink-0" />
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-2">
          {onEdit && id && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Edit item"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && id && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
              aria-label="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

