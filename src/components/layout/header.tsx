"use client";

import { motion } from "framer-motion";
import { Bell, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth, signOut } from "@/lib/firebase/auth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title = "Nenu Na picchi" }: HeaderProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-glass-border"
    >
      <div className="container flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center gap-2">
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
            href="/profile"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </Link>
          {user && (
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
