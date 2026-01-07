"use client";

import { useState, useEffect } from "react";
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
    Check,
    Utensils
} from "lucide-react";
import { format, parse } from "date-fns";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Firebase imports
import { useAuth } from "@/lib/firebase/auth";
import { getDocument, addDocument, updateDocument } from "@/lib/firebase/db";
import { uploadImage, uploadVideo } from "@/lib/firebase/storage";

interface HabitItem {
    id: string;
    label: string;
    checked: boolean;
}

interface LogEntry {
    id: string;
    notes?: string;
    mood?: number;
    masturbation_count?: number;
    masturbationCount?: number;
    vratham_count?: number;
    vrathamCount?: number;
    wakeTime?: string;
    sleepTime?: string;
    studyHours?: number;
    readingMinutes?: number;
    habits?: Record<string, boolean | number>;
    photos?: string[];
    videos?: string[];
    daySpends?: {
        label: string;
        amount: number;
    }[];
    totalDaySpends?: number;
    whatDidYouEat?: string;
}

export default function DailyLog() {
    const params = useParams();
    const date = (params?.date as string) || "";
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();

    // Derived date
    const parsedDate = date ? parse(date, "MM-dd", new Date(2026, 0, 1)) : new Date();
    // We need a standard format for the ID: YYYY-MM-DD
    // Although the URL uses MM-dd, we should probably stick to full date for ID to avoid year collisions if extended.
    // The current URL structure implies 2026, so let's construct it.
    const logId = format(parsedDate, "yyyy-MM-dd");
    const formattedDate = format(parsedDate, "EEEE, MMMM d, yyyy");

    const [loading, setLoading] = useState(true);
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
    const [vrathamCount, setVrathamCount] = useState(0);
    const [wakeTime, setWakeTime] = useState("");
    const [sleepTime, setSleepTime] = useState("");
    const [studyHours, setStudyHours] = useState("");
    const [readingMinutes, setReadingMinutes] = useState("");
    const [photos, setPhotos] = useState<string[]>([]);
    const [videos, setVideos] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [daySpends, setDaySpends] = useState<{ label: string; amount: string }[]>([
        { label: "", amount: "" },
    ]);
    const [whatDidYouEat, setWhatDidYouEat] = useState("");

    // Fetch existing log
    useEffect(() => {
        const fetchLog = async () => {
            if (!user) return;
            try {
                const logData = await getDocument<LogEntry>(`users/${user.uid}/logs`, logId);
                if (logData) {
                    setNotes(logData.notes || "");
                    setMood([logData.mood || 7]);
                    setMasturbationCount(logData.masturbation_count || logData.masturbationCount || 0);
                    setVrathamCount(logData.vratham_count || logData.vrathamCount || 0);
                    setWakeTime(logData.wakeTime || "");
                    setSleepTime(logData.sleepTime || "");
                    // Support both habits.study and studyHours
                    const studyValue = logData.habits?.study || logData.studyHours || 0;
                    const readingValue = logData.habits?.reading || logData.readingMinutes || 0;
                    setStudyHours(studyValue.toString());
                    setReadingMinutes(readingValue.toString());
                    setPhotos(logData.photos || []);
                    setVideos(logData.videos || []);

                    if (logData.daySpends && logData.daySpends.length > 0) {
                        setDaySpends(
                            logData.daySpends.map((item) => ({
                                label: item.label,
                                amount: item.amount.toString(),
                            }))
                        );
                    }

                    setWhatDidYouEat(logData.whatDidYouEat || "");

                    // Restore habits
                    if (logData.habits) {
                        setHabits(prev => prev.map(h => ({
                            ...h,
                            checked: !!logData.habits?.[h.id]
                        })));
                    }
                }
            } catch (error) {
                console.error("Error fetching log:", error);
                toast({
                    title: "Error",
                    description: "Failed to load entry.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchLog();
        } else {
            // Wait for auth or just finish loading if no user
            // We'll rely on useAuth taking a moment. 
            // If user is null initially (loading), useEffect will re-run when it changes.
        }
    }, [user, logId, toast]);


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

    const handleDaySpendChange = (index: number, field: "label" | "amount", value: string) => {
        setDaySpends((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        [field]: value,
                    }
                    : item
            )
        );
    };

    const addDaySpendRow = () => {
        setDaySpends((prev) => [...prev, { label: "", amount: "" }]);
    };

    const removeDaySpendRow = (index: number) => {
        setDaySpends((prev) => prev.filter((_, i) => i !== index));
    };

    const getTotalDaySpends = () =>
        daySpends.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !user) return;

        setUploading(true);
        try {
            const uploadPromises = Array.from(files).map(file => 
                uploadImage(file, user.uid, logId)
            );
            const urls = await Promise.all(uploadPromises);
            setPhotos(prev => [...prev, ...urls]);
            toast({
                title: "Photos uploaded!",
                description: `${urls.length} photo(s) uploaded successfully.`,
            });
        } catch (error) {
            console.error("Error uploading photos:", error);
            toast({
                title: "Upload Failed",
                description: "Could not upload photos. Please try again.",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Check file size (max 50MB for videos)
        if (file.size > 50 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Video must be less than 50MB.",
                variant: "destructive",
            });
            return;
        }

        setUploading(true);
        try {
            const url = await uploadVideo(file, user.uid, logId);
            setVideos(prev => [...prev, url]);
            toast({
                title: "Video uploaded!",
                description: "Video uploaded successfully.",
            });
        } catch (error) {
            console.error("Error uploading video:", error);
            toast({
                title: "Upload Failed",
                description: "Could not upload video. Please try again.",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const removeVideo = (index: number) => {
        setVideos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!user) {
            toast({ title: "Error", description: "You must be logged in to save.", variant: "destructive" });
            return;
        }

        const habitMap = habits.reduce((acc, h) => ({ ...acc, [h.id]: h.checked }), {} as Record<string, boolean>);

        // Align with requirements: use snake_case for some fields
        const totalDaySpends = daySpends.reduce(
            (sum, item) => sum + (parseFloat(item.amount) || 0),
            0
        );

        const cleanedDaySpends = daySpends
            .filter((item) => item.label.trim() !== "" || item.amount.trim() !== "")
            .map((item) => ({
                label: item.label.trim(),
                amount: parseFloat(item.amount) || 0,
            }));

        const logData = {
            id: logId,
            date: logId,
            notes,
            mood: mood[0],
            habits: {
                gym: habitMap.gym || false,
                meditation: habitMap.meditation || false,
                study: parseFloat(studyHours) || 0,
                reading: parseFloat(readingMinutes) || 0,
            },
            masturbation_count: masturbationCount,
            vratham_count: vrathamCount,
            wakeTime,
            sleepTime,
            studyHours: parseFloat(studyHours) || 0,
            readingMinutes: parseFloat(readingMinutes) || 0,
            photos,
            videos,
            daySpends: cleanedDaySpends,
            totalDaySpends,
            whatDidYouEat,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        try {
            // Using setDoc (via addDocument which calls setDoc with ID) will create or overwrite
            await addDocument(`users/${user.uid}/logs`, logId, logData);

            toast({
                title: "Log Saved!",
                description: `Your entry for ${formattedDate} has been saved.`,
            });
            router.push("/"); // Optional: go back to dashboard
        } catch (error) {
            console.error("Error saving log:", error);
            toast({
                title: "Save Failed",
                description: "Could not save your entry. Please try again.",
                variant: "destructive",
            });
        }
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
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold">Notes & Reflections</h2>
                        <span className="text-xs text-muted-foreground">Markdown supported</span>
                    </div>
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="How was your day? What happened? What did you learn?&#10;&#10;You can use Markdown: **bold**, *italic*, # headings, - lists, etc."
                        className="input-dark min-h-[120px] resize-none font-mono text-sm"
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
                            <div
                                key={habit.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => toggleHabit(habit.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        toggleHabit(habit.id);
                                    }
                                }}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${habit.checked
                                    ? "bg-success/20 border border-success/40"
                                    : "bg-muted/30 border border-transparent hover:border-muted"
                                    }`}
                            >
                                <Checkbox checked={habit.checked} />
                                <span className="text-sm font-medium">{habit.label}</span>
                            </div>
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

                {/* Counters */}
                <div className="glass-card p-4 space-y-4">
                    <h2 className="font-semibold">Counters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Masturbation Counter
                            </h3>
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

                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Vratham Counter
                            </h3>
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => setVrathamCount(Math.max(0, vrathamCount - 1))}
                                    className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <motion.span
                                    key={vrathamCount}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="text-4xl font-bold w-16 text-center"
                                >
                                    {vrathamCount}
                                </motion.span>
                                <button
                                    onClick={() => setVrathamCount(vrathamCount + 1)}
                                    className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Day Spends */}
                <div className="glass-card p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold">Day Spends</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addDaySpendRow}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Row
                        </Button>
                    </div>

                    <div className="border border-glass-border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-[2fr,1fr,auto] bg-muted/40 text-xs font-medium text-muted-foreground px-3 py-2">
                            <span>Expense</span>
                            <span className="text-right">Amount (₹)</span>
                            <span></span>
                        </div>
                        <div className="divide-y divide-glass-border">
                            {daySpends.map((item, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-[2fr,1fr,auto] gap-2 px-3 py-2 items-center"
                                >
                                    <Input
                                        placeholder="Expense detail"
                                        value={item.label}
                                        onChange={(e) =>
                                            handleDaySpendChange(index, "label", e.target.value)
                                        }
                                        className="input-dark h-8 text-sm"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={item.amount}
                                        onChange={(e) =>
                                            handleDaySpendChange(index, "amount", e.target.value)
                                        }
                                        className="input-dark h-8 text-sm text-right"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeDaySpendRow(index)}
                                        className="p-1 rounded-full hover:bg-muted transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 bg-muted/30 text-sm font-medium">
                            <span>Total</span>
                            <span>₹ {getTotalDaySpends().toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* What did you eat? */}
                <div className="glass-card p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold">What did you eat?</h2>
                    </div>
                    <Textarea
                        value={whatDidYouEat}
                        onChange={(e) => setWhatDidYouEat(e.target.value)}
                        placeholder="List what you ate today or write a short paragraph...&#10;&#10;Example:&#10;- Breakfast: Toast with eggs&#10;- Lunch: Rice with dal and vegetables&#10;- Dinner: Pasta with tomato sauce&#10;&#10;Or write a paragraph describing your meals."
                        className="input-dark min-h-[120px] resize-none font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                        You can write a list (one item per line) or a short paragraph describing your meals.
                    </p>
                </div>

                {/* Media Upload */}
                <div className="glass-card p-4 space-y-4">
                    <h2 className="font-semibold">Media</h2>
                    
                    {/* Photo Upload */}
                    <div className="space-y-2">
                        <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-glass-border hover:border-primary/50 transition-colors cursor-pointer">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Add Photos</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                        {photos.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {photos.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={url}
                                            alt={`Photo ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-1 right-1 p-1 bg-destructive/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Minus className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Video Upload */}
                    <div className="space-y-2">
                        <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-glass-border hover:border-primary/50 transition-colors cursor-pointer">
                            <Video className="w-8 h-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Add Videos (Max 50MB)</span>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                        {videos.length > 0 && (
                            <div className="space-y-2 mt-2">
                                {videos.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <video
                                            src={url}
                                            controls
                                            className="w-full rounded-lg"
                                        />
                                        <button
                                            onClick={() => removeVideo(index)}
                                            className="absolute top-1 right-1 p-1 bg-destructive/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Minus className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
}
