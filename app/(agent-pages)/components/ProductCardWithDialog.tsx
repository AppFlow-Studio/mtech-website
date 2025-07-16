"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Package, Plus } from "lucide-react";
import { toast } from "sonner";

interface Product {
    id: string;
    name: string;
    description: string;
    imageSrc: string;
    default_price: number;
    price: number;
    inStock: boolean;
    tags: string[];
}

interface ProductCardWithDialogProps {
    product: Product;
    agent_product_price: number;
    onAddToCart: (product: Product) => void;
}

export default function ProductCardWithDialog({ product, agent_product_price, onAddToCart }: ProductCardWithDialogProps) {
    const [open, setOpen] = useState(false);
    return (
        <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
                <div className="space-y-4">
                    {/* Product Image */}
                    <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                            src={product.imageSrc}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-foreground text-lg">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">Your Price:</span>
                                <span className="text-lg font-bold text-green-600">
                                    ${agent_product_price}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                {product.inStock ? (
                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        <svg className="w-3 h-3 mr-1 fill-green-500" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                        <svg className="w-3 h-3 mr-1 fill-red-500" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Category Badge */}
                        <div className="flex gap-2">
                            {product.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            <Button className="flex-1" size="sm" onClick={() => setOpen(true)}>
                                <Package className="h-4 w-4 mr-2" />
                                View Details
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    onAddToCart({ ...product, price: agent_product_price });
                                    toast.success('Product added to cart');
                                }}
                                className="hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
            {/* Details Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[calc(80vw-2rem)] w-full border animate-in fade-in-0 zoom-in-95 duration-200">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-foreground">{product.name}</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Detailed product information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col md:flex-row gap-8 mt-4">
                        <div className="flex-shrink-0 w-full md:w-64 h-64 bg-muted rounded-lg flex items-center justify-center overflow-hidden shadow-md">
                            <img
                                src={product.imageSrc}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg text-foreground mb-1">{product.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-foreground ml-4">Your Price:</span>
                                <span className="text-lg font-bold text-green-600">${agent_product_price}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                {product.inStock ? (
                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        <svg className="w-3 h-3 mr-1 fill-green-500" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                        <svg className="w-3 h-3 mr-1 fill-red-500" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2 flex-wrap mt-2">
                                {product.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    size="sm"
                                    onClick={() => {
                                        onAddToCart({ ...product, price: agent_product_price });
                                        setOpen(false);
                                        toast.success('Product added to cart');
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add to Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setOpen(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
} 