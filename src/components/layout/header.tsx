import { motion } from "framer-motion";
import { Bell, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title = "Life Dashboard 2026" }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-glass-border"
    >
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">QS</span>
          </div>
          <h1 className="text-lg font-semibold hidden sm:block">{title}</h1>
        </Link>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
          <Link
            to="/profile"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
