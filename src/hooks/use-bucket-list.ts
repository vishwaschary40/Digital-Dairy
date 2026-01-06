import { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { getCollection, addDocument, updateDocument, deleteDocument } from "@/lib/firebase/db";

export interface BucketItem {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  completedAt?: string | null;
}

export function useBucketList() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<BucketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const data = await getCollection(`users/${user.uid}/bucketList`);
      const sorted = (data as BucketItem[]).sort((a, b) => {
        // Completed items pinned to bottom
        if (a.completedAt && !b.completedAt) return 1;
        if (!a.completedAt && b.completedAt) return -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setItems(sorted);
    } catch (err) {
      console.error("Error fetching bucket list:", err);
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

  const addItem = async (input: { title: string; description?: string }) => {
    if (!user) throw new Error("User not authenticated");

    const now = new Date().toISOString();
    const id = Date.now().toString();
    const item: BucketItem = {
      id,
      title: input.title,
      description: input.description,
      createdAt: now,
      completedAt: null,
    };

    await addDocument(`users/${user.uid}/bucketList`, id, item);
    await fetchItems();
    return item;
  };

  const toggleComplete = async (id: string) => {
    if (!user) throw new Error("User not authenticated");
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const completedAt = item.completedAt ? null : new Date().toISOString();
    await updateDocument(`users/${user.uid}/bucketList`, id, { completedAt });
    await fetchItems();
  };

  const deleteItem = async (id: string) => {
    if (!user) throw new Error("User not authenticated");
    const item = items.find((i) => i.id === id);
    if (!item) return;

    // Completed items are locked and cannot be deleted
    if (item.completedAt) {
      throw new Error("Completed bucket items cannot be deleted");
    }

    await deleteDocument(`users/${user.uid}/bucketList`, id);
    await fetchItems();
  };

  return {
    items,
    loading,
    error,
    refresh: fetchItems,
    addItem,
    toggleComplete,
    deleteItem,
  };
}


