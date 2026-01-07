import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { getCollection } from "@/lib/firebase/db";
import { where, orderBy } from "firebase/firestore";

export interface DailyLogData {
    id: string; // date string YYYY-MM-DD
    date: string;
    notes?: string;
    mood?: number;
    habits?: { 
        gym?: boolean;
        meditation?: boolean;
        study?: number; // hours
        reading?: number; // minutes
        [key: string]: boolean | number | undefined;
    };
    masturbation_count?: number;
    masturbationCount?: number; // Support both naming conventions
    vratham_count?: number;
    vrathamCount?: number; // Support both naming conventions
    sleepTime?: string;
    wakeTime?: string;
    studyHours?: number;
    readingMinutes?: number;
    photos?: string[];
    videos?: string[];
    daySpends?: {
        label: string;
        amount: number;
    }[];
    totalDaySpends?: number;
    whatDidYouEat?: string;
    createdAt?: string;
    updatedAt?: string;
}

export function useData() {
    const { user, loading: authLoading } = useAuth();
    const [logs, setLogs] = useState<DailyLogData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchLogs = async () => {
        if (!user) {
            setLogs([]);
            setLoading(false);
            return;
        }

        try {
            // Logs are stored in a subcollection: users/{uid}/logs
            // The getCollection helper in db.ts accesses root collections.
            // We might need to adjust db.ts or just use the SDK directly here 
            // if db.ts is too rigid. 
            // Ideally, we should update db.ts to support subcollections better if needed,
            // but for now let's see if we can construct the path.

            // Wait, db.ts getCollection takes a collectionName. 
            // Firestore allows "users/uid/logs" as a collection path string.

            const logsData = await getCollection(`users/${user.uid}/logs`);

            // Sort by date desc
            const sortedLogs = (logsData as DailyLogData[]).sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            setLogs(sortedLogs);
        } catch (err) {
            console.error("Error fetching logs:", err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            fetchLogs();
        }
    }, [user, authLoading]);

    // Derived stats helpers
    const getLoggedDaysCount = () => logs.length;

    const getAverageMood = (days = 7) => {
        if (logs.length === 0) return 0;
        const recentLogs = logs.slice(0, days);
        const sum = recentLogs.reduce((acc, log) => acc + (log.mood || 0), 0);
        return Number((sum / recentLogs.length).toFixed(1));
    };

    const getGymStreak = () => {
        if (logs.length === 0) return 0;
        
        // Sort logs by date (newest first)
        const sorted = [...logs].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Calculate consecutive days streak
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < sorted.length; i++) {
            const logDate = new Date(sorted[i].date);
            logDate.setHours(0, 0, 0, 0);
            
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - streak);
            
            if (logDate.getTime() === expectedDate.getTime() && sorted[i].habits?.gym) {
                streak++;
            } else if (streak === 0 && logDate.getTime() === today.getTime() && sorted[i].habits?.gym) {
                streak = 1;
            } else {
                break;
            }
        }
        
        return streak;
    };

    const getTotalGymSessions = () => {
        return logs.filter(l => l.habits?.gym).length;
    };

    return {
        logs,
        loading,
        error,
        refresh: fetchLogs,
        stats: {
            loggedDays: getLoggedDaysCount(),
            avgMood: getAverageMood(),
            gymStreak: getGymStreak(),
            gymSessions: getTotalGymSessions(),
            totalMasturbationCount: logs.reduce((acc, log) => acc + (log.masturbation_count || log.masturbationCount || 0), 0),
            totalVrathamCount: logs.reduce((acc, log) => acc + (log.vratham_count || log.vrathamCount || 0), 0),
            totalReadingHours: logs.reduce((acc, log) => {
                const reading = log.readingMinutes || (log.habits?.reading as number) || 0;
                return acc + (reading / 60);
            }, 0),
            latestDailySpends: logs.length > 0 ? (logs[0].totalDaySpends || 0) : 0,
            totalDailySpends: logs.reduce((acc, log) => acc + (Number(log.totalDaySpends) || 0), 0),
        }
    };
}
