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
    const [bulkMarkupPercentage, setBulkMarkupPercentage] = useState('20')
    const [bulkMarkupMultiplier, setBulkMarkupMultiplier] = useState('1.2')
    const [bulkPriceMode, setBulkPriceMode] = useState<'fixed' | 'markup' | 'markup-current'>('fixed')
    const [openMarkupDialog, setOpenMarkupDialog] = useState(false)
    const [selectedProductForMarkup, setSelectedProductForMarkup] = useState<any>(null)
    const [markupPercentage, setMarkupPercentage] = useState('20')
    const [markupMultiplier, setMarkupMultiplier] = useState('1.2')
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
        if (result instanceof Error) {
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

    const handleBulkPriceSet = async () => {
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
        if (result instanceof Error) {
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

    const getBulkPreviewData = () => {
        if (!filteredProducts.length) return null

        let totalCurrentValue = 0
        let totalNewValue = 0
        let sampleProducts = filteredProducts.slice(0, 3)

        if (bulkPriceMode === 'fixed' && bulkPrice) {
            const newPrice = parseFloat(bulkPrice)
            totalCurrentValue = filteredProducts.reduce((sum, product) => sum + (product.price || 0), 0)
            totalNewValue = newPrice * filteredProducts.length
            sampleProducts = sampleProducts.map(product => ({
                ...product,
                newPrice: newPrice
            }))
        } else if (bulkPriceMode === 'markup' && bulkMarkupPercentage) {
            const percentage = parseFloat(bulkMarkupPercentage)
            totalCurrentValue = filteredProducts.reduce((sum, product) => sum + (product.price || 0), 0)
            totalNewValue = filteredProducts.reduce((sum, product) => {
                const newPrice = calculateMarkupPrice((product as any).default_price || 0, percentage)
                return sum + newPrice
            }, 0)
            sampleProducts = sampleProducts.map(product => ({
                ...product,
                newPrice: calculateMarkupPrice((product as any).default_price || 0, percentage)
            }))
        } else if (bulkPriceMode === 'markup-current' && bulkMarkupPercentage) {
            const percentage = parseFloat(bulkMarkupPercentage)
            totalCurrentValue = filteredProducts.reduce((sum, product) => sum + (product.price || 0), 0)
            totalNewValue = filteredProducts.reduce((sum, product) => {
                const newPrice = calculateMarkupPrice(product.price || 0, percentage)
                return sum + newPrice
            }, 0)
            sampleProducts = sampleProducts.map(product => ({
                ...product,
                newPrice: calculateMarkupPrice(product.price || 0, percentage)
            }))
        }

        return {
            totalCurrentValue,
            totalNewValue,
            sampleProducts,
            productCount: filteredProducts.length
        }
    }

    const handleBulkMarkupSet = async () => {
        if (!bulkMarkupPercentage) return

        const percentage = parseFloat(bulkMarkupPercentage)
        const updatedPrices = productPrices.map((product: any) => {
            const matchingProduct = filteredProducts.find(p => p.id === product.id)
            if (matchingProduct) {
                const newPrice = calculateMarkupPrice((matchingProduct as any).default_price || 0, percentage)
                return { ...product, price: newPrice }
            }
            return product
        })

        setProductPrices(updatedPrices)
        setOpenBulkPriceDialog(false)
        setBulkMarkupPercentage('20')
        setBulkMarkupMultiplier('1.2')
    }

    const handleBulkMarkupCurrentSet = async () => {
        if (!bulkMarkupPercentage) return

        const percentage = parseFloat(bulkMarkupPercentage)
        const updatedPrices = productPrices.map((product: any) => {
            const matchingProduct = filteredProducts.find(p => p.id === product.id)
            if (matchingProduct) {
                const newPrice = calculateMarkupPrice(matchingProduct.price || 0, percentage)
                return { ...product, price: newPrice }
            }
            return product
        })

        setProductPrices(updatedPrices)
        setOpenBulkPriceDialog(false)
        setBulkMarkupPercentage('20')
        setBulkMarkupMultiplier('1.2')
    }

    const openMarkupCalculator = (product: any) => {
        setSelectedProductForMarkup(product)
        setOpenMarkupDialog(true)
    }

    const calculateMarkupPrice = (basePrice: number, percentage: number) => {
        return basePrice * (1 + percentage / 100)
    }

    const calculateMultiplierPrice = (basePrice: number, multiplier: number) => {
        return basePrice * multiplier
    }

    const applyMarkupPrice = () => {
        if (!selectedProductForMarkup) return

        const basePrice = selectedProductForMarkup.default_price || 0
        let newPrice = 0

        if (markupPercentage) {
            newPrice = calculateMarkupPrice(basePrice, parseFloat(markupPercentage))
        } else if (markupMultiplier) {
            newPrice = calculateMultiplierPrice(basePrice, parseFloat(markupMultiplier))
        }

        if (productPrices) {
            setProductPrices(productPrices.map((p: any) => ({
                ...p,
                price: p.id === selectedProductForMarkup.id ? newPrice : p.price
            })))
        }

        setOpenMarkupDialog(false)
        setSelectedProductForMarkup(null)
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
                <DialogContent
                    onInteractOutside={(e) => {
                        e.preventDefault();
                    }}
                    onEscapeKeyDown={(e) => {
                        e.preventDefault();
                    }}
                    className="w-full max-w-[calc(100%-2rem)] sm:max-w-7xl max-h-[90vh] overflow-y-auto">
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
                            const purchaseCost = product.default_price || 0
                            return (
                                <div key={product.id} className="p-4 border border-border rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
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
                                                }}
                                                className="w-24"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    {/* Purchase Cost and Markup Section */}
                                    <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">Purchase Cost:</span>
                                                <span className="ml-2 font-medium text-foreground">${purchaseCost.toFixed(2)}</span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">Current Markup:</span>
                                                <span className={`ml-2 font-medium ${currentPrice > purchaseCost ? 'text-green-600' : 'text-red-600'}`}>
                                                    {purchaseCost > 0 ? ((currentPrice - purchaseCost) / purchaseCost * 100).toFixed(1) : '0'}%
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openMarkupCalculator(product)}
                                            className="flex items-center gap-2"
                                        >
                                            <Tag className="h-4 w-4" />
                                            Markup Calculator
                                        </Button>
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
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Bulk Set Prices
                        </DialogTitle>
                        <DialogDescription>
                            Set prices for all {getVisibleProductsCount()} visible products
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Mode Selection */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">
                                Pricing Mode
                            </label>
                            <div className="flex space-x-2">
                                <Button
                                    variant={bulkPriceMode === 'fixed' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setBulkPriceMode('fixed')}
                                >
                                    Fixed Price
                                </Button>
                                <Button
                                    variant={bulkPriceMode === 'markup' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setBulkPriceMode('markup')}
                                >
                                    Markup from Cost
                                </Button>
                                <Button
                                    variant={bulkPriceMode === 'markup-current' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setBulkPriceMode('markup-current')}
                                >
                                    Markup from Current
                                </Button>
                            </div>
                        </div>

                        {/* Fixed Price Mode */}
                        {bulkPriceMode === 'fixed' && (
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Price per Product
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={bulkPrice}
                                    onChange={(e) => {
                                        setBulkPrice(e.target.value)
                                        setBulkPriceError('')
                                    }}
                                    placeholder="0.00"
                                    className={bulkPriceError ? 'border-red-500' : ''}
                                />
                                {bulkPriceError && (
                                    <p className="text-sm text-red-500 mt-1">{bulkPriceError}</p>
                                )}
                            </div>
                        )}

                        {/* Markup Mode */}
                        {(bulkPriceMode === 'markup' || bulkPriceMode === 'markup-current') && (
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Markup Percentage
                                </label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={bulkMarkupPercentage}
                                        onChange={(e) => {
                                            setBulkMarkupPercentage(e.target.value)
                                            if (e.target.value) {
                                                const percentage = parseFloat(e.target.value)
                                                setBulkMarkupMultiplier((1 + percentage / 100).toFixed(2))
                                            }
                                        }}
                                        placeholder="20"
                                        className="flex-1"
                                    />
                                    <span className="text-sm text-muted-foreground">%</span>
                                </div>
                                <div className="flex space-x-2 mt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setBulkMarkupPercentage('10')
                                            setBulkMarkupMultiplier('1.1')
                                        }}
                                    >
                                        10%
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setBulkMarkupPercentage('20')
                                            setBulkMarkupMultiplier('1.2')
                                        }}
                                    >
                                        20%
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setBulkMarkupPercentage('50')
                                            setBulkMarkupMultiplier('1.5')
                                        }}
                                    >
                                        50%
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setBulkMarkupPercentage('100')
                                            setBulkMarkupMultiplier('2.0')
                                        }}
                                    >
                                        100%
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {bulkPriceMode === 'markup'
                                        ? 'Markup will be applied to each product\'s purchase cost'
                                        : 'Markup will be applied to each product\'s current agent price'
                                    }
                                </p>
                            </div>
                        )}

                        {/* Preview Section */}
                        {(() => {
                            const previewData = getBulkPreviewData()
                            if (!previewData) return null

                            return (
                                <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                                    <h4 className="text-sm font-medium text-foreground">Preview</h4>

                                    {/* Summary Stats */}
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Products to update:</span>
                                            <span className="ml-2 font-medium">{previewData.productCount}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Current total value:</span>
                                            <span className="ml-2 font-medium">${previewData.totalCurrentValue.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">New total value:</span>
                                            <span className="ml-2 font-medium text-green-600">${previewData.totalNewValue.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Value change:</span>
                                            <span className={`ml-2 font-medium ${previewData.totalNewValue >= previewData.totalCurrentValue ? 'text-green-600' : 'text-red-600'}`}>
                                                {previewData.totalNewValue >= previewData.totalCurrentValue ? '+' : ''}${(previewData.totalNewValue - previewData.totalCurrentValue).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Sample Products */}
                                    <div>
                                        <h5 className="text-xs font-medium text-muted-foreground mb-2">Sample Products</h5>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {previewData.sampleProducts.map((product: any) => (
                                                <div key={product.id} className="flex items-center justify-between text-sm p-2 bg-background rounded border">
                                                    <span className="truncate flex-1">{product.name}</span>
                                                    <span className="text-muted-foreground ml-2">
                                                        ${product.price?.toFixed(2)} → <span className="font-medium text-green-600">${product.newPrice?.toFixed(2)}</span>
                                                    </span>
                                                </div>
                                            ))}
                                            {previewData.productCount > 3 && (
                                                <div className="text-xs text-muted-foreground text-center py-1">
                                                    +{previewData.productCount - 3} more products
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })()}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setOpenBulkPriceDialog(false)}>
                            Cancel
                        </Button>
                        {bulkPriceMode === 'fixed' ? (
                            <Button
                                onClick={handleBulkPriceSet}
                                disabled={!bulkPrice || !!bulkPriceError}
                            >
                                Apply Fixed Price
                            </Button>
                        ) : bulkPriceMode === 'markup' ? (
                            <Button
                                onClick={handleBulkMarkupSet}
                                disabled={!bulkMarkupPercentage}
                            >
                                Apply Markup from Cost
                            </Button>
                        ) : (
                            <Button
                                onClick={handleBulkMarkupCurrentSet}
                                disabled={!bulkMarkupPercentage}
                            >
                                Apply Markup from Current
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Markup Calculator Dialog */}
            <Dialog open={openMarkupDialog} onOpenChange={setOpenMarkupDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Tag className="h-5 w-5 text-primary" />
                            Markup Calculator
                        </DialogTitle>
                        <DialogDescription>
                            Calculate sale price based on purchase cost for {selectedProductForMarkup?.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Product Info */}
                        {selectedProductForMarkup && (
                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={selectedProductForMarkup.imageSrc}
                                        alt={selectedProductForMarkup.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <h4 className="font-medium text-foreground">{selectedProductForMarkup.name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Purchase Cost: <span className="font-medium">${selectedProductForMarkup.default_price?.toFixed(2) || '0.00'}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Markup Percentage */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Markup Percentage
                            </label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={markupPercentage}
                                    onChange={(e) => {
                                        setMarkupPercentage(e.target.value)
                                        if (e.target.value && selectedProductForMarkup) {
                                            const percentage = parseFloat(e.target.value)
                                            const newPrice = calculateMarkupPrice(selectedProductForMarkup.default_price || 0, percentage)
                                            setMarkupMultiplier((newPrice / (selectedProductForMarkup.default_price || 1)).toFixed(2))
                                        }
                                    }}
                                    placeholder="20"
                                    className="flex-1"
                                />
                                <span className="text-sm text-muted-foreground">%</span>
                            </div>
                            {markupPercentage && selectedProductForMarkup && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Sale Price: <span className="font-medium text-green-600">
                                        ${calculateMarkupPrice(selectedProductForMarkup.default_price || 0, parseFloat(markupPercentage)).toFixed(2)}
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Markup Multiplier */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Markup Multiplier
                            </label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={markupMultiplier}
                                    onChange={(e) => {
                                        setMarkupMultiplier(e.target.value)
                                        if (e.target.value && selectedProductForMarkup) {
                                            const multiplier = parseFloat(e.target.value)
                                            const newPrice = calculateMultiplierPrice(selectedProductForMarkup.default_price || 0, multiplier)
                                            setMarkupPercentage(((newPrice - (selectedProductForMarkup.default_price || 0)) / (selectedProductForMarkup.default_price || 1) * 100).toFixed(1))
                                        }
                                    }}
                                    placeholder="1.2"
                                    className="flex-1"
                                />
                                <span className="text-sm text-muted-foreground">×</span>
                            </div>
                            {markupMultiplier && selectedProductForMarkup && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Sale Price: <span className="font-medium text-green-600">
                                        ${calculateMultiplierPrice(selectedProductForMarkup.default_price || 0, parseFloat(markupMultiplier)).toFixed(2)}
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Quick Markup Buttons */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Quick Markup Options
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setMarkupPercentage('10')
                                        setMarkupMultiplier('1.1')
                                    }}
                                >
                                    10% Markup
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setMarkupPercentage('20')
                                        setMarkupMultiplier('1.2')
                                    }}
                                >
                                    20% Markup
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setMarkupPercentage('50')
                                        setMarkupMultiplier('1.5')
                                    }}
                                >
                                    50% Markup
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setMarkupPercentage('100')
                                        setMarkupMultiplier('2.0')
                                    }}
                                >
                                    2× Price
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setOpenMarkupDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={applyMarkupPrice}>
                            Apply Markup
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}