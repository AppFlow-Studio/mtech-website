import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Tag, AlertTriangle, Loader2, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { useTags } from "./TagContext"

const tagSchema = z.object({
    name: z.string().min(1, "Tag name is required").max(50, "Tag name must be less than 50 characters"),
})

type TagFormType = z.infer<typeof tagSchema>

export default function TagManagement() {
    const { tags, addTag, updateTag, deleteTag: deleteTagFromContext } = useTags()
    const [editingTag, setEditingTag] = useState<string | null>(null)
    const [deleteTag, setDeleteTag] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

    const addForm = useForm<TagFormType>({
        resolver: zodResolver(tagSchema),
        defaultValues: {
            name: "",
        },
    })

    const editForm = useForm<TagFormType>({
        resolver: zodResolver(tagSchema),
        defaultValues: {
            name: "",
        },
    })

    const handleAddTag = async (values: TagFormType) => {
        const newTag = values.name.toLowerCase().trim()

        if (tags.includes(newTag)) {
            toast.error("Tag already exists")
            return
        }

        // Mock API call - replace with actual API
        addTag(newTag)
        toast.success("Tag added successfully")
        setOpenAddDialog(false)
        addForm.reset()
    }

    const handleEditTag = async (values: TagFormType) => {
        if (!editingTag) return

        const newTagName = values.name.toLowerCase().trim()

        if (tags.includes(newTagName) && newTagName !== editingTag) {
            toast.error("Tag already exists")
            return
        }

        // Mock API call - replace with actual API
        updateTag(editingTag, newTagName)
        toast.success("Tag updated successfully")
        setOpenEditDialog(false)
        setEditingTag(null)
        editForm.reset()
    }

    const handleDeleteTag = async () => {
        if (!deleteTag) return

        setIsDeleting(true)

        // Mock API call - replace with actual API
        setTimeout(() => {
            deleteTagFromContext(deleteTag)
            toast.success("Tag deleted successfully")
            setOpenDeleteDialog(false)
            setDeleteTag(null)
            setIsDeleting(false)
        }, 500)
    }

    const openEditDialogHandler = (tag: string) => {
        setEditingTag(tag)
        editForm.setValue("name", tag)
        setOpenEditDialog(true)
    }

    const openDeleteDialogHandler = (tag: string) => {
        setDeleteTag(tag)
        setOpenDeleteDialog(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Tag Management</h2>
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
                            <form onSubmit={addForm.handleSubmit(handleAddTag)} className="space-y-4">
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
                                        onClick={() => {
                                            setOpenAddDialog(false)
                                            addForm.reset()
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Add Tag
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Tags List */}
            <div className="bg-card border border-border rounded-lg">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-medium text-foreground">Current Tags</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {tags.length} tag{tags.length !== 1 ? 's' : ''} available
                    </p>
                </div>
                <div className="p-6">
                    {tags.length === 0 ? (
                        <div className="text-center py-8">
                            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No tags created yet</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Create your first tag to get started
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tags.map((tag) => (
                                <div
                                    key={tag}
                                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                            <Tag className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground capitalize">
                                                {tag}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {tag.split(' ').length > 1 ? 'Multi-word tag' : 'Single word tag'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => openEditDialogHandler(tag)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => openDeleteDialogHandler(tag)}
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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

            {/* Edit Tag Dialog */}
            <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Tag</DialogTitle>
                        <DialogDescription>
                            Update the tag name. This will affect all products using this tag.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(handleEditTag)} className="space-y-4">
                            <FormField
                                control={editForm.control}
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
                                    onClick={() => {
                                        setOpenEditDialog(false)
                                        setEditingTag(null)
                                        editForm.reset()
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Update Tag
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold">Delete Tag</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    This action cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="text-sm text-foreground">
                            Are you sure you want to delete the tag <span className="font-semibold capitalize">"{deleteTag}"</span>?
                            This will remove the tag from all products that use it.
                        </p>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpenDeleteDialog(false)
                                setDeleteTag(null)
                            }}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteTag}
                            disabled={isDeleting}
                            className="gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    Delete Tag
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
} 