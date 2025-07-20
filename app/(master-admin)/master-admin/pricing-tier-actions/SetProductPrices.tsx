'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DollarSign, Search, Loader2, AlertCircle, Filter, Tag, Package, Zap, Monitor, Smartphone, CreditCard, Printer, Scale, Wifi, Settings } from "lucide-react"
import { useProducts } from "../actions/ProductsServerState"
import { useEffect, useState } from "react"
import { useTierAndProducts } from "../actions/TeirsStores"
import { Product } from "@/lib/types"
import { updateTierPrices } from "./update-tier-prices"
import { toast } from "sonner"
import { PostgrestError } from "@supabase/supabase-js"
import { Badge } from "@/components/ui/badge"
import { useTags } from "../components/TagContext"
import { bulkUpdateProducts } from "../product-actions/bulk-update-products"

export type Tier = {
    id: string;
    name: string;
    description: string;
    commission_rate: number;
    agent_product_prices: {
        id: string;
        agent_tier_id: string;
        product_id: string;
        price: number;
        products: Product;
    }[];
}

const tags =  [
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
export default function SetProductPricesPopup({ tier }: { tier: Tier }) {
    const [pricingSearchTerm, setPricingSearchTerm] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    // const { tags } = useTags()

    const [open, setOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState({ min: '', max: '' })
    const [openBulkPriceDialog, setOpenBulkPriceDialog] = useState(false)
    const [bulkPrice, setBulkPrice] = useState('')
    const [bulkPriceError, setBulkPriceError] = useState('')
    const { data: tierAndProducts, isLoading, isError, refetch } = useTierAndProducts(tier.id)
    const [productPrices, setProductPrices] = useState<{ id: string, price: number, agent_product_id: string }[]>([])
    //console.log('Product Prices', productPrices)
    //console.log(productPrices)
    //console.log('productPrices', tierAndProducts)
    useEffect(() => {
        if (tierAndProducts && productPrices.length === 0) {
            setProductPrices(tierAndProducts?.agent_product_prices.map((product) => ({ ...product.products, price: product.price, agent_product_id: product.id })))
        }
    }, [tierAndProducts, isLoading])
    const onUpdate = async () => {
        if (!productPrices) return
        setIsSaving(true)
        const result = await bulkUpdateProducts(productPrices.map((product: any) => ({ product_id: product.id, agent_tier_id: tier.id, price: product.price })))   
        if(result instanceof Error){
            toast.error('Failed to update prices')
            console.error(result)
        } else {
            toast.success(`Updated ${filteredProducts.length} products`)
            setIsSaving(false)
            refetch()
        }
    }
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-3">
                    <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Loading tier pricing data...
                    </div>
                </div>
            </div>
        )
    }
    if (isError) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-3">
                    <div className="flex justify-center">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <div className="text-sm font-medium text-foreground">
                        Failed to load pricing data
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Please try refreshing the page
                    </div>
                </div>
            </div>
        )
    }

    // Product categories and tags
    const categories = [
        { id: 'all', name: 'All Products', icon: Package },
        { id: 'pos', name: 'POS Systems', icon: Monitor },
        { id: 'atm', name: 'ATM Machines', icon: CreditCard },
        { id: 'accessories', name: 'Accessories', icon: Settings },
        { id: 'wireless', name: 'Wireless', icon: Wifi },
        { id: 'printers', name: 'Printers', icon: Printer },
        { id: 'scales', name: 'Scales', icon: Scale },
        { id: 'mobile', name: 'Mobile', icon: Smartphone }
    ]


    // Filter products based on all criteria
    const filteredProducts = productPrices?.filter((product: any) => {
        const matchesSearch = product.name?.toLowerCase().includes(pricingSearchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(pricingSearchTerm.toLowerCase())

        const matchesCategory = selectedCategory === 'all' ||
            (product.category && product.category.toLowerCase() === selectedCategory) ||
            (product.name && product.name.toLowerCase().includes(selectedCategory))

        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some(tag =>
                product.name?.toLowerCase().includes(tag.toLowerCase()) ||
                product.description?.toLowerCase().includes(tag.toLowerCase()) ||
                product.tags?.some((productTag: string) => productTag.toLowerCase().includes(tag.toLowerCase()))
            )

        const matchesPriceRange = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
            (!priceRange.max || product.price <= parseFloat(priceRange.max))

        return matchesSearch && matchesCategory && matchesTags && matchesPriceRange
    }) || []

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        )
    }

    const clearAllFilters = () => {
        setSelectedCategory('all')
        setSelectedTags([])
        setPriceRange({ min: '', max: '' })
        setPricingSearchTerm('')
    }

    const hasActiveFilters = selectedCategory !== 'all' || selectedTags.length > 0 || priceRange.min || priceRange.max

    const handleBulkPriceSet =  async () => {
        if (!bulkPrice || isNaN(parseFloat(bulkPrice))) {
            setBulkPriceError('Please enter a valid price')
            return
        }

        const price = parseFloat(bulkPrice)
        if (price < 0) {
            setBulkPriceError('Price cannot be negative')
            return
        }

        setBulkPriceError('')
        setProductPrices(productPrices.map((p: any) => 
            filteredProducts.some((fp: any) => fp.id === p.id)
                ? { ...p, price }
                : p
        ));
        const result = await bulkUpdateProducts(filteredProducts.map((product: any) => ({ product_id: product.id, agent_tier_id: tier.id, price })))   
        if(result instanceof Error){
            toast.error('Failed to update prices')
            console.error(result)
        } else {
            toast.success(`Updated ${filteredProducts.length} products to $${price?.toFixed(2)}`)
            setOpenBulkPriceDialog(false)
            setBulkPrice('')
            refetch()
        }
    }

    const getVisibleProductsCount = () => {
        return filteredProducts.length
    }


    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full"

                    >
                        <DollarSign className="h-3 w-3 mr-1" />
                        Manage Product Prices
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-7xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Product Pricing for {tier.name}
                        </DialogTitle>
                        <DialogDescription>
                            Set individual product prices for this tier. Each product can have a different price for different agent tiers.
                        </DialogDescription>
                    </DialogHeader>
                    {/* Search and Bulk Actions */}
                    <div className="flex gap-4 mb-6 w-full">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={pricingSearchTerm}
                                onChange={(e) => setPricingSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setOpenBulkPriceDialog(true)}
                            disabled={filteredProducts.length === 0}
                        >
                            Bulk Set Price ({getVisibleProductsCount()} products)
                        </Button>
                    </div>
                    {/* Tags and Product Filters */}
                    <div className="space-y-4 mb-6">
                        {/* Tags Filter */}
                        <div>
                            <h4 className="text-sm font-medium text-foreground mb-3">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Button
                                        key={tag}
                                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleTagToggle(tag)}
                                        className="text-xs"
                                    >
                                        <Tag className="h-3 w-3 mr-1" />
                                        {tag}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <h4 className="text-sm font-medium text-foreground mb-3">Price Range</h4>
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Min:</span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                        className="w-24"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Max:</span>
                                    <Input
                                        type="number"
                                        placeholder="999.99"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                        className="w-24"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Filter Summary and Clear */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {filteredProducts.length} of {productPrices?.length || 0} products
                                </span>
                                {hasActiveFilters && (
                                    <Badge variant="secondary" className="text-xs">
                                        Filtered
                                    </Badge>
                                )}
                            </div>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAllFilters}
                                    className="text-xs"
                                >
                                    Clear All Filters
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredProducts.map((product: any) => {
                            const currentPrice = product.price
                            return (
                                <div key={product.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                            <img
                                                src={product.imageSrc}
                                                alt={product.name}
                                                className="w-8 h-8 object-cover rounded"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-foreground">{product.name}</h4>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {product.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-muted-foreground">$</span>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={currentPrice}
                                            key={product.id}

                                            onChange={(e) => {
                                                const newPrice = parseFloat(e.target.value)
                                                if (productPrices) {
                                                    setProductPrices(productPrices.map((p: any) => ({ ...p, price: p.id === product.id ? newPrice : p.price })))
                                                }
                                                // TODO: Update tier in database
                                            }}
                                            className="w-24"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                            {productPrices?.length} of {productPrices?.length || 0} products priced
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
                                Cancel
                            </Button>
                            <Button onClick={onUpdate} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save All Prices"
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Bulk Price Dialog */}
            <Dialog open={openBulkPriceDialog} onOpenChange={setOpenBulkPriceDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Bulk Set Prices
                        </DialogTitle>
                        <DialogDescription>
                            Set the same price for all {getVisibleProductsCount()} visible products
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Price Input */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Price per Product
                            </label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={bulkPrice}
                                    onChange={(e) => {
                                        setBulkPrice(e.target.value)
                                        if (bulkPriceError) setBulkPriceError('')
                                    }}
                                    placeholder="0.00"
                                    className="pl-8"
                                    autoFocus
                                />
                            </div>
                            {bulkPriceError && (
                                <p className="text-sm text-destructive mt-1">{bulkPriceError}</p>
                            )}
                        </div>

                        {/* Preview */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-foreground mb-2">Preview</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Products to update:</span>
                                    <span className="font-medium">{getVisibleProductsCount()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">New price:</span>
                                    <span className="font-medium">
                                        {bulkPrice ? `$${parseFloat(bulkPrice).toFixed(2)}` : '$0.00'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total value:</span>
                                    <span className="font-medium">
                                        {bulkPrice ? `$${(parseFloat(bulkPrice) * getVisibleProductsCount()).toFixed(2)}` : '$0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sample Products */}
                        <div>
                            <h4 className="text-sm font-medium text-foreground mb-2">Sample Products</h4>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {filteredProducts.slice(0, 3).map((product: any) => (
                                    <div key={product.id} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded">
                                        <span className="truncate flex-1">{product.name}</span>
                                        <span className="text-muted-foreground ml-2">
                                            ${product?.price?.toFixed(2)} → {bulkPrice ? `$${parseFloat(bulkPrice).toFixed(2)}` : '$0.00'}
                                        </span>
                                    </div>
                                ))}
                                {filteredProducts.length > 3 && (
                                    <div className="text-xs text-muted-foreground text-center py-1">
                                        +{filteredProducts.length - 3} more products
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpenBulkPriceDialog(false)
                                setBulkPrice('')
                                setBulkPriceError('')
                            }}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBulkPriceSet}
                            disabled={!bulkPrice || isNaN(parseFloat(bulkPrice)) || parseFloat(bulkPrice) < 0}
                            className="flex-1"
                        >
                            Update {getVisibleProductsCount()} Products
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}