import { motion } from "framer-motion";
import { Download, Upload, LogOut, User, Shield, Database } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { toast } = useToast();

  const handleExport = () => {
    // Mock export functionality
    const mockData = {
      daily_logs: [],
      goals: [],
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(mockData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `life-dashboard-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Your data has been exported successfully.",
    });
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = JSON.parse(reader.result as string);
            console.log("Imported data:", data);
            toast({
              title: "Import Complete",
              description: "Your data has been imported successfully.",
            });
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Invalid JSON file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <PageLayout title="Profile">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-2xl mx-auto"
      >
        {/* Profile Header */}
        <div className="glass-card p-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">Explorer</h1>
          <p className="text-muted-foreground">explorer@example.com</p>
          <p className="text-sm text-primary mt-2">Premium Account</p>
        </div>

        {/* Stats Overview */}
        <div className="glass-card p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Data Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-2xl font-bold">30</p>
              <p className="text-sm text-muted-foreground">Days Logged</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-2xl font-bold">6</p>
              <p className="text-sm text-muted-foreground">Active Goals</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-2xl font-bold">48</p>
              <p className="text-sm text-muted-foreground">Photos Uploaded</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Videos Uploaded</p>
            </div>
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="glass-card p-4 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Backup & Restore
          </h2>
          <p className="text-sm text-muted-foreground">
            Export all your data as JSON or import from a previous backup.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full border-glass-border hover:bg-muted"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button
              onClick={handleImport}
              variant="outline"
              className="w-full border-glass-border hover:bg-muted"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="glass-card p-4 space-y-4">
          <h2 className="font-semibold">Account</h2>
          <Button
            variant="outline"
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Version Info */}
        <div className="text-center text-sm text-muted-foreground py-4">
          <p>Life Dashboard 2026</p>
          <p>Version 1.0.0</p>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default ProfilePage;
