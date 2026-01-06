"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Video,
  Smile,
  Plus,
  Minus,
  Check
} from "lucide-react";
import { format, parse } from "date-fns";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface HabitItem {
  id: string;
  label: string;
  checked: boolean;
}

const DailyLog = () => {
  const params = useParams();
  const date = params?.date as string;
  const router = useRouter();
  const { toast } = useToast();

  const parsedDate = date ? parse(date, "MM-dd", new Date(2026, 0, 1)) : new Date();
  const formattedDate = format(parsedDate, "EEEE, MMMM d, yyyy");

  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState([7]);
  const [habits, setHabits] = useState<HabitItem[]>([
    { id: "gym", label: "Gym", checked: false },
    { id: "meditation", label: "Meditation", checked: false },
    { id: "reading", label: "Reading", checked: false },
    { id: "study", label: "Study", checked: false },
    { id: "journaling", label: "Journaling", checked: false },
  ]);
  const [masturbationCount, setMasturbationCount] = useState(0);
  const [expenses, setExpenses] = useState("");
  const [savings, setSavings] = useState("");
  const [mutualFund, setMutualFund] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const [readingMinutes, setReadingMinutes] = useState("");

  const toggleHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h => (h.id === id ? { ...h, checked: !h.checked } : h))
    );
  };

  const getMoodEmoji = (value: number) => {
    if (value <= 2) return "😢";
    if (value <= 4) return "😕";
    if (value <= 6) return "😐";
    if (value <= 8) return "😊";
    return "😄";
  };

  const getMoodColor = (value: number) => {
    if (value <= 2) return "text-destructive";
    if (value <= 4) return "text-warning";
    if (value <= 6) return "text-muted-foreground";
    if (value <= 8) return "text-info";
    return "text-success";
  };

  const handleSave = () => {
    // This will be replaced with Firebase save
    toast({
      title: "Log Saved!",
      description: `Your entry for ${formattedDate} has been saved.`,
    });
  };

  return (
    <PageLayout title="Daily Log">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">{formattedDate}</h1>
            <p className="text-sm text-muted-foreground">Daily Log Entry</p>
          </div>
        </div>

        {/* Notes */}
        <div className="glass-card p-4 space-y-3">
          <h2 className="font-semibold">Notes & Reflections</h2>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was your day? What happened? What did you learn?"
            className="input-dark min-h-[120px] resize-none"
          />
        </div>

        {/* Mood Slider */}
        <div className="glass-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Smile className="w-5 h-5 text-primary" />
              Mood
            </h2>
            <span className={`text-3xl ${getMoodColor(mood[0])}`}>
              {getMoodEmoji(mood[0])}
            </span>
          </div>
          <div className="space-y-2">
            <Slider
              value={mood}
              onValueChange={setMood}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>😢 Bad</span>
              <span className="font-bold text-foreground">{mood[0]}/10</span>
              <span>Amazing 😄</span>
            </div>
          </div>
        </div>

        {/* Habits Checklist */}
        <div className="glass-card p-4 space-y-4">
          <h2 className="font-semibold">Habits</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {habits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${habit.checked
                  ? "bg-success/20 border border-success/40"
                  : "bg-muted/30 border border-transparent hover:border-muted"
                  }`}
              >
                <Checkbox checked={habit.checked} />
                <span className="text-sm font-medium">{habit.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Tracking */}
        <div className="glass-card p-4 space-y-4">
          <h2 className="font-semibold">Time Tracking</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Wake Time</label>
              <Input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="input-dark"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Sleep Time</label>
              <Input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="input-dark"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Study (hours)</label>
              <Input
                type="number"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                placeholder="0"
                className="input-dark"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Reading (mins)</label>
              <Input
                type="number"
                value={readingMinutes}
                onChange={(e) => setReadingMinutes(e.target.value)}
                placeholder="0"
                className="input-dark"
              />
            </div>
          </div>
        </div>

        {/* Counter */}
        <div className="glass-card p-4 space-y-4">
          <h2 className="font-semibold">Masturbation Counter</h2>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setMasturbationCount(Math.max(0, masturbationCount - 1))}
              className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <motion.span
              key={masturbationCount}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold w-16 text-center"
            >
              {masturbationCount}
            </motion.span>
            <button
              onClick={() => setMasturbationCount(masturbationCount + 1)}
              className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Finances */}
        <div className="glass-card p-4 space-y-4">
          <h2 className="font-semibold">Finances</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Expenses (₹)</label>
              <Input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                placeholder="0"
                className="input-dark"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Savings (₹)</label>
              <Input
                type="number"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                placeholder="0"
                className="input-dark"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Mutual Fund (₹)</label>
              <Input
                type="number"
                value={mutualFund}
                onChange={(e) => setMutualFund(e.target.value)}
                placeholder="0"
                className="input-dark"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Portfolio (₹)</label>
              <Input
                type="number"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="0"
                className="input-dark"
              />
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="glass-card p-4 space-y-4">
          <h2 className="font-semibold">Media</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-glass-border hover:border-primary/50 transition-colors">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Add Photos</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-glass-border hover:border-primary/50 transition-colors">
              <Video className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Add Videos</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 h-12 text-lg font-semibold"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Entry
        </Button>
      </motion.div>
    </PageLayout>
  );
};

export default DailyLog;
