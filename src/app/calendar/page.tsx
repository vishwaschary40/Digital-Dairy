"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/page-layout";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { useData } from "@/hooks/use-data";
import { useAuth } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CalendarPage() {
    const { user } = useAuth();
    const { logs, stats, loading } = useData();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </PageLayout>
        );
    }

    const loggedDates = logs.map(log => log.date);
    const completionRate = Math.round((stats.loggedDays / 365) * 100);

    return (
        <PageLayout title="Calendar">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="text-center py-4">
                    <h1 className="text-2xl font-bold">2026 Calendar</h1>
                    <p className="text-muted-foreground mt-1">
                        Click any date to view or add your daily log
                    </p>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-card border border-glass-border" />
                        <span className="text-muted-foreground">Empty</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-success/20 border border-success/40" />
                        <span className="text-muted-foreground">Logged</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-primary/20 border-2 border-primary" />
                        <span className="text-muted-foreground">Today</span>
                    </div>
                </div>

                <CalendarGrid loggedDates={loggedDates} logs={logs} year={2026} />

                <div className="glass-card p-4">
                    <h3 className="font-semibold mb-2">Stats</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-primary">{stats.loggedDays}</p>
                            <p className="text-xs text-muted-foreground">Days Logged</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-success">{completionRate}%</p>
                            <p className="text-xs text-muted-foreground">Completion</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-warning">{stats.gymStreak}</p>
                            <p className="text-xs text-muted-foreground">Gym Streak</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </PageLayout>
    );
}
