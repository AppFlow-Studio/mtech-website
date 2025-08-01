'use client'
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Search, Package, DollarSign, Plus, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useProfile } from "@/lib/hooks/useProfile"
import { useGetAgentById, useGetAgentProducts } from "@/app/(master-admin)/master-admin/actions/AgentStore"
import { toast } from "sonner"
import ProductCardWithDialog from "./ProductCardWithDialog"
const tags = [
    "atm parts",
    "pos parts",
    "network devices",
    "atm signage",
    "credit card terminals",
    "pos system",
    "pos accessories",
    "atm machines",
    "scales",
]
export default function AgentProductsTab({
    agent_id,
    addToCart,
    selectedInquiryForCart
}: {
    agent_id: string
    addToCart?: (product: any) => void
    selectedInquiryForCart?: any
}) {
    const { data: agent, isLoading: isAgentLoading } = useGetAgentProducts(agent_id)
    const [productSearchTerm, setProductSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [selectedTags, setSelectedTags] = useState<string[]>([])

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

    const categories = [
        { id: 'all', name: 'All Products' },
        { id: 'pos', name: 'POS Systems' },
        { id: 'atm', name: 'ATM Machines' },
        { id: 'accessories', name: 'Accessories' },
        { id: 'wireless', name: 'Wireless' },
        { id: 'printers', name: 'Printers' },
        { id: 'scales', name: 'Scales' }
    ]

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

    const filteredProducts = agent?.agent_tiers?.agent_product_prices?.filter((agent_product: any) => {
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

    const handleAddToCart = (agent_product: any) => {
        console.log(agent_product)
        if (addToCart) {
            const productForCart = {
                id: agent_product.id,
                name: agent_product.name,
                description: agent_product.description,
                price: agent_product.price,
                imageSrc: agent_product.imageSrc,
                regularPrice: agent_product.default_price,
                category: agent_product.category,
                tags: agent_product.tags,
                inStock: agent_product.inStock
            }
            addToCart(productForCart)
        }
    }

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
                <Badge variant="outline" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    {agent.agent_tiers.name}
                </Badge>
            </div>

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
                            onClick={() => window.location.reload()}
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
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md"
                >
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
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

            {/* Products Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        {filteredProducts?.length || 0} of {agent?.agent_tiers?.agent_product_prices?.length || 0} products
                        {(productSearchTerm || selectedTags.length > 0 || categoryFilter !== 'all') && (
                            <span className="ml-2 text-xs">
                                (filtered)
                            </span>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts?.map((agent_product: any) => (
                        <ProductCardWithDialog key={agent_product.products.id} product={agent_product.products} agent_product_price={agent_product.price} onAddToCart={handleAddToCart} />
                    ))}
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
        </div>
    )
}
