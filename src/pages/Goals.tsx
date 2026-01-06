"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Target } from "lucide-react";
import { addDays } from "date-fns";
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

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: Date;
  type: "short" | "long";
}

const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Complete React Course",
    description: "Finish the advanced React patterns course on Udemy",
    progress: 75,
    deadline: addDays(new Date(), 14),
    type: "short",
  },
  {
    id: "2",
    title: "Save ₹5 Lakhs",
    description: "Reach savings goal for emergency fund",
    progress: 60,
    deadline: addDays(new Date(), 90),
    type: "long",
  },
  {
    id: "3",
    title: "Read 24 Books",
    description: "Read 2 books per month throughout 2026",
    progress: 25,
    deadline: new Date(2026, 11, 31),
    type: "long",
  },
  {
    id: "4",
    title: "Learn TypeScript",
    description: "Complete TypeScript fundamentals and advanced concepts",
    progress: 45,
    deadline: addDays(new Date(), 30),
    type: "short",
  },
  {
    id: "5",
    title: "Build Portfolio Website",
    description: "Create a modern portfolio with all projects",
    progress: 20,
    deadline: addDays(new Date(), 21),
    type: "short",
  },
  {
    id: "6",
    title: "Gym: 200 Sessions",
    description: "Complete 200 gym sessions by end of year",
    progress: 11,
    deadline: new Date(2026, 11, 31),
    type: "long",
  },
];

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [filter, setFilter] = useState<"all" | "short" | "long">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New goal form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState<"short" | "long">("short");
  const [newProgress, setNewProgress] = useState([0]);
  const [newDeadline, setNewDeadline] = useState("");

  const filteredGoals = goals.filter(
    (goal) => filter === "all" || goal.type === filter
  );

  const shortTermGoals = filteredGoals.filter((g) => g.type === "short");
  const longTermGoals = filteredGoals.filter((g) => g.type === "long");

  const handleAddGoal = () => {
    if (!newTitle || !newDeadline) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      progress: newProgress[0],
      deadline: new Date(newDeadline),
      type: newType,
    };

    setGoals([...goals, newGoal]);
    setNewTitle("");
    setNewDescription("");
    setNewType("short");
    setNewProgress([0]);
    setNewDeadline("");
    setIsDialogOpen(false);
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
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-glass-border">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
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
                  <label className="text-sm text-muted-foreground">Description</label>
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe your goal"
                    className="input-dark"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Type</label>
                  <Select value={newType} onValueChange={(v) => setNewType(v as "short" | "long")}>
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
                    Initial Progress: {newProgress[0]}%
                  </label>
                  <Slider
                    value={newProgress}
                    onValueChange={setNewProgress}
                    max={100}
                    step={5}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Deadline</label>
                  <Input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="input-dark"
                  />
                </div>
                <Button
                  onClick={handleAddGoal}
                  className="w-full bg-gradient-primary text-primary-foreground"
                >
                  Create Goal
                </Button>
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {type === "all" ? "All" : type === "short" ? "Short-term" : "Long-term"}
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
              {Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)}%
            </p>
            <p className="text-sm text-muted-foreground">Avg Progress</p>
          </div>
        </div>

        {/* Short-term Goals */}
        {(filter === "all" || filter === "short") && shortTermGoals.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Short-term Goals
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shortTermGoals.map((goal) => (
                <GoalCard key={goal.id} {...goal} />
              ))}
            </div>
          </section>
        )}

        {/* Long-term Goals */}
        {(filter === "all" || filter === "long") && longTermGoals.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-info" />
              Long-term Goals
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {longTermGoals.map((goal) => (
                <GoalCard key={goal.id} {...goal} />
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </PageLayout>
  );
};

export default GoalsPage;
