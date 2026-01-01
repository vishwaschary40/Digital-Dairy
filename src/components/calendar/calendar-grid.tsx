import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

interface CalendarGridProps {
  loggedDates?: string[];
  year?: number;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({ loggedDates = [], year = 2026 }: CalendarGridProps) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(year, 0, 1));

  const loggedDatesSet = useMemo(() => new Set(loggedDates), [loggedDates]);

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

  const handleDayClick = (date: Date) => {
    if (isFuture(date)) return;
    const dateStr = format(date, "MM-dd");
    navigate(`/2026/${dateStr}`);
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
    </motion.div>
  );
}
