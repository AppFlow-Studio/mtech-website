'use client'
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Star,
    Search,
    Package,
    DollarSign,
    Plus,
    ShoppingCart,
    X,
    Save,
    Trash2,
    Weight,
    FileText,
    Calendar,
    ExternalLink,
    Info,
    Tag,
    Check
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useGetAgentById, useGetAgentProducts } from "@/app/(master-admin)/master-admin/actions/AgentStore"
import { toast } from "sonner"
import ProductCardWithDialog from "./ProductCardWithDialog"
import { motion, AnimatePresence } from "framer-motion"
// Removed global cart store - now using header cart as single source of truth
import { syncOrderItems } from "../actions/sync-order-items"
import { createOrderWithItems } from "../actions/create-order-with-items"
import { useProfile } from "@/lib/hooks/useProfile"
import CreateOrderWithCartDialog from "./CreateOrderWithCartDialog"
import { useTags } from "@/app/(master-admin)/master-admin/actions/hook/useTagHooks"
import { Product } from "@/lib/types"


export default function AgentProductsTab({
    agent_id,
    addToCart,
    selectedInquiryForCart,
    setSelectedInquiryForCart,
    cartItems,
    removeFromCart,
    updateQuantity
}: {
    agent_id: string
    addToCart?: (product: any) => void
    selectedInquiryForCart?: any
    setSelectedInquiryForCart?: (inquiry: any) => void
    cartItems?: any[]
    removeFromCart?: (productId: string, productSelectedModifiers?: {
        [groupId: number]: number
        modifierId: number
        groupName: string
        modifierName: string
        priceAdjustment: number
    }[]) => void
    updateQuantity?: (productId: string, quantity: number) => void
}) {
    const { data: agent, isLoading: isAgentLoading } = useGetAgentProducts(agent_id)
    const { data: tags } = useTags()
    // console.log(cartItems)
    const [productSearchTerm, setProductSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    // Using header cart as single source of truth instead of global cart store
    const { profile } = useProfile()
    const [isStickyCartVisible, setIsStickyCartVisible] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [showNewOrderDialog, setShowNewOrderDialog] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showProductDialog, setShowProductDialog] = useState(false);
    const [showModifierDialog, setShowModifierDialog] = useState(false);
    const [productForModifiers, setProductForModifiers] = useState<any>(null);
    const [selectedModifiers, setSelectedModifiers] = useState<{ [groupId: number]: number }>({});

    // Cart management functions using header cart (single source of truth)
    const getTotalCartItems = () => {
        return cartItems?.reduce((total, item) => total + Number(item.quantity || 1), 0) || 0;
    }
    // Handle scroll for sticky cart
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            const headerHeight = 150 // Reduced threshold for better UX
            setIsStickyCartVisible(scrollY > headerHeight && getTotalCartItems() > 0)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [cartItems]) // Re-run when header cart changes

    const onSaveCart = async () => {
        if (getTotalCartItems() === 0) {
            toast.error('No items to save')
            return
        }
        setIsSaving(true)
        try {
            const headerCartItems = getCartItems()

            // If we have a selectedInquiryForCart, add items to that order
            if (selectedInquiryForCart) {
                const orders_items = headerCartItems.map((item: any) => ({
                    order_id: selectedInquiryForCart.id,
                    product_id: item.id,
                    quantity: Number(item.quantity),
                    price_at_order: item.price
                }))
                // console.log('Orders Items', orders_items)
                const result = await syncOrderItems(selectedInquiryForCart.id, orders_items)
                if (result instanceof Error) {
                    toast.error('Failed to add cart items to order',
                        {
                            description: result.message
                        }
                    )
                    return
                }
                toast.success('Cart items added to order successfully!')
                // Clear the header cart
                if (removeFromCart) {
                    headerCartItems.forEach((item: any) => {
                        removeFromCart(item.id, item?.selectedModifiers)
                    })
                }
                if (setSelectedInquiryForCart) {
                    setSelectedInquiryForCart(null)
                }
            } else {
                // No order selected, open the CreateOrderWithCartDialog
                setShowNewOrderDialog(true)
            }
        } catch (error) {
            console.error('Error saving cart:', error)
            toast.error('Failed to save cart')
        } finally {
            setIsSaving(false)
        }
    }

    if (isAgentLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 animate-pulse">
                <Package className="h-10 w-10 text-primary mb-2 animate-bounce" />
                <span className="text-lg font-semibold text-primary">Loading products...</span>
            </div>
        )
    }

    if (!agent) {
        return (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                <Star className="h-10 w-10 text-yellow-400 mb-2 animate-spin" />
                <span className="text-lg font-semibold text-destructive">Oops! Agent not found.</span>
                <span className="text-muted-foreground text-sm mt-1">Please check your profile or try refreshing the page.</span>
            </div>
        )
    }

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

    const getCartItemCount = (productId: string) => {
        const totalQuantity = cartItems
            ?.filter((item: any) => item.id === productId)
            .reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0
        return totalQuantity || 0
    }

    const getCartTotal = () => {
        return cartItems?.reduce((total, item: any) => {
            return total + getItemTotalWithModifiers(item)
        }, 0) || 0
    }

    const getItemTotalWithModifiers = (item: any) => {
        if (!item.selectedModifiers) {
            return (item.price || 0) * (item.quantity || 1);
        }
        return (item.price || 0) + item.selectedModifiers?.reduce((total: number, modifier: any) => total + modifier.priceAdjustment, 0) * (item.quantity || 1);
    };

    const getCartItems = () => {
        // Return cart items directly from header cart
        return cartItems || []
    }

    const addToCartLocal = (productId: string, productName: string) => {
        const agentProduct = agent?.agent_tiers?.agent_product_prices?.find((ap: any) => ap.products.id === productId)
        if (agentProduct && addToCart) {
            // Check if product has modifiers
            if (agentProduct.products.products_modifiers && agentProduct.products.products_modifiers.length > 0) {
                // Show modifier selection dialog
                setProductForModifiers(agentProduct)
                setShowModifierDialog(true)
                return
            }

            // No modifiers, add directly to cart
            const productForCart = {
                id: agentProduct.products.id,
                name: agentProduct.products.name,
                description: agentProduct.products.description,
                price: agentProduct.price,
                imageSrc: agentProduct.products.imageSrc,
                regularPrice: agentProduct.products.default_price,
                tags: agentProduct.products.tags,
                inStock: agentProduct.products.inStock
            }
            addToCart(productForCart)
            console.log('Added to header cart:', productForCart)
            console.log('Current header cart:', cartItems)
            toast.success(`${productName} added to cart`)
        }
    }

    const handleModifierSelection = () => {
        if (!productForModifiers || !addToCart) return

        // Calculate total price with modifiers
        let totalPrice = productForModifiers.price
        const selectedModifierDetails: any[] = []

        Object.entries(selectedModifiers).forEach(([groupId, modifierId]) => {
            const modifierGroup = productForModifiers.products.products_modifiers.find((pm: any) => pm.modifier_group_id === parseInt(groupId))
            if (modifierGroup) {
                const modifier = modifierGroup.modifier_groups.modifiers.find((m: any) => m.id === modifierId)
                if (modifier) {
                    selectedModifierDetails.push({
                        groupName: modifierGroup.modifier_groups.name,
                        modifierName: modifier.name,
                        modifierId: modifier.id,
                        priceAdjustment: modifier.price_adjustment
                    })
                }
            }
        })

        const productForCart = {
            id: productForModifiers.products.id,
            name: productForModifiers.products.name,
            description: productForModifiers.products.description,
            price: totalPrice,
            imageSrc: productForModifiers.products.imageSrc,
            regularPrice: productForModifiers.products.default_price,
            tags: productForModifiers.products.tags,
            inStock: productForModifiers.products.inStock,
            selectedModifiers: selectedModifierDetails
        }

        addToCart(productForCart)
        console.log('Added to header cart with modifiers:', productForCart)
        toast.success(`${productForModifiers.products.name} added to cart with modifiers`)

        // Reset state
        setShowModifierDialog(false)
        setProductForModifiers(null)
        setSelectedModifiers({})
    }

    const handleModifierChange = (groupId: number, modifierId: number) => {
        setSelectedModifiers(prev => ({
            ...prev,
            [groupId]: modifierId
        }))
    }

    const filteredProducts = agent?.agent_tiers?.agent_product_prices?.filter((agent_product: any) => {
        // Text search filter
        const matchesSearch = agent_product.products.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
            agent_product.products.description.toLowerCase().includes(productSearchTerm.toLowerCase())


        // Tag filter
        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some(tag => agent_product.products.product_tags?.some((pt: Product["product_tags"][number]) => pt.tag_id === tag))

        return matchesSearch && matchesTags
    })

    const handleViewProductDetails = (agent_product: any) => {
        const productForDialog = {
            ...agent_product.products,
            price: agent_product.price,
            tier_name: agent.agent_tiers?.name || 'Standard Tier'
        };
        setSelectedProduct(productForDialog);
        setShowProductDialog(true);
    };
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Your Products</h2>
                    <p className="text-muted-foreground">
                        Browse products available at your {agent.agent_tiers.name} pricing
                        {selectedInquiryForCart && (
                            <span className="ml-2 text-sm font-medium text-green-600">
                                • Shopping for {selectedInquiryForCart.order_name}
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {getTotalCartItems() > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ShoppingCart className="h-4 w-4" />
                            <span>{getTotalCartItems()} items</span>
                            <span className="font-medium text-foreground">
                                ${getCartTotal().toFixed(2)}
                            </span>
                        </div>
                    )}
                    <Badge variant="outline" className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        {agent.agent_tiers.name}
                    </Badge>
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
                                            onClick={() => {
                                                // Clear header cart by removing all items
                                                if (removeFromCart) {
                                                    getCartItems().forEach((item: any) => {
                                                        removeFromCart(item.id)
                                                    })
                                                }
                                            }}
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
                                                    {selectedInquiryForCart ? 'Add to Order' : 'Create New Order'}
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
                                            key={item.id}
                                            className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 min-w-0 flex-shrink-0 hover:bg-muted/70 transition-colors"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="w-8 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.imageSrc}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Qty: {item.quantity} • ${item.price?.toFixed(2)} each
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.selectedModifiers?.map((modifier: any) => (
                                                        <span key={modifier.id}>{modifier.modifierName || modifier.modifiers.name}: + ${modifier.priceAdjustment?.toFixed(2)}</span>
                                                    ))}
                                                </p>
                                            </div>
                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFromCart?.(item.id || '', item?.selectedModifiers)}
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

            {/* Customer Shopping Banner */}
            {selectedInquiryForCart && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <ShoppingCart className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-green-800">Shopping for Order: {selectedInquiryForCart.order_name}</h4>
                                <p className="text-sm text-green-600">
                                    {selectedInquiryForCart.order_name} • {selectedInquiryForCart.notes}
                                </p>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                if (setSelectedInquiryForCart) {
                                    setSelectedInquiryForCart(null)
                                }
                                // Clear header cart by removing all items
                                if (removeFromCart) {
                                    getCartItems().forEach((item: any) => {
                                        removeFromCart(item.id)
                                    })
                                }
                            }}
                            className="text-green-700 border-green-300 hover:bg-green-100"
                        >
                            Clear Selection
                        </Button>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {/* <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md"
                >
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select> */}
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
                    {tags?.map((tag) => (
                        <Badge
                            key={tag.id}
                            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                            className={`cursor-pointer transition-colors hover:bg-primary/10 ${selectedTags.includes(tag.id)
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'hover:border-primary/50'
                                }`}
                            onClick={() => handleTagToggle(tag.id)}
                        >
                            {tag.name}
                            {selectedTags.includes(tag.id) && (
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

            {/* Products Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        {filteredProducts?.length || 0} of {agent?.agent_tiers?.agent_product_prices?.length || 0} products
                        {(productSearchTerm || selectedTags.length > 0) && (
                            <span className="ml-2 text-xs">
                                (filtered)
                            </span>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts?.map((agent_product: any) => {
                        const cartQuantity = getCartItemCount(agent_product.products.id)
                        return (
                            <div key={agent_product.products.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-square bg-muted relative">
                                    <img
                                        src={agent_product.products.imageSrc}
                                        alt={agent_product.products.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${agent_product.products.inStock
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {agent_product.products.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-foreground mb-2 line-clamp-2">{agent_product.products.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{agent_product.products.description}</p>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {agent_product.products.product_tags.map((tag: any) => (
                                            <Badge key={tag.tag_id} variant="outline" className="text-xs">
                                                {tag.tags.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-lg font-bold text-foreground">
                                            ${agent_product.price?.toFixed(2)}
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
                                            onClick={() => handleViewProductDetails(agent_product)}
                                            className="flex-1"
                                        >
                                            <Package className="h-3 w-3 mr-1" />
                                            View Details
                                        </Button>
                                        {cartQuantity > 0 ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => removeFromCart?.(agent_product.products.id)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => addToCartLocal(agent_product.products.id, agent_product.products.name)}
                                                    disabled={!agent_product.products.inStock}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={() =>

                                                    addToCartLocal(agent_product.products.id, agent_product.products.name)

                                                }
                                                disabled={!agent_product.products.inStock}
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
                        <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>

            {/* Create Order with Cart Dialog */}
            <CreateOrderWithCartDialog
                open={showNewOrderDialog}
                onOpenChange={setShowNewOrderDialog}
                cartItems={getCartItems()}
                clearCart={() => {
                    // Clear header cart by removing all items
                    if (removeFromCart) {
                        getCartItems().forEach((item: any) => {
                            removeFromCart(item.id)
                        })
                    }
                }}
                onOrderCreated={(orderId) => {
                    // Optional callback when order is created
                    console.log('Order created with ID:', orderId)
                }}
            />

            {/* Product Detail Dialog */}
            <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Product Details
                        </DialogTitle>
                        <DialogDescription>
                            Comprehensive information about this product
                        </DialogDescription>
                    </DialogHeader>

                    {selectedProduct && (
                        <div className="space-y-6">
                            {/* Product Header */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl">{selectedProduct.name}</CardTitle>
                                            <CardDescription className="mt-2">
                                                {selectedProduct.description || 'No description available'}
                                            </CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-primary">
                                                ${selectedProduct.price?.toFixed(2) || '0.00'}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {selectedProduct.tier_name} Price
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>

                            {/* Product Information Tabs */}
                            <Tabs defaultValue="details" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                                    <TabsTrigger value="documents">Documents</TabsTrigger>
                                </TabsList>

                                {/* Details Tab */}
                                <TabsContent value="details" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Info className="h-5 w-5" />
                                                Basic Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="col-span-2">
                                                    <Label className="text-sm font-medium text-muted-foreground">Product Name</Label>
                                                    <div className="mt-1 text-lg font-semibold">{selectedProduct.name}</div>
                                                </div>
                                                {/* <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">SKU</Label>
                                                    <div className="mt-1 font-mono">{selectedProduct.sku || 'N/A'}</div>
                                                </div> */}
                                                {/* <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                                                    <div className="mt-1">
                                                        <Badge variant="secondary">{selectedProduct.category || 'Uncategorized'}</Badge>
                                                    </div>
                                                </div> */}
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Stock</Label>
                                                    <div className="mt-1">
                                                        <Badge variant={selectedProduct.active ? "default" : "secondary"}>
                                                            {selectedProduct.inStock ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </div>
                                                </div>

                                            </div>

                                            {selectedProduct.description && (
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                                    <div className="mt-1 p-3 bg-muted/30 rounded-lg text-sm">
                                                        {selectedProduct.description}
                                                    </div>
                                                </div>
                                            )}

                                            {selectedProduct.products_modifiers && selectedProduct.products_modifiers.length > 0 && (
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Modifier Options</Label>
                                                    <div className="mt-2 space-y-3">
                                                        {selectedProduct.products_modifiers.map((modifierGroup: any) => (
                                                            <div key={modifierGroup.id} className="p-3 rounded-lg bg-muted/20 border">
                                                                <div className="font-semibold text-primary mb-1">
                                                                    {modifierGroup.modifier_groups?.name || "Modifier Group"} ({modifierGroup.modifier_groups.modifiers.length} variants)
                                                                </div>
                                                                {modifierGroup.modifier_groups.modifiers && modifierGroup.modifier_groups.modifiers.length > 0 ? (
                                                                    <ul className="space-y-1">
                                                                        {modifierGroup.modifier_groups.modifiers.map((mod: any) => (
                                                                            <li key={mod.id} className="flex items-center justify-between">
                                                                                <span>
                                                                                    {mod.name}
                                                                                    {mod.desc && (
                                                                                        <span className="ml-2 text-xs text-muted-foreground">({mod.desc})</span>
                                                                                    )}
                                                                                </span>
                                                                                <p className={`ml-4 text-xs text-muted-foreground ${mod.price_adjustment > 0 ? 'text-green-500' : 'text-gray-500'}`}>
                                                                                    $ {mod.price_adjustment.toFixed(2)}
                                                                                </p>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <div className="text-xs text-muted-foreground">No modifiers available.</div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Pricing Tab */}
                                <TabsContent value="pricing" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <DollarSign className="h-5 w-5" />
                                                Pricing Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label className="text-sm font-medium text-muted-foreground">Current Tier Price</Label>
                                                        <div className="mt-1 text-3xl font-bold text-primary">
                                                            ${selectedProduct.price?.toFixed(2) || '0.00'}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {selectedProduct.tier_name}
                                                        </div>
                                                    </div>

                                                    {selectedProduct.subscription_interval && (
                                                        <div>
                                                            <Label className="text-sm font-medium text-muted-foreground">Subscription Interval</Label>
                                                            <div className="mt-1 flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                <span className="font-semibold">
                                                                    {selectedProduct.subscription_interval}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}


                                                </div>

                                                <div className="space-y-4">
                                                    {selectedProduct.price_at_order && (
                                                        <div>
                                                            <Label className="text-sm font-medium text-muted-foreground">Price at Order</Label>
                                                            <div className="mt-1 text-lg font-semibold">
                                                                ${selectedProduct.price_at_order.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* {selectedProduct.discount_percentage && (
                                                        <div>
                                                            <Label className="text-sm font-medium text-muted-foreground">Discount</Label>
                                                            <div className="mt-1">
                                                                <Badge variant="secondary" className="text-green-600">
                                                                    {selectedProduct.discount_percentage}% OFF
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    )} */}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Specifications Tab */}
                                <TabsContent value="specifications" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Weight className="h-5 w-5" />
                                                Physical Specifications
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Weight</Label>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <Weight className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-semibold">
                                                            {selectedProduct.weight ? `${selectedProduct.weight} lbs` : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {selectedProduct.dimensions && (
                                                    <>
                                                        <div>
                                                            <Label className="text-sm font-medium text-muted-foreground">Dimensions</Label>
                                                            <div className="mt-1 font-semibold">
                                                                {selectedProduct.dimensions.length && selectedProduct.dimensions.width && selectedProduct.dimensions.height
                                                                    ? `${selectedProduct.dimensions.length}" × ${selectedProduct.dimensions.width}" × ${selectedProduct.dimensions.height}"`
                                                                    : 'N/A'
                                                                }
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label className="text-sm font-medium text-muted-foreground">Volume</Label>
                                                            <div className="mt-1 font-semibold">
                                                                {selectedProduct.dimensions.length && selectedProduct.dimensions.width && selectedProduct.dimensions.height
                                                                    ? `${(selectedProduct.dimensions.length * selectedProduct.dimensions.width * selectedProduct.dimensions.height).toFixed(2)} cubic inches`
                                                                    : 'N/A'
                                                                }
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {selectedProduct.features && selectedProduct.features.length > 0 && (
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Features</Label>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {selectedProduct.features.map((feature: string, index: number) => (
                                                            <Badge key={index} variant="outline">
                                                                {feature}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {selectedProduct.specifications && (
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Technical Specifications</Label>
                                                    <div className="mt-1 p-3 bg-muted/30 rounded-lg text-sm">
                                                        <pre className="whitespace-pre-wrap">{selectedProduct.specifications}</pre>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Documents Tab */}
                                <TabsContent value="documents" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                Documents & Resources
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {selectedProduct.brochureUrl && (
                                                <div className="p-4 border border-muted rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="h-5 w-5 text-blue-600" />
                                                            <div>
                                                                <div className="font-semibold">Product Brochure</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Download product brochure and specifications
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            onClick={() => window.open(selectedProduct.brochureUrl, '_blank')}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <ExternalLink className="h-4 w-4 mr-2" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedProduct.manualUrl && (
                                                <div className="p-4 border border-muted rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="h-5 w-5 text-green-600" />
                                                            <div>
                                                                <div className="font-semibold">User Manual</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Installation and operation guide
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            onClick={() => window.open(selectedProduct.manualUrl, '_blank')}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <ExternalLink className="h-4 w-4 mr-2" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedProduct.warrantyUrl && (
                                                <div className="p-4 border border-muted rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="h-5 w-5 text-orange-600" />
                                                            <div>
                                                                <div className="font-semibold">Warranty Information</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Warranty terms and conditions
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            onClick={() => window.open(selectedProduct.warrantyUrl, '_blank')}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <ExternalLink className="h-4 w-4 mr-2" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {!selectedProduct.brochureUrl && !selectedProduct.manualUrl && !selectedProduct.warrantyUrl && (
                                                <div className="text-center py-8">
                                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                    <p className="text-muted-foreground">No documents available for this product</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowProductDialog(false)}
                                    className="flex-1"
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (selectedProduct && addToCart) {
                                            addToCart({
                                                id: selectedProduct.id,
                                                name: selectedProduct.name,
                                                price: selectedProduct.price,
                                                weight: selectedProduct.weight || 1,
                                                quantity: 1,
                                                image: selectedProduct.image
                                            });
                                            setShowProductDialog(false);
                                        }
                                    }}
                                    className="flex-1"
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modifier Selection Dialog */}
            <Dialog open={showModifierDialog} onOpenChange={setShowModifierDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Select Modifier Options
                        </DialogTitle>
                        <DialogDescription>
                            Choose your preferred options for {productForModifiers?.products.name}
                        </DialogDescription>
                    </DialogHeader>

                    {productForModifiers && (
                        <div className="space-y-6">
                            {/* Product Info */}
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={productForModifiers.products.imageSrc}
                                                alt={productForModifiers.products.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{productForModifiers.products.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {productForModifiers.products.description}
                                            </p>
                                            <div className="text-lg font-bold text-primary">
                                                Base Price: ${productForModifiers.price?.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Modifier Groups */}
                            <div className="space-y-4">
                                {productForModifiers.products.products_modifiers.map((modifierGroup: any) => (
                                    <Card key={modifierGroup.id}>
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                {modifierGroup.modifier_groups.name}
                                            </CardTitle>
                                            <CardDescription>
                                                Select your preferred option
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {modifierGroup.modifier_groups.modifiers.map((modifier: any) => {
                                                    const isSelected = selectedModifiers[modifierGroup.modifier_group_id] === modifier.id
                                                    return (
                                                        <div
                                                            key={modifier.id}
                                                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${isSelected
                                                                ? 'border-primary bg-primary/5'
                                                                : 'border-border hover:bg-muted/50'
                                                                }`}
                                                            onClick={() => handleModifierChange(modifierGroup.modifier_group_id, modifier.id)}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected
                                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                                    : 'border-muted-foreground'
                                                                    }`}>
                                                                    {isSelected && <Check className="h-3 w-3" />}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{modifier.name}</div>
                                                                    {modifier.desc && (
                                                                        <div className="text-sm text-muted-foreground">
                                                                            {modifier.desc}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className={`font-semibold ${modifier.price_adjustment > 0
                                                                    ? 'text-green-600'
                                                                    : modifier.price_adjustment < 0
                                                                        ? 'text-red-600'
                                                                        : 'text-muted-foreground'
                                                                    }`}>
                                                                    {modifier.price_adjustment > 0
                                                                        ? `+$${modifier.price_adjustment.toFixed(2)}`
                                                                        : modifier.price_adjustment < 0
                                                                            ? `-$${Math.abs(modifier.price_adjustment).toFixed(2)}`
                                                                            : 'No additional cost'
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Price Summary */}
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-muted-foreground">Base Price</div>
                                            <div className="text-lg font-semibold">${productForModifiers.price?.toFixed(2)}</div>
                                        </div>
                                        {Object.keys(selectedModifiers).length > 0 && (
                                            <div className="text-right">
                                                <div className="text-sm text-muted-foreground">Modifier Adjustments</div>
                                                <div className="text-lg font-semibold text-primary">
                                                    +${Object.entries(selectedModifiers).reduce((total, [groupId, modifierId]) => {
                                                        const modifierGroup = productForModifiers.products.products_modifiers.find((pm: any) => pm.modifier_group_id === parseInt(groupId))
                                                        if (modifierGroup) {
                                                            const modifier = modifierGroup.modifier_groups.modifiers.find((m: any) => m.id === modifierId)
                                                            if (modifier) {
                                                                return total + modifier.price_adjustment
                                                            }
                                                        }
                                                        return total
                                                    }, 0).toFixed(2)}
                                                </div>
                                            </div>
                                        )}
                                        <div className="text-right">
                                            <div className="text-sm text-muted-foreground">Total Price</div>
                                            <div className="text-2xl font-bold text-primary">
                                                ${(productForModifiers.price + Object.entries(selectedModifiers).reduce((total, [groupId, modifierId]) => {
                                                    const modifierGroup = productForModifiers.products.products_modifiers.find((pm: any) => pm.modifier_group_id === parseInt(groupId))
                                                    if (modifierGroup) {
                                                        const modifier = modifierGroup.modifier_groups.modifiers.find((m: any) => m.id === modifierId)
                                                        if (modifier) {
                                                            return total + modifier.price_adjustment
                                                        }
                                                    }
                                                    return total
                                                }, 0)).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowModifierDialog(false)
                                        setProductForModifiers(null)
                                        setSelectedModifiers({})
                                    }}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleModifierSelection}
                                    className="flex-1"
                                    disabled={Object.keys(selectedModifiers).length !== productForModifiers.products.products_modifiers.length}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
