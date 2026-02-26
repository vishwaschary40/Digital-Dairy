"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import {
    Smile,
    Clock,
    Dumbbell,
    BookOpen,
    Brain,
    Bookmark,
    Utensils,
    Image as ImageIcon,
    Video,
    Edit,
    X,
    TrendingUp,
    CheckCircle2,
} from "lucide-react";
import { DailyLogData } from "@/hooks/use-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DailySummaryCardProps {
    log: DailyLogData;
    onEdit?: () => void;
    onClose?: () => void;
    showCloseButton?: boolean;
}

const getMoodEmoji = (value?: number) => {
    if (!value) return "😐";
    if (value <= 2) return "😢";
    if (value <= 4) return "😕";
    if (value <= 6) return "😐";
    if (value <= 8) return "😊";
    return "😄";
};

const getMoodColor = (value?: number) => {
    if (!value) return "text-muted-foreground";
    if (value <= 2) return "text-destructive";
    if (value <= 4) return "text-warning";
    if (value <= 6) return "text-muted-foreground";
    if (value <= 8) return "text-info";
    return "text-success";
};

export function DailySummaryCard({
    log,
    onEdit,
    onClose,
    showCloseButton = false,
}: DailySummaryCardProps) {
    const formattedDate = format(new Date(log.date), "EEEE, MMMM d, yyyy");
    const mood = log.mood || 0;
    const masturbationCount = log.masturbation_count || log.masturbationCount || 0;
    const vrathamCount = log.vratham_count || log.vrathamCount || 0;
    const habits = log.habits || {};
    const daySpends = log.daySpends || [];
    const totalSpends = log.totalDaySpends || daySpends.reduce((sum, item) => sum + (item.amount || 0), 0);
    const photos = log.photos || [];
    const videos = log.videos || [];
    const dsaDone = log.dsaDone || false;
    const dsaNotes = log.dsaNotes || "";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 space-y-6 max-w-4xl mx-auto"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-glass-border pb-4">
                <div>
                    <h2 className="text-2xl font-bold">{formattedDate}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Daily Summary</p>
                </div>
                <div className="flex items-center gap-2">
                    {onEdit && (
                        <Button
                            onClick={onEdit}
                            size="sm"
                            className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    )}
                    {showCloseButton && onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Mood */}
                    {mood > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Smile className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold">Mood</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={cn("text-3xl", getMoodColor(mood))}>
                                    {getMoodEmoji(mood)}
                                </span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-muted-foreground">Rating</span>
                                        <span className={cn("font-bold", getMoodColor(mood))}>
                                            {mood}/10
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className={cn(
                                                "h-2 rounded-full transition-all",
                                                mood <= 2
                                                    ? "bg-destructive"
                                                    : mood <= 4
                                                    ? "bg-warning"
                                                    : mood <= 6
                                                    ? "bg-muted-foreground"
                                                    : mood <= 8
                                                    ? "bg-info"
                                                    : "bg-success"
                                            )}
                                            style={{ width: `${(mood / 10) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {log.notes && (
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Bookmark className="w-5 h-5 text-primary" />
                                Notes & Reflections
                            </h3>
                            <div className="glass-card p-4 rounded-lg bg-muted/20">
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {log.notes}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Habits */}
                    {(habits.gym || habits.meditation || habits.study || habits.reading) && (
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                Habits
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {habits.gym && (
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-success/10 border border-success/20">
                                        <Dumbbell className="w-4 h-4 text-success" />
                                        <span className="text-sm font-medium">Gym</span>
                                    </div>
                                )}
                                {habits.meditation && (
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-info/10 border border-info/20">
                                        <Brain className="w-4 h-4 text-info" />
                                        <span className="text-sm font-medium">Meditation</span>
                                    </div>
                                )}
                                {habits.study && (
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
                                        <BookOpen className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-medium">
                                            Study: {habits.study}h
                                        </span>
                                    </div>
                                )}
                                {habits.reading && (
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-warning/10 border border-warning/20">
                                        <BookOpen className="w-4 h-4 text-warning" />
                                        <span className="text-sm font-medium">
                                            Reading: {habits.reading}m
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Time Tracking */}
                    {(log.wakeTime || log.sleepTime || log.studyHours || log.readingMinutes) && (
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                Time Tracking
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {log.wakeTime && (
                                    <div className="p-3 rounded-lg bg-muted/30">
                                        <p className="text-xs text-muted-foreground mb-1">Wake Time</p>
                                        <p className="text-sm font-medium">{log.wakeTime}</p>
                                    </div>
                                )}
                                {log.sleepTime && (
                                    <div className="p-3 rounded-lg bg-muted/30">
                                        <p className="text-xs text-muted-foreground mb-1">Sleep Time</p>
                                        <p className="text-sm font-medium">{log.sleepTime}</p>
                                    </div>
                                )}
                                {log.studyHours && (
                                    <div className="p-3 rounded-lg bg-muted/30">
                                        <p className="text-xs text-muted-foreground mb-1">Study Hours</p>
                                        <p className="text-sm font-medium">{log.studyHours}h</p>
                                    </div>
                                )}
                                {log.readingMinutes && (
                                    <div className="p-3 rounded-lg bg-muted/30">
                                        <p className="text-xs text-muted-foreground mb-1">Reading</p>
                                        <p className="text-sm font-medium">{log.readingMinutes}m</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* What Did You Eat */}
                    {log.whatDidYouEat && (
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Utensils className="w-5 h-5 text-primary" />
                                What Did You Eat?
                            </h3>
                            <div className="glass-card p-4 rounded-lg bg-muted/20">
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {log.whatDidYouEat}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Counters */}
                    {(masturbationCount > 0 || vrathamCount > 0) && (
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Brain className="w-5 h-5 text-primary" />
                                Counters
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {masturbationCount > 0 && (
                                    <div className="p-4 rounded-lg bg-muted/30 text-center">
                                        <p className="text-2xl font-bold">{masturbationCount}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Masturbation
                                        </p>
                                    </div>
                                )}
                                {vrathamCount > 0 && (
                                    <div className="p-4 rounded-lg bg-muted/30 text-center">
                                        <p className="text-2xl font-bold">{vrathamCount}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Vratham</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* DSA & Coding Practice */}
                    {(dsaDone || dsaNotes) && (
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                DSA & Coding Practice
                            </h3>
                            {dsaDone && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
                                    <CheckCircle2 className="w-4 h-4 text-success" />
                                    <span className="text-sm font-medium">Done DSA today ✓</span>
                                </div>
                            )}
                            {dsaNotes && (
                                <div className="glass-card p-4 rounded-lg bg-muted/20">
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                        {dsaNotes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Day Spends */}
                    {daySpends.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Day Spends
                            </h3>
                            <div className="space-y-2">
                                <div className="border border-glass-border rounded-lg overflow-hidden">
                                    <div className="divide-y divide-glass-border">
                                        {daySpends.map((item, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-[2fr,1fr] gap-2 px-3 py-2 bg-muted/10"
                                            >
                                                <span className="text-sm">{item.label || "—"}</span>
                                                <span className="text-sm font-medium text-right">
                                                    ₹{item.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-t border-glass-border">
                                        <span className="text-sm font-semibold">Total</span>
                                        <span className="text-sm font-bold">
                                            ₹{totalSpends.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Media */}
                    {(photos.length > 0 || videos.length > 0) && (
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                {photos.length > 0 && <ImageIcon className="w-5 h-5 text-primary" />}
                                {videos.length > 0 && <Video className="w-5 h-5 text-primary" />}
                                Media
                            </h3>
                            {photos.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">Photos ({photos.length})</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {photos.map((url, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square rounded-lg overflow-hidden group"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Photo ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                                                >
                                                    <ImageIcon className="w-6 h-6 text-white" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {videos.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">Videos ({videos.length})</p>
                                    <div className="space-y-2">
                                        {videos.map((url, index) => (
                                            <div
                                                key={index}
                                                className="rounded-lg overflow-hidden bg-muted/20"
                                            >
                                                <video
                                                    src={url}
                                                    controls
                                                    className="w-full rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Empty State */}
            {!log.notes &&
                mood === 0 &&
                !habits.gym &&
                !habits.meditation &&
                !habits.study &&
                !habits.reading &&
                !log.wakeTime &&
                !log.sleepTime &&
                !log.studyHours &&
                !log.readingMinutes &&
                masturbationCount === 0 &&
                vrathamCount === 0 &&
                daySpends.length === 0 &&
                !log.whatDidYouEat &&
                photos.length === 0 &&
                videos.length === 0 &&
                !dsaDone &&
                !dsaNotes && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="text-lg mb-2">No data logged for this day.</p>
                        <p className="text-sm mb-4">Start logging to track your daily activities!</p>
                        {onEdit && (
                            <Button
                                onClick={onEdit}
                                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Start Logging
                            </Button>
                        )}
                    </div>
                )}
        </motion.div>
    );
}

