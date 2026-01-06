"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Target, Star, CheckCircle2, Trash2 } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { GoalCard } from "@/components/ui/goal-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGoals } from "@/hooks/use-goals";
import { useBucketList } from "@/hooks/use-bucket-list";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils";

export default function GoalsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    goals,
    shortTermGoals,
    longTermGoals,
    goalsNearingDeadline,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
  } = useGoals();
  const {
    items: bucketItems,
    addItem,
    toggleComplete,
    deleteItem,
    loading: bucketLoading,
  } = useBucketList();

  const [filter, setFilter] = useState<"all" | "short" | "long">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // Goal form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState<"short" | "long">("short");
  const [newProgress, setNewProgress] = useState([0]);
  const [newDeadline, setNewDeadline] = useState("");

  const filteredGoals = goals.filter(
    (goal) => filter === "all" || goal.type === filter
  );

  const averageProgress = useMemo(() => {
    if (!goals.length) return 0;
    const total = goals.reduce((acc, g) => acc + g.progress, 0);
    return Math.round(total / goals.length);
  }, [goals]);

  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewType("short");
    setNewProgress([0]);
    setNewDeadline("");
    setEditingGoalId(null);
  };

  const handleSubmitGoal = async () => {
    if (!newTitle || !newDeadline) {
      toast({
        title: "Error",
        description: "Please fill in title and deadline.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingGoalId) {
        await updateGoal(editingGoalId, {
          title: newTitle,
          description: newDescription,
          progress: newProgress[0],
          deadline: newDeadline,
          type: newType,
        });
        toast({
          title: "Goal updated",
          description: "Your goal has been updated successfully.",
        });
      } else {
        await addGoal({
          title: newTitle,
          description: newDescription,
          progress: newProgress[0],
          deadline: newDeadline,
          type: newType,
        });
        toast({
          title: "Goal added",
          description: "Your goal has been created successfully.",
        });
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditGoal = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    setEditingGoalId(id);
    setNewTitle(goal.title);
    setNewDescription(goal.description);
    setNewType(goal.type);
    setNewProgress([goal.progress]);
    setNewDeadline(goal.deadline.split("T")[0] ?? goal.deadline);
    setIsDialogOpen(true);
  };

  const handleDeleteGoal = async (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    if (!confirm(`Delete goal "${goal.title}"? This cannot be undone.`)) return;

    try {
      await deleteGoal(id);
      toast({
        title: "Goal deleted",
        description: "Your goal has been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout title="Goals">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Goals
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Track your short-term and long-term objectives
            </p>
            {!user && (
              <p className="text-xs text-warning mt-1">
                You’re not signed in. Sign in to save and see your goals.
              </p>
            )}
          </div>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                {editingGoalId ? "Edit Goal" : "Add Goal"}
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-glass-border">
              <DialogHeader>
                <DialogTitle>
                  {editingGoalId ? "Edit Goal" : "Create New Goal"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Title</label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Goal title"
                    className="input-dark"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    Description
                  </label>
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe your goal"
                    className="input-dark"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Type</label>
                  <Select
                    value={newType}
                    onValueChange={(v) => setNewType(v as "short" | "long")}
                  >
                    <SelectTrigger className="input-dark">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short-term</SelectItem>
                      <SelectItem value="long">Long-term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    Progress: {newProgress[0]}%
                  </label>
                  <Slider
                    value={newProgress}
                    onValueChange={setNewProgress}
                    max={100}
                    step={5}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    Deadline
                  </label>
                  <Input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="input-dark"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-glass-border"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitGoal}
                    className="flex-1 bg-gradient-primary text-primary-foreground"
                  >
                    {editingGoalId ? "Save Changes" : "Create Goal"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(["all", "short", "long"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {type === "all"
                ? "All"
                : type === "short"
                ? "Short-term"
                : "Long-term"}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-bold text-primary">{goals.length}</p>
            <p className="text-sm text-muted-foreground">Total Goals</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-bold text-success">
              {goals.filter((g) => g.progress >= 100).length}
            </p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-bold text-warning">
              {averageProgress}%
            </p>
            <p className="text-sm text-muted-foreground">Avg Progress</p>
          </div>
        </div>

        {/* Short-term Goals */}
        {(filter === "all" || filter === "short") && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Short-term Goals
            </h2>
            {loading ? (
              <div className="glass-card p-8 text-center text-muted-foreground">
                Loading goals...
              </div>
            ) : shortTermGoals.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shortTermGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    {...goal}
                    onEdit={handleEditGoal}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center text-muted-foreground">
                <p>No short-term goals yet. Create one to get started!</p>
              </div>
            )}
          </section>
        )}

        {/* Long-term Goals */}
        {(filter === "all" || filter === "long") && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-info" />
              Long-term Goals
            </h2>
            {loading ? (
              <div className="glass-card p-8 text-center text-muted-foreground">
                Loading goals...
              </div>
            ) : longTermGoals.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {longTermGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    {...goal}
                    onEdit={handleEditGoal}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center text-muted-foreground">
                <p>No long-term goals yet. Create one to get started!</p>
              </div>
            )}
          </section>
        )}

        {/* Bucket List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-info" />
              <h2 className="text-lg font-semibold">Bucket List</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-glass-border"
              onClick={async () => {
                const title = prompt(
                  "What do you want to add to your bucket list?"
                );
                if (!title) return;
                const description =
                  prompt("Add an optional description (or leave blank):") ||
                  "";
                try {
                  await addItem({ title, description });
                  toast({
                    title: "Bucket item added",
                    description: "Your wish has been added to the bucket list.",
                  });
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to add bucket item. Please try again.",
                    variant: "destructive",
                  });
                }
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Wish
            </Button>
          </div>

          <div className="glass-card p-4 space-y-3">
            {bucketLoading ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground text-sm">
                Loading bucket list...
              </div>
            ) : bucketItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No bucket list items yet. Start by adding a wish you want to
                achieve.
              </p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-hide">
                {bucketItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-lg border border-glass-border/60 bg-card/60 px-3 py-2.5",
                      item.completedAt && "border-success/60 bg-success/5"
                    )}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await toggleComplete(item.id);
                              toast({
                                title: item.completedAt
                                  ? "Marked as incomplete"
                                  : "Marked as completed",
                                description: item.completedAt
                                  ? "You can edit or delete it again."
                                  : "This memory is now locked and cannot be deleted.",
                              });
                            } catch (error: any) {
                              toast({
                                title: "Error",
                                description:
                                  error.message ||
                                  "Failed to update item. Please try again.",
                                variant: "destructive",
                              });
                            }
                          }}
                          className={cn(
                            "p-1.5 rounded-full border transition-colors",
                            item.completedAt
                              ? "bg-success border-success text-success-foreground"
                              : "border-glass-border text-muted-foreground hover:bg-muted"
                          )}
                          aria-label={
                            item.completedAt
                              ? "Mark as incomplete"
                              : "Mark as completed"
                          }
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <p
                          className={cn(
                            "text-sm font-medium",
                            item.completedAt && "line-through text-success"
                          )}
                        >
                          {item.title}
                        </p>
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      {item.completedAt && (
                        <p className="text-[11px] text-success/80">
                          Locked memory since{" "}
                          {new Date(item.completedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}
                    </div>
                    {!item.completedAt && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (
                            !confirm(
                              `Delete "${item.title}" from your bucket list?`
                            )
                          )
                            return;
                          try {
                            await deleteItem(item.id);
                            toast({
                              title: "Bucket item deleted",
                              description:
                                "The wish has been removed from your list.",
                            });
                          } catch (error: any) {
                            toast({
                              title: "Error",
                              description:
                                error.message ||
                                "Failed to delete item. Please try again.",
                              variant: "destructive",
                            });
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        aria-label="Delete bucket item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </motion.div>
    </PageLayout>
  );
}


