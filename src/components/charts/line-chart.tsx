import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LineChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  color?: "primary" | "success" | "warning" | "info";
  className?: string;
}

const colorMap = {
  primary: "hsl(174, 72%, 56%)",
  success: "hsl(142, 71%, 45%)",
  warning: "hsl(38, 92%, 50%)",
  info: "hsl(199, 89%, 48%)",
};

export function LineChartComponent({
  data,
  title,
  color = "primary",
  className,
}: LineChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("glass-card p-4 md:p-6", className)}
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      <div className="h-48 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
            <XAxis
              dataKey="name"
              stroke="hsl(0, 0%, 50%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(0, 0%, 50%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 10%)",
                border: "1px solid hsl(0, 0%, 20%)",
                borderRadius: "8px",
                color: "hsl(0, 0%, 98%)",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colorMap[color]}
              strokeWidth={2}
              dot={{ fill: colorMap[color], strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: colorMap[color] }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
