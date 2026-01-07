"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isFuture,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import { DailySummaryCard } from "@/components/daily/daily-summary-card";
import { DailyLogData } from "@/hooks/use-data";
import { getDocument } from "@/lib/firebase/db";
import { useAuth } from "@/lib/firebase/auth";

interface CalendarGridProps {
  loggedDates?: string[];
  year?: number;
  logs?: DailyLogData[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({ loggedDates = [], year = 2026, logs = [] }: CalendarGridProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date(year, 0, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<DailyLogData | null>(null);
  const [loadingLog, setLoadingLog] = useState(false);

  const loggedDatesSet = useMemo(() => new Set(loggedDates), [loggedDates]);
  
  // Create a map of logs by date for quick lookup
  const logsByDate = useMemo(() => {
    const map = new Map<string, DailyLogData>();
    logs.forEach(log => {
      map.set(log.date, log);
    });
    return map;
  }, [logs]);

  const days = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start, end });

    // Add padding for the first week
    const firstDayOfWeek = getDay(start);
    const padding = Array(firstDayOfWeek).fill(null);

    return [...padding, ...daysInMonth];
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = async (date: Date) => {
    if (isFuture(date)) return;
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedDate(dateStr);
    
    // Check if we already have the log in memory
    const cachedLog = logsByDate.get(dateStr);
    if (cachedLog) {
      setSelectedLog(cachedLog);
      return;
    }

    // Fetch from Firebase if not in cache
    if (user) {
      setLoadingLog(true);
      try {
        const logData = await getDocument<DailyLogData>(`users/${user.uid}/logs`, dateStr);
        if (logData) {
          setSelectedLog(logData);
        } else {
          // No log exists, create empty one for display
          setSelectedLog({
            id: dateStr,
            date: dateStr,
          });
        }
      } catch (error) {
        console.error("Error fetching log:", error);
        setSelectedLog({
          id: dateStr,
          date: dateStr,
        });
      } finally {
        setLoadingLog(false);
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
    setSelectedLog(null);
  };

  const handleEdit = () => {
    if (!selectedDate) return;
    const dateParts = selectedDate.split("-");
    const dateForUrl = `${dateParts[1]}-${dateParts[2]}`;
    router.push(`/2026/${dateForUrl}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDate.toISOString()}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1"
        >
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateStr = format(day, "yyyy-MM-dd");
            const isLogged = loggedDatesSet.has(dateStr);
            const isTodayDate = isToday(day);
            const isFutureDate = isFuture(day);

            return (
              <motion.button
                key={dateStr}
                onClick={() => handleDayClick(day)}
                disabled={isFutureDate}
                whileHover={!isFutureDate ? { scale: 1.05 } : undefined}
                whileTap={!isFutureDate ? { scale: 0.95 } : undefined}
                className={cn(
                  isTodayDate && "calendar-day-today",
                  isLogged && !isTodayDate && "calendar-day-logged",
                  isFutureDate && "calendar-day-future",
                  !isTodayDate && !isLogged && !isFutureDate && "calendar-day-default"
                )}
              >
                <span className="text-sm">{format(day, "d")}</span>
                {isLogged && (
                  <div className="w-1.5 h-1.5 rounded-full bg-success mt-0.5" />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Modal for Daily Summary */}
      <AnimatePresence>
        {selectedDate && selectedLog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:max-w-5xl md:max-h-[90vh] z-50 overflow-y-auto"
            >
              {loadingLog ? (
                <div className="glass-card p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <DailySummaryCard
                  log={selectedLog}
                  onEdit={handleEdit}
                  onClose={handleCloseModal}
                  showCloseButton={true}
                />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
