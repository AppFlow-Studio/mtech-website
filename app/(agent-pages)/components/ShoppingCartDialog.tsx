import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import React, { useState } from "react"

export default function ShoppingCartDialog({ setActiveTab, setSelectedInquiryForCart, selectedInquiryForCart, inquiries, cartItems, cartMode, clearCart, getCartTotal, getTaxAmount, getGrandTotal, updateQuantity, removeFromCart }: { setActiveTab: (tab: string) => void, setSelectedInquiryForCart: (inquiry: any) => void, selectedInquiryForCart: any, inquiries: any[], cartItems: any[], cartMode: string, clearCart: () => void, getCartTotal: () => number, getTaxAmount: () => number, getGrandTotal: () => number, updateQuantity: (id: string, quantity: number) => void, removeFromCart: (id: string) => void }) {
    const [isCartOpen, setIsCartOpen] = useState(false)
    return (
        {/* Shopping Cart Dialog */ }
        <Dialog open = { isCartOpen } onOpenChange = { setIsCartOpen } >
            <DialogContent className="max-w-2xl sm:max-w-[calc(90vw-2rem)] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Shopping Cart
                        {cartItems.length > 0 && (
                            <Badge variant="outline" className="ml-2">
                                {cartItems.length} items
                            </Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        Review your cart and proceed to checkout
                    </DialogDescription>
                </DialogHeader>

                {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 rounded-full"></div>
                            <div className="relative bg-primary/10 flex items-center justify-center w-fit mx-auto rounded-full p-6">
                                <ShoppingCart className="h-12 w-12 self-center text-primary animate-pulse" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-3">Your cart is empty</h3>
                        <Button
                            onClick={() => {
                                setActiveTab('products')
                                setIsCartOpen(false)
                            }}
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-2"
                        >
                            <Package className="h-5 w-5 mr-2 animate-bounce" />
                            Start Shopping
                            <div className="ml-2 flex space-x-1">
                                <div className="w-1 h-1 bg-primary-foreground rounded-full animate-pulse"></div>
                                <div className="w-1 h-1 bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1 h-1 bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src={item.imageSrc}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm font-medium text-foreground">
                                                ${item.price}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="border-t border-border pt-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax (8%):</span>
                                    <span>${getTaxAmount().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium text-lg border-t border-border pt-2">
                                    <span>Total:</span>
                                    <span className="text-green-600">${getGrandTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Options */}
                        <div className="space-y-4">
                            {selectedInquiryForCart &&
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
                                    </div>
                                </div>
                            }

                            {cartMode === 'inquiry' && (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Select Inquiry:</label>
                                    <select
                                        value={selectedInquiryForCart?.id || ''}
                                        onChange={(e) => {
                                            const inquiry = inquiries?.find(i => i.id === parseInt(e.target.value))
                                            setSelectedInquiryForCart(inquiry || null)
                                        }}
                                        className="w-full px-3 py-2 border border-border rounded-md"
                                    >
                                        <option value="">Choose an inquiry...</option>
                                        {inquiries?.map((inquiry) => (
                                            <option key={inquiry.id} value={inquiry.id}>
                                                {inquiry.name} - {inquiry.item_interested}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={clearCart}
                                    className="flex-1"
                                >
                                    Clear Cart
                                </Button>
                                <Button
                                    onClick={() => {

                                        setIsCartOpen(false)
                                    }}
                                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Assign to Order
                                </Button>
                                <Button
                                    onClick={() => {
                                        // Handle checkout logic here
                                        console.log('Checkout:', {
                                            items: cartItems,
                                            mode: cartMode,
                                            inquiry: selectedInquiryForCart,
                                            total: getGrandTotal()
                                        })
                                        clearCart()
                                        setIsCartOpen(false)
                                    }}
                                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                                >
                                    <Plane className="h-4 w-4 mr-2" />
                                    Submit Order
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
       </ >
    )
}