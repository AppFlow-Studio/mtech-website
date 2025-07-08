'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DollarSign, Search, Loader2, AlertCircle } from "lucide-react"
import { useProducts } from "../actions/ProductsServerState"
import { useEffect, useState } from "react"
import { useTierAndProducts } from "../actions/TeirsStores"
import { Product } from "@/lib/types"
import { updateTierPrices } from "./update-tier-prices"
import { toast } from "sonner"

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

export default function SetProductPricesPopup({ tier }: { tier: Tier }) {
    const [pricingSearchTerm, setPricingSearchTerm] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [open, setOpen] = useState(false)
    const { data: tierAndProducts, isLoading, isError } = useTierAndProducts(tier.id)
    const [productPrices, setProductPrices] = useState<{ id: string, price: number, agent_product_id: string }[]>([])
    //console.log('Product Prices', productPrices)
    //console.log(productPrices)
    //console.log('productPrices', tierAndProducts)
    useEffect(() => {
        if (tierAndProducts) {
            setProductPrices(tierAndProducts?.agent_product_prices.map((product) => ({ ...product.products, price: product.price, agent_product_id: product.id })))
        }
    }, [tierAndProducts, isLoading])
    const onUpdate = async () => {
        if (!productPrices) return
        setIsSaving(true)
        try {
            const result = await updateTierPrices(tier.id, productPrices.map((product) => ({ id: product.agent_product_id, price: product.price })))
            if (result) {
                toast.success('Prices updated successfully')
                setOpen(false) // Close dialog on success
            } else {
                toast.error('Failed to update prices')
            }
        } catch (error) {
            toast.error('Error updating prices')
            console.error(error)
        } finally {
            setIsSaving(false)
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
    return (
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
            <DialogContent className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Product Pricing for {tier.name}
                    </DialogTitle>
                    <DialogDescription>
                        Set individual product prices for this tier. Each product can have a different price for different agent tiers.
                    </DialogDescription>
                </DialogHeader>

                {/* Search and Bulk Actions */}
                <div className="flex gap-4 mb-6">
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
                        onClick={() => {
                            // Bulk set price for all visible products
                            const visibleProducts = productPrices?.filter((product: any) =>
                                product.name?.toLowerCase().includes(pricingSearchTerm.toLowerCase()) ||
                                product.description?.toLowerCase().includes(pricingSearchTerm.toLowerCase())
                            ) || []
                            const newPrice = prompt('Enter price for all visible products:')
                            if (newPrice && !isNaN(parseFloat(newPrice)) && productPrices) {
                                const price = parseFloat(newPrice)
                                setProductPrices(productPrices.map((product: any) => ({ ...product, price })))
                                //setSelectedTier(updatedTier)
                                // TODO: Update tier in database
                            }
                        }}
                    >
                        Bulk Set Price
                    </Button>
                </div>

                <div className="space-y-4">
                    {productPrices?.filter((product: any) =>
                        product.name?.toLowerCase().includes(pricingSearchTerm.toLowerCase()) ||
                        product.description?.toLowerCase().includes(pricingSearchTerm.toLowerCase())
                    )
                        .map((product: any) => {
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
    )
}