import { useProducts } from "../actions/ProductsServerState"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Search, Upload, AlertTriangle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { useRef } from "react"
import { Select } from "@/components/ui/select"
import { addProduct } from "../product-actions/add-product"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { deleteProduct } from "../product-actions/delete-product"
import { toast } from "sonner"
import { updateProduct } from "../product-actions/update-product"
import { useTags } from "./TagContext"

export default function ProductManagement({ searchTerm, setSearchTerm }: {
    searchTerm: string,
    setSearchTerm: (term: string) => void
}) {
    const { data: products, isLoading, isError, refetch } = useProducts()
    const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">Loading products...</div>
        </div>
    )

    if (isError) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-lg text-destructive">Error loading products</div>
        </div>
    )

    // Filter products based on search term
    const filteredProducts = products?.filter((product: any) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    const handleDeleteProduct = async (product: any) => {
        setDeleteProductId(product.id)
        setOpenDeleteDialog(true)
    }

    const confirmDelete = async () => {
        if (deleteProductId) {
            setIsDeleting(true)
            const result = await deleteProduct(deleteProductId)
            if (result instanceof Error) {
                console.error(result)
                toast.error("Error deleting product")
            }
            else {
                toast.success("Product deleted successfully")
            }
            await refetch()
            setIsDeleting(false)
        }
        setOpenDeleteDialog(false)
        setDeleteProductId(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Product Management</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>
                                Fill out the form below to add a new product to the catalog.
                            </DialogDescription>
                        </DialogHeader>
                        <ProductAddForm />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product: any) => (
                    <div key={product.link} className="bg-card border border-border rounded-lg overflow-hidden">
                        <div className="aspect-square bg-muted relative">
                            <img
                                src={product.imageSrc}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.inStock
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-foreground mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                                {product.tags.map((tag: string) => (
                                    <Badge key={tag} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Edit Product: {product.name}</DialogTitle>
                                            <DialogDescription>
                                                Update product information, pricing, and availability.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <ProductEditForm product={product} />
                                    </DialogContent>
                                </Dialog>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteProduct(product)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Confirm Delete
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deleteProduct?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Product"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}


function ImageDropField({
    value,
    onChange,
    previewUrl,
    setPreviewUrl,
}: {
    value: File | null
    onChange: (file: File | null) => void
    previewUrl: string
    setPreviewUrl: (url: string) => void
}) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
            onChange(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
            onChange(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    return (
        <div
            className="w-full h-32 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center cursor-pointer bg-muted/30 hover:bg-muted/50 transition"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onDragEnter={e => e.preventDefault()}
        >
            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                />
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-full p-2 border-2 border-dashed border-muted rounded-lg bg-background/60">
                    <div className="flex items-center border justify-center w-10 h-10 mb-2 rounded-full bg-muted">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground text-center px-2 font-medium">
                        <span className="block">Drag &amp; drop PNG/JPG here</span>
                        <span className="block">or <span className="underline text-primary">click to select</span></span>
                    </span>
                </div>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}

// Add edit product schema after the existing productSchema
const editProductSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    link: z.string().min(1, "Product link is required").regex(/^\S+$/, "No spaces allowed in product link"),
    inStock: z.boolean(),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    default_price: z.coerce.number().min(0.01, "Price is required"),
    imageSrc: z.instanceof(File).or(z.string()).optional()
})

type EditProductFormType = z.infer<typeof editProductSchema>

// Replace the entire ProductEditForm function
function ProductEditForm({ product }: { product: any }) {
    const tagOptions = useTagOptions()
    const form = useForm<EditProductFormType>({
        resolver: zodResolver(editProductSchema),
        defaultValues: {
            name: product.name || '',
            description: product.description || '',
            link: product.link || '',
            inStock: product.inStock || false,
            tags: product.tags || [],
            default_price: product.default_price || 0,
            imageSrc: product.imageSrc || '',
        },
        mode: "onTouched"
    })
    const [previewUrl, setPreviewUrl] = useState<string>(product.imageSrc || "")
    const { refetch } = useProducts()

    const onSubmit = async (values: EditProductFormType) => {
        // TODO: Call editProduct function
        const result = await updateProduct(product.id, {
            name: values.name,
            description: values.description,
            link: values.link,
            inStock: values.inStock,
            tags: values.tags,
            default_price: values.default_price,
            imageSrc: values.imageSrc || product.imageSrc,
        }, product.imageSrc)
        if (result instanceof Error) {
            console.error(result)
            toast.error("Error updating product")
        }
        else {
            toast.success("Product updated successfully")
            toast.success("Product updated successfully")
            await refetch()
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="imageSrc"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                                <ImageDropField
                                    value={field.value || null}
                                    onChange={file => {
                                        field.onChange(file)
                                        setPreviewUrl(file ? URL.createObjectURL(file) : product.imageSrc || "")
                                    }}
                                    previewUrl={previewUrl}
                                    setPreviewUrl={setPreviewUrl}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter product name" onChange={e => {
                                        field.onChange(e)
                                        // auto-generate link
                                        form.setValue("link", e.target.value.toLowerCase().replace(/ /g, '-'))
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Link <span className="text-xs">(Auto generated)</span></FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="product-slug" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Enter product description" rows={4} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="default_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Default Price ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" step="0.01" {...field} value={field.value} placeholder="0.00" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="inStock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock Status</FormLabel>
                                <FormControl>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="inStock"
                                            checked={field.value}
                                            onChange={e => field.onChange(e.target.checked)}
                                            className="rounded border-gray-300"
                                        />
                                        <label htmlFor="inStock" className="text-sm text-foreground">
                                            In Stock
                                        </label>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2 mb-2">
                                        <Select
                                            value={""}
                                            onChange={e => {
                                                const tag = e.target.value
                                                if (tag && !field.value.includes(tag)) {
                                                    field.onChange([...field.value, tag])
                                                }
                                            }}
                                            className="w-[180px]"
                                        >
                                            <option value="" disabled>Select a tag</option>
                                            {tagOptions.filter(option => !field.value.includes(option)).map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </Select>
                                        <Button type="button" variant="outline" disabled>
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {field.value.map((tag: any) => (
                                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange(field.value.filter((t: string) => t !== tag))}
                                                    className="ml-1 hover:text-destructive"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Product Preview */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Preview</label>
                    <div className="border border-border rounded-lg p-4 bg-muted/20">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt={form.watch("name")}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs text-muted-foreground">No image</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-foreground">{form.watch("name") || 'Product Name'}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {form.watch("description") || 'Product description will appear here...'}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm font-medium text-foreground">
                                        ${Number(form.watch("default_price")).toFixed(2)}
                                    </span>
                                    <Badge variant={form.watch("inStock") ? "default" : "secondary"}>
                                        {form.watch("inStock") ? "In Stock" : "Out of Stock"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Updating Product...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    link: z.string().min(1, "Product link is required").regex(/^\S+$/, "No spaces allowed in product link"),
    inStock: z.boolean(),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    default_price: z.coerce.number().min(0.01, "Price is required"),
    imageSrc: z.instanceof(File, { message: "Product image is required" })
})

type ProductFormType = z.infer<typeof productSchema>

function ProductAddForm() {
    const tagOptions = useTagOptions()
    const form = useForm<ProductFormType>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            link: '',
            inStock: false,
            tags: [],
            default_price: 0,
            imageSrc: undefined as any,
        },
        mode: "onTouched"
    })
    const [previewUrl, setPreviewUrl] = useState<string>("")
    const { refetch } = useProducts()
    const onSubmit = async (values: ProductFormType) => {
        const result = await addProduct(values)
        if (result instanceof Error) {
            console.error(result)
            toast.error("Error adding product")
        }
        else {
            //console.log(result)
            form.reset()
            setPreviewUrl("")
            await refetch()
            toast.success("Product added successfully")
        }
        // Optionally reset form or close dialog
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="imageSrc"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                                <ImageDropField
                                    value={field.value || null}
                                    onChange={file => {
                                        field.onChange(file)
                                        setPreviewUrl(file ? URL.createObjectURL(file) : "")
                                    }}
                                    previewUrl={previewUrl}
                                    setPreviewUrl={setPreviewUrl}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter product name" onChange={e => {
                                        field.onChange(e)
                                        // auto-generate link
                                        form.setValue("link", e.target.value.toLowerCase().replace(/ /g, '-'))
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Link <span className="text-xs">(Auto generated)</span></FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="product-slug" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Enter product description" rows={4} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="default_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Default Price ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" step="0.01" {...field} placeholder="0.00" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="inStock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock Status</FormLabel>
                                <FormControl>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="inStock"
                                            checked={field.value}
                                            onChange={e => field.onChange(e.target.checked)}
                                            className="rounded border-gray-300"
                                        />
                                        <label htmlFor="inStock" className="text-sm text-foreground">
                                            In Stock
                                        </label>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <>
                                    <div className="flex gap-2 mb-2">
                                        <Select
                                            value={""}
                                            onChange={e => {
                                                const tag = e.target.value
                                                if (tag && !field.value.includes(tag)) {
                                                    field.onChange([...field.value, tag])
                                                }
                                            }}
                                            className="w-[180px]"
                                        >
                                            <option value="" disabled>Select a tag</option>
                                            {TAG_OPTIONS.filter(option => !field.value.includes(option)).map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </Select>
                                        <Button type="button" variant="outline" disabled>
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {field.value.map((tag: any) => (
                                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange(field.value.filter((t: string) => t !== tag))}
                                                    className="ml-1 hover:text-destructive"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Product Preview */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Preview</label>
                    <div className="border border-border rounded-lg p-4 bg-muted/20">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt={form.watch("name")}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs text-muted-foreground">No image</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-foreground">{form.watch("name") || 'Product Name'}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {form.watch("description") || 'Product description will appear here...'}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm font-medium text-foreground">
                                        ${Number(form.watch("default_price")).toFixed(2)}
                                    </span>
                                    <Badge variant={form.watch("inStock") ? "default" : "secondary"}>
                                        {form.watch("inStock") ? "In Stock" : "Out of Stock"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Adding Product...
                            </>
                        ) : (
                            "Add Product"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

// Tag options - now using shared context
function useTagOptions() {
    const { tags } = useTags()
    return tags
}