import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, CalendarDays, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/calendar", icon: CalendarDays, label: "Calendar" },
  { path: "/goals", icon: Target, label: "Goals" },
  { path: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="bg-card/80 backdrop-blur-xl border-t border-glass-border">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  isActive ? "nav-item-active" : "nav-item-inactive"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-card/80" />
    </motion.nav>
  );
}
