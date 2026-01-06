import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { getCollection, addDocument, updateDocument, deleteDocument } from "@/lib/firebase/db";
import { orderBy } from "firebase/firestore";

export interface Goal {
    id: string;
    type: "short" | "long";
    title: string;
    description: string;
    progress: number;
    deadline: string; // ISO date string
    createdAt?: string;
    updatedAt?: string;
}

export function useGoals() {
    const { user, loading: authLoading } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchGoals = async () => {
        if (!user) {
            setGoals([]);
            setLoading(false);
            return;
        }

        try {
            const goalsData = await getCollection(`users/${user.uid}/goals`, [
                orderBy("deadline", "asc")
            ]);
            setGoals(goalsData as Goal[]);
        } catch (err) {
            console.error("Error fetching goals:", err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            fetchGoals();
        }
    }, [user, authLoading]);

    const addGoal = async (goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => {
        if (!user) throw new Error("User not authenticated");

        const newGoal: Goal = {
            ...goal,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        try {
            await addDocument(`users/${user.uid}/goals`, newGoal.id, newGoal);
            await fetchGoals();
            return newGoal;
        } catch (err) {
            console.error("Error adding goal:", err);
            throw err;
        }
    };

    const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
        if (!user) throw new Error("User not authenticated");

        try {
            await updateDocument(`users/${user.uid}/goals`, goalId, {
                ...updates,
                updatedAt: new Date().toISOString(),
            });
            await fetchGoals();
        } catch (err) {
            console.error("Error updating goal:", err);
            throw err;
        }
    };

    const deleteGoal = async (goalId: string) => {
        if (!user) throw new Error("User not authenticated");

        try {
            await deleteDocument(`users/${user.uid}/goals`, goalId);
            await fetchGoals();
        } catch (err) {
            console.error("Error deleting goal:", err);
            throw err;
        }
    };

    const shortTermGoals = goals.filter((g) => g.type === "short");
    const longTermGoals = goals.filter((g) => g.type === "long");
    const goalsNearingDeadline = goals.filter((goal) => {
        const deadline = new Date(goal.deadline);
        const today = new Date();
        const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDeadline <= 7 && daysUntilDeadline > 0 && goal.progress < 100;
    });

    return {
        goals,
        shortTermGoals,
        longTermGoals,
        goalsNearingDeadline,
        loading,
        error,
        refresh: fetchGoals,
        addGoal,
        updateGoal,
        deleteGoal,
    };
}

