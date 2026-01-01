import { ReactNode } from "react";
import { Header } from "./header";
import { BottomNav } from "./bottom-nav";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header title={title} />
      <main className="container px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
