"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Search, Filter } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { DailySummaryCard } from "@/components/daily/daily-summary-card";
import { useData } from "@/hooks/use-data";
import { useAuth } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { DailyLogData } from "@/hooks/use-data";

export default function SummariesPage() {
    const { user } = useAuth();
    const { logs, loading } = useData();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredLogs, setFilteredLogs] = useState<DailyLogData[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredLogs(logs);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = logs.filter((log) => {
                const dateStr = format(new Date(log.date), "MMMM d, yyyy").toLowerCase();
                const notes = (log.notes || "").toLowerCase();
                const whatDidYouEat = (log.whatDidYouEat || "").toLowerCase();
                return (
                    dateStr.includes(query) ||
                    notes.includes(query) ||
                    whatDidYouEat.includes(query)
                );
            });
            setFilteredLogs(filtered);
        }
    }, [searchQuery, logs]);

    if (loading || !user) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Daily Summaries">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-primary" />
                            Daily Summaries
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            View all your logged days ({logs.length} total)
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="glass-card p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by date, notes, or meals..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-dark pl-10"
                        />
                    </div>
                </div>

                {/* Summaries Grid */}
                {filteredLogs.length > 0 ? (
                    <div className="space-y-6">
                        {filteredLogs.map((log) => {
                            const dateStr = log.date;
                            const dateParts = dateStr.split("-");
                            const dateForUrl = `${dateParts[1]}-${dateParts[2]}`;

                            return (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <DailySummaryCard
                                        log={log}
                                        onEdit={() => router.push(`/2026/${dateForUrl}`)}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center text-muted-foreground space-y-4">
                        {searchQuery ? (
                            <>
                                <Search className="w-12 h-12 mx-auto opacity-50" />
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                                    <p className="text-sm">
                                        Try searching with different keywords or dates.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Calendar className="w-12 h-12 mx-auto opacity-50" />
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">No days logged yet</h3>
                                    <p className="text-sm mb-4">
                                        Start logging your days to see summaries here.
                                    </p>
                                    <button
                                        onClick={() => router.push("/")}
                                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
                                    >
                                        Go to Calendar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </motion.div>
        </PageLayout>
    );
}

