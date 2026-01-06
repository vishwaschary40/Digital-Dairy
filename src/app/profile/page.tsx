"use client";

import { motion } from "framer-motion";
import { Download, Upload, LogOut, User, Shield, Database } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth, signOut } from "@/lib/firebase/auth";
import { useData } from "@/hooks/use-data";
import { useGoals } from "@/hooks/use-goals";
import { useRouter } from "next/navigation";
import { addDocument } from "@/lib/firebase/db";

export default function ProfilePage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const { logs, stats } = useData();
    const { goals, refresh: refreshGoals } = useGoals();
    const router = useRouter();

    const handleExport = () => {
        const exportData = {
            daily_logs: logs,
            goals: goals,
            exported_at: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
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

    const handleImport = async () => {
        if (!user) {
            toast({
                title: "Error",
                description: "You must be logged in to import data.",
                variant: "destructive",
            });
            return;
        }

        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async () => {
                    try {
                        const data = JSON.parse(reader.result as string);
                        
                        // Import daily logs
                        if (data.daily_logs && Array.isArray(data.daily_logs)) {
                            let importedLogs = 0;
                            for (const log of data.daily_logs) {
                                try {
                                    await addDocument(`users/${user.uid}/logs`, log.id || log.date, log);
                                    importedLogs++;
                                } catch (err) {
                                    console.error("Error importing log:", err);
                                }
                            }
                            toast({
                                title: "Import Progress",
                                description: `Imported ${importedLogs} daily log(s).`,
                            });
                        }

                        // Import goals
                        if (data.goals && Array.isArray(data.goals)) {
                            let importedGoals = 0;
                            for (const goal of data.goals) {
                                try {
                                    await addDocument(`users/${user.uid}/goals`, goal.id, goal);
                                    importedGoals++;
                                } catch (err) {
                                    console.error("Error importing goal:", err);
                                }
                            }
                            if (importedGoals > 0) {
                                await refreshGoals();
                            }
                            toast({
                                title: "Import Complete",
                                description: `Imported ${importedGoals} goal(s).`,
                            });
                        }

                        toast({
                            title: "Import Complete",
                            description: "Your data has been imported successfully.",
                        });
                    } catch (error) {
                        console.error("Import error:", error);
                        toast({
                            title: "Import Failed",
                            description: "Invalid JSON file format or import error.",
                            variant: "destructive",
                        });
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push("/"); // Redirect to home/login
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    // Derived stats for profile
    const totalPhotos = 0; // Placeholder until media logic is added
    const totalVideos = 0; // Placeholder

    return (
        <PageLayout title="Profile">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-2xl mx-auto"
            >
                {/* Profile Header */}
                <div className="glass-card p-6 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4 overflow-hidden">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-primary-foreground" />
                        )}
                    </div>
                    <h1 className="text-xl font-bold">{user?.displayName || "Explorer"}</h1>
                    <p className="text-muted-foreground">{user?.email || "No Email"}</p>
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
                            <p className="text-2xl font-bold">{stats.loggedDays}</p>
                            <p className="text-sm text-muted-foreground">Days Logged</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4">
                            <p className="text-2xl font-bold">{goals.length}</p>
                            <p className="text-sm text-muted-foreground">Active Goals</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4">
                            <p className="text-2xl font-bold">{totalPhotos}</p>
                            <p className="text-sm text-muted-foreground">Photos Uploaded</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4">
                            <p className="text-2xl font-bold">{totalVideos}</p>
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
                        onClick={handleSignOut}
                        variant="outline"
                        className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>

                {/* Version Info */}
                <div className="text-center text-sm text-muted-foreground py-4">
                    <p>Nenu Na picchi </p>
                    <p>Version 1.0.0</p>
                </div>
            </motion.div>
        </PageLayout>
    );
}
