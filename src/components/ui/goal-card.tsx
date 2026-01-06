import { motion } from "framer-motion";
import { Calendar, Target, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";

interface GoalCardProps {
  id?: string;
  title: string;
  description: string;
  progress: number;
  deadline: Date | string; // Support both Date and ISO string
  type: "short" | "long";
  className?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function GoalCard({
  id,
  title,
  description,
  progress,
  deadline,
  type,
  className,
  onEdit,
  onDelete,
}: GoalCardProps) {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const daysRemaining = differenceInDays(deadlineDate, new Date());
  const isUrgent = daysRemaining <= 7 && daysRemaining > 0;
  const isOverdue = daysRemaining < 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-card-hover p-4 space-y-4",
        isUrgent && "border-warning/50",
        isOverdue && "border-destructive/50",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                type === "short"
                  ? "bg-primary/20 text-primary"
                  : "bg-info/20 text-info"
              )}
            >
              {type === "short" ? "Short-term" : "Long-term"}
            </span>
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && id && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Edit goal"
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
              aria-label="Delete goal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <Target className="w-5 h-5 text-primary flex-shrink-0" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span
          className={cn(
            "text-muted-foreground",
            isUrgent && "text-warning",
            isOverdue && "text-destructive"
          )}
        >
          {isOverdue
            ? `${Math.abs(daysRemaining)} days overdue`
            : `${daysRemaining} days remaining`}
        </span>
        <span className="text-muted-foreground ml-auto">
          {format(deadlineDate, "MMM dd, yyyy")}
        </span>
      </div>
    </motion.div>
  );
}
