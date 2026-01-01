import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/page-layout";
import { CalendarGrid } from "@/components/calendar/calendar-grid";

const mockLoggedDates = [
  "2026-01-01",
  "2026-01-02",
  "2026-01-03",
  "2026-01-05",
  "2026-01-06",
  "2026-01-08",
  "2026-01-10",
  "2026-01-12",
  "2026-01-15",
];

const CalendarPage = () => {
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

        <CalendarGrid loggedDates={mockLoggedDates} year={2026} />

        <div className="glass-card p-4">
          <h3 className="font-semibold mb-2">Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">9</p>
              <p className="text-xs text-muted-foreground">Days Logged</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">60%</p>
              <p className="text-xs text-muted-foreground">Completion</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">5</p>
              <p className="text-xs text-muted-foreground">Current Streak</p>
            </div>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default CalendarPage;
