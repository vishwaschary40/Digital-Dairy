"use client";

import { motion } from "framer-motion";
import {
    Activity,
    Heart,
    TrendingUp,
    PiggyBank,
    BookOpen,
    Dumbbell,
    Brain,
    Flame,
    Bookmark,
    Calendar
} from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { StatCard } from "@/components/ui/stat-card";
import { GoalCard } from "@/components/ui/goal-card";
import { RememberedItemCard } from "@/components/ui/remembered-item-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { LineChartComponent } from "@/components/charts/line-chart";
import { BarChartComponent } from "@/components/charts/bar-chart";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { useData } from "@/hooks/use-data";
import { useGoals } from "@/hooks/use-goals";
import { useRemembered } from "@/hooks/use-remembered";
import { useAuth } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format, parse } from "date-fns";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function Home() {
    const { user } = useAuth();
    const { logs, loading, stats } = useData();
    const { goals, shortTermGoals, longTermGoals, goalsNearingDeadline, loading: goalsLoading } = useGoals();
    const { items: rememberedItems, loading: rememberedLoading } = useRemembered();
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

    // Chart Data Preparation
    const moodData = logs.slice(0, 30).reverse().map(log => ({
        name: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: log.mood || 0
    }));

    const gymData = logs.slice(0, 30).reverse().map(log => ({
        name: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: log.habits?.gym ? 1 : 0
    }));

    const masturbationData = logs.slice(0, 30).reverse().map(log => ({
        name: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: log.masturbation_count || log.masturbationCount || 0
    }));

    const productivityData = logs.slice(0, 30).reverse().map(log => {
        const study = log.studyHours || (log.habits?.study as number) || 0;
        const reading = (log.readingMinutes || (log.habits?.reading as number) || 0) / 60;
        return {
            name: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: study + reading
        };
    });

    const loggedDates = logs.map(l => l.date);

    return (
        <PageLayout>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                {/* Hero Section */}
                <motion.section variants={itemVariants} className="text-center py-6">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Ela Unnav <span className="gradient-text">{user?.displayName || "Explorer"}</span> ?
                    </h1>
                    <p className="text-muted-foreground">
                        Track your journey Everyday
                    </p>
                </motion.section>

                {/* Quick Stats */}
                <motion.section variants={itemVariants}>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Today's Overview
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
                        <StatCard
                            title="Gym Streak"
                            value={`${stats.gymStreak} days`}
                            icon={Dumbbell}
                            variant="success"
                        />
                        <StatCard
                            title="Total Spends"
                            value={`₹${stats.totalDailySpends.toLocaleString()}`}
                            icon={PiggyBank}
                            variant="primary"
                        />
                        <StatCard
                            title="Vratham Days"
                            value={`${stats.totalVrathamCount}`}
                            icon={Flame}
                            variant="default"
                        />
                        <StatCard
                            title="Reading"
                            value={`${stats.totalReadingHours.toFixed(1)} hrs`}
                            icon={BookOpen}
                            variant="default"
                        />
                    </div>
                    {/* Quick Access Button */}
                    {/* <div className="flex justify-center">
                        <a
                            href="/remembered"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Bookmark className="w-5 h-5" />
                            <span>To Be Remembered</span>
                        </a>
                    </div> */}
                </motion.section>

                {/* Progress Ring & Quick Actions */}
                <motion.section variants={itemVariants} className="grid md:grid-cols-3 gap-4">
                    <div className="glass-card p-6 flex flex-col items-center justify-center">
                        <p className="text-sm text-muted-foreground mb-4">Year Progress</p>
                        <ProgressRing progress={(stats.loggedDays / 365) * 100} size={140}>
                            <div className="text-center">
                                <span className="text-2xl font-bold">{stats.loggedDays}</span>
                                <span className="text-sm text-muted-foreground block">days logged</span>
                            </div>
                        </ProgressRing>
                        <p className="text-sm text-muted-foreground mt-4">{365 - stats.loggedDays} days remaining</p>
                    </div>

                    <div className="glass-card p-6 md:col-span-2">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                            <Flame className="w-4 h-4 text-warning" />
                            Counters & Trackers
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/30 rounded-lg p-4 text-center">
                                <Brain className="w-6 h-6 mx-auto mb-2 text-warning" />
                                <p className="text-2xl font-bold">{stats.totalMasturbationCount}</p>
                                <p className="text-xs text-muted-foreground">Total Masturbation Count</p>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-4 text-center">
                                <Heart className="w-6 h-6 mx-auto mb-2 text-destructive" />
                                <p className="text-2xl font-bold">{stats.avgMood}</p>
                                <p className="text-xs text-muted-foreground">Avg Mood (7 days)</p>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-4 text-center">
                                <Dumbbell className="w-6 h-6 mx-auto mb-2 text-success" />
                                <p className="text-2xl font-bold">{stats.gymSessions}</p>
                                <p className="text-xs text-muted-foreground">Total Gym Sessions</p>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-4 text-center">
                                <BookOpen className="w-6 h-6 mx-auto mb-2 text-info" />
                                <p className="text-2xl font-bold">{stats.totalReadingHours.toFixed(1)}</p>
                                <p className="text-xs text-muted-foreground">Total Reading (Hrs)</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Charts Grid */}
                <motion.section variants={itemVariants}>
                    <h2 className="text-lg font-semibold mb-4">Analytics</h2>
                    {logs.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                            <LineChartComponent
                                data={moodData}
                                title="Mood Trend (Last 30 Days)"
                                color="info"
                            />
                            <LineChartComponent
                                data={productivityData}
                                title="Productivity (Study + Reading Hours)"
                                color="warning"
                            />
                            <LineChartComponent
                                data={masturbationData}
                                title="Masturbation Counter Trend"
                                color="warning"
                            />
                            <BarChartComponent
                                data={gymData}
                                title="Gym Sessions (Last 30 Days)"
                                color="success"
                            />
                        </div>
                    ) : (
                        <div className="glass-card p-8 text-center text-muted-foreground">
                            <p>No data available yet. Start logging your days to see analytics!</p>
                        </div>
                    )}
                </motion.section>

                {/* Goals Section */}
                <motion.section variants={itemVariants}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <span>🎯</span> Active Goals
                        </h2>
                        <a
                            href="/goals"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Manage goals
                        </a>
                    </div>
                    {!goalsLoading && goals.length > 0 ? (
                        <div className="space-y-4">
                            {goalsNearingDeadline.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-warning mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                                        Nearing Deadline
                                    </h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                        {goalsNearingDeadline.slice(0, 3).map((goal) => (
                                            <GoalCard key={goal.id} {...goal} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Short-term Goals</h3>
                                    <div className="space-y-2">
                                        {shortTermGoals.slice(0, 2).map((goal) => (
                                            <GoalCard key={goal.id} {...goal} />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Long-term Goals</h3>
                                    <div className="space-y-2">
                                        {longTermGoals.slice(0, 2).map((goal) => (
                                            <GoalCard key={goal.id} {...goal} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-8 text-center text-muted-foreground space-y-3">
                            <p>No goals yet. Create one to get started!</p>
                            <a
                                href="/goals"
                                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
                            >
                                Add your first goal
                            </a>
                        </div>
                    )}
                </motion.section>

                {/* To Be Remembered Section */}
                <motion.section variants={itemVariants}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Bookmark className="w-5 h-5 text-primary" />
                            To Be Remembered
                        </h2>
                        <a
                            href="/remembered"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Manage items
                        </a>
                    </div>
                    {!rememberedLoading && rememberedItems.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {rememberedItems.slice(0, 6).map((item) => (
                                <RememberedItemCard key={item.id} {...item} />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-8 text-center text-muted-foreground space-y-3">
                            <Bookmark className="w-8 h-8 mx-auto opacity-50" />
                            <p>No items yet. Start adding important information!</p>
                            <a
                                href="/remembered"
                                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
                            >
                                <Bookmark className="w-4 h-4 mr-2" />
                                Add your first item
                            </a>
                        </div>
                    )}
                </motion.section>

                {/* Daily Summaries Button */}
                <motion.section variants={itemVariants}>
                    <div className="glass-card p-6 text-center">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-primary opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">View All Daily Summaries</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            See all your logged days in one place
                        </p>
                        <a
                            href="/summaries"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Calendar className="w-5 h-5" />
                            <span>View Summaries ({logs.length})</span>
                        </a>
                    </div>
                </motion.section>

                {/* Mini Calendar */}
                <motion.section variants={itemVariants}>
                    <h2 className="text-lg font-semibold mb-4">Calendar View</h2>
                    <CalendarGrid loggedDates={loggedDates} logs={logs} />
                </motion.section>
            </motion.div>
        </PageLayout>
    );
}
