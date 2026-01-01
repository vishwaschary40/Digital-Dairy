import { motion } from "framer-motion";
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  PiggyBank, 
  BookOpen, 
  Dumbbell,
  Brain,
  Flame
} from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { StatCard } from "@/components/ui/stat-card";
import { GoalCard } from "@/components/ui/goal-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { LineChartComponent } from "@/components/charts/line-chart";
import { BarChartComponent } from "@/components/charts/bar-chart";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { addDays } from "date-fns";

// Mock data - will be replaced with Firebase data
const mockMoodData = [
  { name: "Mon", value: 7 },
  { name: "Tue", value: 8 },
  { name: "Wed", value: 6 },
  { name: "Thu", value: 9 },
  { name: "Fri", value: 7 },
  { name: "Sat", value: 8 },
  { name: "Sun", value: 9 },
];

const mockGymData = [
  { name: "W1", value: 5 },
  { name: "W2", value: 4 },
  { name: "W3", value: 6 },
  { name: "W4", value: 5 },
];

const mockInvestmentData = [
  { name: "Jan", value: 100000 },
  { name: "Feb", value: 105000 },
  { name: "Mar", value: 112000 },
  { name: "Apr", value: 108000 },
  { name: "May", value: 120000 },
  { name: "Jun", value: 135000 },
];

const mockProductivityData = [
  { name: "Mon", value: 85 },
  { name: "Tue", value: 72 },
  { name: "Wed", value: 90 },
  { name: "Thu", value: 88 },
  { name: "Fri", value: 75 },
  { name: "Sat", value: 60 },
  { name: "Sun", value: 45 },
];

const mockGoals = [
  {
    title: "Complete React Course",
    description: "Finish the advanced React patterns course on Udemy",
    progress: 75,
    deadline: addDays(new Date(), 14),
    type: "short" as const,
  },
  {
    title: "Save ₹5 Lakhs",
    description: "Reach savings goal for emergency fund",
    progress: 60,
    deadline: addDays(new Date(), 90),
    type: "long" as const,
  },
  {
    title: "Read 24 Books",
    description: "Read 2 books per month throughout 2026",
    progress: 25,
    deadline: new Date(2026, 11, 31),
    type: "long" as const,
  },
];

const mockLoggedDates = [
  "2026-01-01",
  "2026-01-02",
  "2026-01-03",
  "2026-01-05",
  "2026-01-06",
];

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

const Index = () => {
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
            Good Morning, <span className="gradient-text">Explorer</span>
          </h1>
          <p className="text-muted-foreground">
            Track your journey through 2026
          </p>
        </motion.section>

        {/* Quick Stats */}
        <motion.section variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Today's Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              title="Gym Streak"
              value="12 days"
              icon={Dumbbell}
              variant="success"
              trend={{ value: 20, isPositive: true }}
            />
            <StatCard
              title="Portfolio"
              value="₹1.35L"
              icon={TrendingUp}
              variant="primary"
              trend={{ value: 8.5, isPositive: true }}
            />
            <StatCard
              title="Savings"
              value="₹45K"
              icon={PiggyBank}
              variant="default"
            />
            <StatCard
              title="Reading"
              value="24 hrs"
              icon={BookOpen}
              variant="default"
            />
          </div>
        </motion.section>

        {/* Progress Ring & Quick Actions */}
        <motion.section variants={itemVariants} className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground mb-4">Year Progress</p>
            <ProgressRing progress={8.2} size={140}>
              <div className="text-center">
                <span className="text-2xl font-bold">30</span>
                <span className="text-sm text-muted-foreground block">days</span>
              </div>
            </ProgressRing>
            <p className="text-sm text-muted-foreground mt-4">335 days remaining</p>
          </div>

          <div className="glass-card p-6 md:col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-warning" />
              Counters & Trackers
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <Brain className="w-6 h-6 mx-auto mb-2 text-warning" />
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Masturbation Count</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <Heart className="w-6 h-6 mx-auto mb-2 text-destructive" />
                <p className="text-2xl font-bold">8.5</p>
                <p className="text-xs text-muted-foreground">Avg Mood (7 days)</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <Dumbbell className="w-6 h-6 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold">22</p>
                <p className="text-xs text-muted-foreground">Gym Sessions</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <BookOpen className="w-6 h-6 mx-auto mb-2 text-info" />
                <p className="text-2xl font-bold">6</p>
                <p className="text-xs text-muted-foreground">Books Read</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Charts Grid */}
        <motion.section variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-4">Analytics</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <LineChartComponent
              data={mockMoodData}
              title="Mood Trend (Last 7 Days)"
              color="info"
            />
            <BarChartComponent
              data={mockGymData}
              title="Gym Sessions (Last 4 Weeks)"
              color="success"
            />
            <LineChartComponent
              data={mockInvestmentData}
              title="Investment Growth (2026)"
              color="primary"
            />
            <LineChartComponent
              data={mockProductivityData}
              title="Productivity Score"
              color="warning"
            />
          </div>
        </motion.section>

        {/* Goals Section */}
        <motion.section variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🎯</span> Active Goals
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {mockGoals.map((goal, index) => (
              <GoalCard key={index} {...goal} />
            ))}
          </div>
        </motion.section>

        {/* Mini Calendar */}
        <motion.section variants={itemVariants}>
          <h2 className="text-lg font-semibold mb-4">Calendar View</h2>
          <CalendarGrid loggedDates={mockLoggedDates} />
        </motion.section>
      </motion.div>
    </PageLayout>
  );
};

export default Index;
