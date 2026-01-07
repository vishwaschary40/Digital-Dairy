import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { getCollection, addDocument, updateDocument, deleteDocument } from "@/lib/firebase/db";
import { orderBy } from "firebase/firestore";

export interface RememberedItem {
    id: string;
    title: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}

export function useRemembered() {
    const { user, loading: authLoading } = useAuth();
    const [items, setItems] = useState<RememberedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchItems = async () => {
        if (!user) {
            setItems([]);
            setLoading(false);
            return;
        }

        try {
            const itemsData = await getCollection(`users/${user.uid}/remembered`, [
                orderBy("createdAt", "desc")
            ]);
            setItems(itemsData as RememberedItem[]);
        } catch (err) {
            console.error("Error fetching remembered items:", err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            fetchItems();
        }
    }, [user, authLoading]);

    const addItem = async (item: Omit<RememberedItem, "id" | "createdAt" | "updatedAt">) => {
        if (!user) throw new Error("User not authenticated");

        const newItem: RememberedItem = {
            ...item,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        try {
            await addDocument(`users/${user.uid}/remembered`, newItem.id, newItem);
            await fetchItems();
            return newItem;
        } catch (err) {
            console.error("Error adding remembered item:", err);
            throw err;
        }
    };

    const updateItem = async (itemId: string, updates: Partial<RememberedItem>) => {
        if (!user) throw new Error("User not authenticated");

        try {
            await updateDocument(`users/${user.uid}/remembered`, itemId, {
                ...updates,
                updatedAt: new Date().toISOString(),
            });
            await fetchItems();
        } catch (err) {
            console.error("Error updating remembered item:", err);
            throw err;
        }
    };

    const deleteItem = async (itemId: string) => {
        if (!user) throw new Error("User not authenticated");

        try {
            await deleteDocument(`users/${user.uid}/remembered`, itemId);
            await fetchItems();
        } catch (err) {
            console.error("Error deleting remembered item:", err);
            throw err;
        }
    };

    return {
        items,
        loading,
        error,
        refresh: fetchItems,
        addItem,
        updateItem,
        deleteItem,
    };
}

