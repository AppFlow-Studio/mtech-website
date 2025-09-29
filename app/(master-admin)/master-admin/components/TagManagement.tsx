"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  Tag as TagIcon,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useTags } from "../actions/hook/useTagHooks";
import { addTag } from "../product-actions/add-tag";
import { updateTag } from "../product-actions/update-tag";
import { deleteTag } from "../product-actions/delete-tag";

const tagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(50, "Tag name must be less than 50 characters"),
});

type TagFormType = z.infer<typeof tagSchema>;

export default function TagManagement() {
  const { data: tags, refetch } = useTags();
  const queryClient = useQueryClient();

  const [editingTag, setEditingTag] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [tagToDelete, setTagToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const addForm = useForm<TagFormType>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: "" },
  });

  const editForm = useForm<TagFormType>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: "" },
  });

  const addTagMutation = useMutation({
    mutationFn: addTag,
    onSuccess: () => {
      toast.success("Tag added successfully");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setOpenAddDialog(false);
      addForm.reset();
    },
    onError: (error) => {
      toast.error("Failed to add tag", { description: error.message });
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: (variables: { id: string; name: string }) =>
      updateTag(variables.id, variables.name),
    onSuccess: () => {
      toast.success("Tag updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setOpenEditDialog(false);
      setEditingTag(null);
    },
    onError: (error) => {
      toast.error("Failed to update tag", { description: error.message });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      toast.success("Tag deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setOpenDeleteDialog(false);
      setTagToDelete(null);
    },
    onError: (error) => {
      toast.error("Failed to delete tag", { description: error.message });
    },
  });

  const handleAddTag = (values: TagFormType) => {
    const newTag = values.name.toLowerCase().trim();
    if (tags?.some((tag: any) => tag.name === newTag)) {
      toast.error("Tag already exists");
      return;
    }
    addTagMutation.mutate(newTag);
  };

  const handleEditTag = (values: TagFormType) => {
    if (!editingTag) return;
    const newTagName = values.name.toLowerCase().trim();
    if (
      tags?.some(
        (tag: any) => tag.name === newTagName && tag.id !== editingTag.id
      )
    ) {
      toast.error("Tag with this name already exists");
      return;
    }
    updateTagMutation.mutate({ id: editingTag.id, name: newTagName });
  };

  const handleDeleteTag = () => {
    if (!tagToDelete) return;
    deleteTagMutation.mutate(tagToDelete.id);
  };

  const openEditDialogHandler = (tag: { id: string; name: string }) => {
    setEditingTag(tag);
    editForm.setValue("name", tag.name);
    setOpenEditDialog(true);
  };

  const openDeleteDialogHandler = (tag: { id: string; name: string }) => {
    setTagToDelete(tag);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Tag Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage product tags that can be applied to products
          </p>
        </div>
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Tag</DialogTitle>
              <DialogDescription>
                Create a new tag that can be applied to products.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form
                onSubmit={addForm.handleSubmit(handleAddTag)}
                className="space-y-4"
              >
                <FormField
                  control={addForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter tag name..."
                          {...field}
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenAddDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addTagMutation.isPending}>
                    {addTagMutation.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Add Tag
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">Current Tags</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {tags?.length || 0} tag(s) available
          </p>
        </div>
        <div className="p-6">
          {tags?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TagIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tags created yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tags?.map((tag: any) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-background hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-foreground capitalize">
                      {tag.name}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialogHandler(tag)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDeleteDialogHandler(tag)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleEditTag)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag Name</FormLabel>
                    <FormControl>
                      <Input {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenEditDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTagMutation.isPending}>
                  {updateTagMutation.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Update Tag
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-destructive" />
              Delete Tag
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the tag "{tagToDelete?.name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTag}
              disabled={deleteTagMutation.isPending}
            >
              {deleteTagMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
