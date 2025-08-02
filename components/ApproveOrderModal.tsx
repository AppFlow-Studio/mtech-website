import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle, AlertCircle, DollarSign, Package, Mail, User } from 'lucide-react'
import { toast } from 'sonner'

interface QuoteRequestItem {
    id: string
    product_name: string
    quantity: number
    quoted_price?: number
    product?: {
        name: string
        default_price: number
    }
}

interface ApproveOrderModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    quoteRequest: {
        id: string
        customer_name: string
        customer_last_name: string
        customer_email: string
        customer_company?: string
        quote_request_items: QuoteRequestItem[]
    }
    onApprove: () => void
}

export default function ApproveOrderModal({
    open,
    onOpenChange,
    quoteRequest,
    onApprove
}: ApproveOrderModalProps) {
    const [isApproving, setIsApproving] = useState(false)

    const getTotalValue = () => {
        return quoteRequest.quote_request_items.reduce((total: number, item: QuoteRequestItem) => {
            const price = item.quoted_price || item.product?.default_price || 0
            return total + (price * item.quantity)
        }, 0)
    }

    const handleApprove = async () => {
        setIsApproving(true)
        await onApprove()
        setIsApproving(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[calc(100vw-2rem)] w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Approve Quote Request
                    </DialogTitle>
                    <DialogDescription>
                        Confirm that you want to approve this quote request and convert it to an order.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Warning Alert */}
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-amber-800 dark:text-amber-200">
                                    Important: Customer Notification
                                </h4>
                                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                    Once approved, the customer will receive an email with order details and a secure checkout link.
                                    They will be able to log in and complete their purchase.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <Card>
                        <CardContent className="pt-6 ">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-medium">Customer Information</h3>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">
                                        {quoteRequest.customer_name} {quoteRequest.customer_last_name}
                                    </p>
                                </div>
                                <div className='overflow-ellipsis'>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {quoteRequest.customer_email}
                                    </p>
                                </div>
                                {quoteRequest.customer_company && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-muted-foreground">Company</p>
                                        <p className="font-medium">{quoteRequest.customer_company || 'Not Provided'}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-medium">Order Summary</h3>
                            </div>
                            <div className="space-y-3">
                                {quoteRequest.quote_request_items.map((item) => {
                                    const price = item.quoted_price || item.product?.default_price || 0
                                    return (
                                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                                            <div className="flex-1">
                                                <p className="font-medium">{item.product_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Qty: {item.quantity} × ${price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">${(price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span className="font-medium">Total Amount</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-green-600">
                                        ${getTotalValue().toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What Happens Next */}
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-medium mb-3">What happens next?</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-medium text-green-600">1</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Order Created</p>
                                        <p className="text-sm text-muted-foreground">
                                            A new order will be created with all the quoted prices and items.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-medium text-green-600">2</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Customer Notification</p>
                                        <p className="text-sm text-muted-foreground">
                                            Customer will receive an email with order details and secure checkout link.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-medium text-green-600">3</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Customer Checkout</p>
                                        <p className="text-sm text-muted-foreground">
                                            Customer can log in and complete their purchase with the quoted prices.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isApproving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApprove}
                        disabled={isApproving}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isApproving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Approving...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Order
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
} 