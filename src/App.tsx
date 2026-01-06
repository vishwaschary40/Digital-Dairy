/*
"use client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom"; // REMOVED
import Index from "./pages/Index";
import CalendarPage from "./pages/Calendar";
import DailyLog from "./pages/DailyLog";
import GoalsPage from "./pages/Goals";
import ProfilePage from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      // BrowserRouter removed
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
*/

// Export a dummy component to avoid build errors if this file is imported somewhere
const App = () => {
  return null;
}
export default App;
