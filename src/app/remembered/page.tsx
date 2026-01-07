"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Bookmark } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { RememberedItemCard } from "@/components/ui/remembered-item-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRemembered } from "@/hooks/use-remembered";
import { useToast } from "@/hooks/use-toast";

export default function RememberedPage() {
  const { toast } = useToast();
  const {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
  } = useRemembered();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setEditingItemId(null);
  };

  const handleSubmit = async () => {
    if (!newTitle.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the title.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingItemId) {
        await updateItem(editingItemId, {
          title: newTitle.trim(),
          description: newDescription.trim(),
        });
        toast({
          title: "Updated!",
          description: "Item updated successfully.",
        });
      } else {
        await addItem({
          title: newTitle.trim(),
          description: newDescription.trim(),
        });
        toast({
          title: "Added!",
          description: "Item added to your list.",
        });
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving item:", error);
      toast({
        title: "Error",
        description: "Failed to save item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setNewTitle(item.title);
      setNewDescription(item.description || "");
      setEditingItemId(id);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem(id);
        toast({
          title: "Deleted!",
          description: "Item removed from your list.",
        });
      } catch (error) {
        console.error("Error deleting item:", error);
        toast({
          title: "Error",
          description: "Failed to delete item. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <PageLayout title="To Be Remembered">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="To Be Remembered">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-primary" />
              To Be Remembered
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Keep track of important information
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-glass-border">
              <DialogHeader>
                <DialogTitle>
                  {editingItemId ? "Edit Item" : "Add New Item"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter title..."
                    className="input-dark"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Enter description (optional)..."
                    className="input-dark min-h-[100px] resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                  >
                    {editingItemId ? "Update" : "Add"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Items List */}
        {items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <RememberedItemCard
                key={item.id}
                {...item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center space-y-4">
            <Bookmark className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
            <div>
              <h3 className="text-lg font-semibold mb-2">No items yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start adding important information you want to remember.
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Item
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </PageLayout>
  );
}

