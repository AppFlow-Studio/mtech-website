"use client"
import { useProducts } from "../actions/ProductsServerState"
import { useState, useEffect } from "react"
import { Search, Package, ShoppingCart, Plus, Minus, Eye, X, Save, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTags } from "./TagContext"
import { useGetAgentProducts } from "../actions/AgentStore"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { AddOrderItems } from "../actions/order-actions/add-order-items"
const tags = [
    "atm parts",
    "pos parts",
    "network devices",
    "atm signage",
    "credit card terminals",
]


export default function OrderProductShopping({ agent_id, agent_tier, agent_profile, agent_notes, order_id, setShowAddItemDialog, refetchOrderInfo }: { agent_id: string, agent_tier: any, agent_profile: any, agent_notes: any, order_id: string, setShowAddItemDialog: (show: boolean) => void, refetchOrderInfo: () => void }) {
    const { data: AgentProducts, isLoading, isError } = useGetAgentProducts(agent_id)
    // const { tags } = useTags()
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [cart, setCart] = useState<Record<string, number>>({})
    const [searchTerm, setSearchTerm] = useState('')
    const [productSearchTerm, setProductSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [isStickyCartVisible, setIsStickyCartVisible] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    // Handle scroll for sticky cart
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            const headerHeight = 150 // Reduced threshold for better UX
            setIsStickyCartVisible(scrollY > headerHeight && getTotalCartItems() > 0)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [cart]) // Re-run when cart changes

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

    // Filter products based on search term and selected tags
    const filteredProducts = AgentProducts?.agent_tiers.agent_product_prices?.filter((agent_product: any) => {
        // Text search filter
        const matchesSearch = agent_product.products.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
            agent_product.products.description.toLowerCase().includes(productSearchTerm.toLowerCase())

        // Category filter
        const matchesCategory = categoryFilter === 'all' || agent_product.products.category.toLowerCase().includes(categoryFilter)

        // Tag filter
        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some(tag => agent_product.products.tags?.includes(tag))

        return matchesSearch && matchesCategory && matchesTags
    })

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        )
    }

    const clearAllTags = () => {
        setSelectedTags([])
    }

    const openProductDetail = (product: any) => {
        setSelectedProduct(product)
        setIsDetailDialogOpen(true)
    }

    const addToCart = (productId: string, productName: string) => {
        setCart(prev => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1
        }))
        toast.success(`${productName} added to cart`)
    }

    const removeFromCart = (productId: string) => {
        setCart(prev => {
            const newCart = { ...prev }
            if (newCart[productId] > 1) {
                newCart[productId] -= 1
            } else {
                delete newCart[productId]
            }
            return newCart
        })
    }

    const getCartItemCount = (productId: string) => {
        return cart[productId] || 0
    }

    const getTotalCartItems = () => {
        return Object.values(cart).reduce((sum, count) => sum + count, 0)
    }

    const getCartTotal = () => {
        return Object.entries(cart).reduce((total, [productId, quantity]) => {
            const agentProduct = AgentProducts?.agent_tiers.agent_product_prices?.find((ap: any) => ap.products.id === productId)
            return total + (agentProduct?.price || 0) * quantity
        }, 0)
    }


    const getCartItems = () => {
        return Object.entries(cart).map(([productId, quantity]) => {
            const agentProduct = AgentProducts?.agent_tiers.agent_product_prices?.find((ap: any) => ap.products.id === productId)
            return {
                product: agentProduct?.products,
                price: agentProduct?.price,
                quantity
            }
        }).filter(item => item.product)
    }

    const onSaveCart = async () => {
        if (getTotalCartItems() === 0) {
            toast.error('No items to save')
            return
        }
        setIsSaving(true)
        const orderItems = getCartItems().map((item: any) => ({
            order_id: order_id,
            product_id: item.product.id,
            quantity: item.quantity,
            price_at_order: item.price
        }))
        const isSaved = await AddOrderItems(orderItems)
        if (isSaved instanceof Error) {
            toast.error('Failed to save cart')
        } else {
            toast.success('Cart saved successfully')
            setCart({})
            refetchOrderInfo()
        }
        setIsSaving(false)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold text-foreground">Product Catalog</h2>
                    <p className="text-sm text-muted-foreground">
                        Select products to add to order for this agent at their <span className="font-medium text-foreground">{agent_tier.name}</span> pricing. Below are the agent's notes:
                    </p>
                    <span className="text-sm text-muted-foreground">
                        {agent_notes.length > 0 ? agent_notes : "No notes provided"}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShoppingCart className="h-4 w-4" />
                        <span>{getTotalCartItems()} items</span>
                        {getTotalCartItems() > 0 && (
                            <span className="font-medium text-foreground">
                                ${getCartTotal().toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Cart */}
            <AnimatePresence>
                {isStickyCartVisible && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            duration: 0.3
                        }}
                        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)'
                        }}
                    >
                        <div className="container mx-auto px-4 py-3">
                            <motion.div
                                className="flex items-center justify-between"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <motion.div
                                        className="flex items-center gap-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="relative">
                                            <ShoppingCart className="h-5 w-5 text-primary" />
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                                                >
                                                    {getTotalCartItems()}
                                                </Badge>
                                            </motion.div>
                                        </div>
                                        <span className="font-medium text-foreground">Shopping Cart</span>
                                    </motion.div>
                                    <div className="text-sm text-muted-foreground">
                                        {getCartItems().length} different items to add • ${getCartTotal().toFixed(2)} total
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCart({})}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Clear Cart
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={onSaveCart}
                                            disabled={isSaving}
                                            size="sm"
                                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <motion.div
                                                        className="h-4 w-4 mr-2 rounded-full border-2 border-primary-foreground border-t-transparent"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-1" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Cart Items Preview */}
                            <motion.div
                                className="mt-3 pt-3 border-t border-border"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {getCartItems().slice(0, 5).map((item, index) => (
                                        <motion.div
                                            key={item.product?.id}
                                            className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 min-w-0 flex-shrink-0 hover:bg-muted/70 transition-colors"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="w-8 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.product?.imageSrc}
                                                    alt={item.product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {item.product?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Qty: {item.quantity} • ${item.price?.toFixed(2)} each
                                                </p>
                                            </div>
                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFromCart(item.product?.id || '')}
                                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                    {getCartItems().length > 5 && (
                                        <motion.div
                                            className="flex items-center justify-center bg-muted/50 rounded-lg px-3 py-2 min-w-0 flex-shrink-0"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <span className="text-sm text-muted-foreground">
                                                +{getCartItems().length - 5} more
                                            </span>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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

            {/* Tag Filters */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">Filter by Tags</h3>
                    {selectedTags.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllTags}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Clear all
                        </Button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className={`cursor-pointer transition-colors hover:bg-primary/10 ${selectedTags.includes(tag)
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'hover:border-primary/50'
                                }`}
                            onClick={() => handleTagToggle(tag)}
                        >
                            {tag}
                            {selectedTags.includes(tag) && (
                                <span className="ml-1 text-xs">✓</span>
                            )}
                        </Badge>
                    ))}
                </div>
                {selectedTags.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                        Showing products with: {selectedTags.join(', ')}
                    </div>
                )}
            </div>
            <motion.div
                className="mt-3 pt-3 border-t border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {getCartItems().slice(0, 5).map((item, index) => (
                        <motion.div
                            key={item.product?.id}
                            className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 min-w-0 flex-shrink-0 hover:bg-muted/70 transition-colors"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="w-8 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
                                <img
                                    src={item.product?.imageSrc}
                                    alt={item.product?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {item.product?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Qty: {item.quantity} • ${item.price?.toFixed(2)} each
                                </p>
                            </div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromCart(item.product?.id || '')}
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </motion.div>
                        </motion.div>
                    ))}
                    {getCartItems().length > 5 && (
                        <motion.div
                            className="flex items-center justify-center bg-muted/50 rounded-lg px-3 py-2 min-w-0 flex-shrink-0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <span className="text-sm text-muted-foreground">
                                +{getCartItems().length - 5} more
                            </span>
                        </motion.div>
                    )}
                </div>
            </motion.div>
            {/* Products Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        {filteredProducts?.length} of {AgentProducts?.agent_tiers.agent_product_prices?.length || 0} products
                        {(searchTerm || selectedTags.length > 0) && (
                            <span className="ml-2 text-xs">
                                (filtered)
                            </span>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts?.map((agent_products: any) => {
                        const cartQuantity = getCartItemCount(agent_products.products.id)
                        return (
                            <div key={agent_products.products.link} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-square bg-muted relative">
                                    <img
                                        src={agent_products.products.imageSrc}
                                        alt={agent_products.products.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${agent_products.products.inStock
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {agent_products.products.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-foreground mb-2 line-clamp-2">{agent_products.products.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{agent_products.products.description}</p>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {agent_products.products.tags.map((tag: string) => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-lg font-bold text-foreground">
                                            ${agent_products.price?.toFixed(2)}
                                        </span>
                                        {cartQuantity > 0 && (
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                {cartQuantity} in cart
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openProductDetail(agent_products)}
                                            className="flex-1"
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            View Details
                                        </Button>
                                        {cartQuantity > 0 ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => removeFromCart(agent_products.products.id)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => addToCart(agent_products.products.id, agent_products.products.name)}
                                                    disabled={!agent_products.products.inStock}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={() => addToCart(agent_products.products.id, agent_products.products.name)}
                                                disabled={!agent_products.products.inStock}
                                            >
                                                <ShoppingCart className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Empty State */}
                {filteredProducts?.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
                        <p className="text-muted-foreground">
                            {searchTerm || selectedTags.length > 0
                                ? "Try adjusting your search or filters"
                                : "No products available at the moment"
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Product Detail Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="max-w-6xl w-full [&>button]:hidden max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Product Details</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsDetailDialogOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </DialogTitle>
                        <DialogDescription>
                            Detailed information about the selected product
                        </DialogDescription>
                    </DialogHeader>

                    {selectedProduct && (
                        <div className="space-y-6">
                            {/* Product Image and Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                                        <img
                                            src={selectedProduct.products.imageSrc}
                                            alt={selectedProduct.products.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedProduct.products.inStock
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {selectedProduct.products.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                        <span className="text-2xl font-bold text-foreground">
                                            ${selectedProduct.price?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-foreground mb-2">
                                            {selectedProduct.products.name}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {selectedProduct.products.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-foreground mb-2">Product Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.products.tags.map((tag: string) => (
                                                <Badge key={tag} variant="secondary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-foreground mb-2">Product Link</h4>
                                        <p className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                                            {selectedProduct.products.link}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="border-t border-border pt-6">
                                <h4 className="font-medium text-foreground mb-4">Additional Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-foreground">Product ID:</span>
                                        <p className="text-muted-foreground">{selectedProduct.products.id}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground">Agent Price:</span>
                                        <p className="text-muted-foreground">${selectedProduct.price?.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground">Default Price:</span>
                                        <p className="text-muted-foreground">${selectedProduct.products.default_price?.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-foreground">Stock Status:</span>
                                        <p className="text-muted-foreground">
                                            {selectedProduct.products.inStock ? 'Available' : 'Unavailable'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-border">
                                <Button
                                    onClick={() => addToCart(selectedProduct.products.id, selectedProduct.products.name)}
                                    disabled={!selectedProduct.products.inStock}
                                    className="flex-1"
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDetailDialogOpen(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}