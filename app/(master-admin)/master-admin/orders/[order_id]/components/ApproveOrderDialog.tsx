'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
    CalendarIcon,
    CreditCard,
    Clock,
    DollarSign,
    CheckCircle,
    AlertTriangle,
    User,
    Package,
    CalendarDays,
    ChevronDownIcon
} from 'lucide-react'
import { format, addDays, isAfter, isBefore } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ApproveOrderDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    order: {
        id: string
        order_name: string
        order_confirmation_number: string
        agent: {
            name: string
            email: string
        }
        order_items: Array<{
            products: {
                name: string
            }
            quantity: number
            price_at_order: number
        }>
    }
}

type PaymentFlow = 'pay_now' | 'net_terms'

export default function ApproveOrderDialog({ open, onOpenChange, order }: ApproveOrderDialogProps) {
    const [paymentFlow, setPaymentFlow] = useState<PaymentFlow>('pay_now')
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [customDays, setCustomDays] = useState<string>('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [openCalendar, setOpenCalendar] = useState(false)

    const quickOptions = [
        { label: '10 Days', days: 10 },
        { label: '15 Days', days: 15 },
        { label: '30 Days', days: 30 },
        { label: '45 Days', days: 45 },
        { label: '60 Days', days: 60 },
        { label: '90 Days', days: 90 }
    ]

    const handleQuickOption = (days: number) => {
        setSelectedDate(addDays(new Date(), days))
        setCustomDays(days.toString())
    }

    const handleCustomDaysChange = (value: string) => {
        setCustomDays(value)
        const days = parseInt(value)
        if (!isNaN(days) && days > 0) {
            setSelectedDate(addDays(new Date(), days))
        }
    }

    const handleApprove = async () => {
        setIsProcessing(true)
        // TODO: Implement approval logic
        setTimeout(() => {
            setIsProcessing(false)
            onOpenChange(false)
        }, 2000)
    }

    const calculateDueDate = () => {
        if (!selectedDate) return null
        return format(selectedDate, 'MMMM dd, yyyy')
    }

    const isDateValid = selectedDate ? isAfter(selectedDate, new Date()) : false

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        Approve Order
                    </DialogTitle>
                    <DialogDescription>
                        Review order details and select payment flow for agent
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Summary */}
                    <Card className="border-blue-200 bg-blue-50/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-900">
                                <Package className="h-5 w-5" />
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-blue-700">Order Number</Label>
                                    <p className="text-lg font-semibold text-blue-900">{order.order_confirmation_number}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-blue-700">Total Amount</Label>
                                    <p className="text-lg font-semibold text-blue-900">${order.order_items.reduce((acc: number, item: any) => acc + item.price_at_order * item.quantity, 0).toFixed(2)}</p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-blue-700">Agent</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <User className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-blue-900">{order.agent.name}</span>
                                    <Badge variant="outline" className="text-xs">{order.agent.email}</Badge>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-blue-700">Items</Label>
                                <div className="mt-2 space-y-1">
                                    {order.order_items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-blue-800">{item.products?.name} (x{item.quantity})</span>
                                            <span className="font-medium text-blue-900">${(item.price_at_order * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Flow Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Payment Flow
                            </CardTitle>
                            <CardDescription>
                                Choose how the agent will handle payment for this order
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={paymentFlow} onValueChange={(value) => setPaymentFlow(value as PaymentFlow)} className="space-y-4">
                                {/* Pay Now Option */}
                                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <RadioGroupItem value="pay_now" id="pay_now" className="mt-1" />
                                    <div className="flex-1">
                                        <Label htmlFor="pay_now" className="flex items-center gap-2 text-base font-semibold cursor-pointer">
                                            <CreditCard className="h-4 w-4 text-green-600" />
                                            Pay Now
                                        </Label>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Agent will receive an email notification and see this payment due on their dashboard.
                                            Payment will be captured when they use their card.
                                        </p>
                                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                            <div className="flex items-center gap-2 text-sm text-green-800">
                                                <CheckCircle className="h-4 w-4" />
                                                <span className="font-medium">Immediate payment required</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Net Terms Option */}
                                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <RadioGroupItem value="net_terms" id="net_terms" className="mt-1" />
                                    <div className="flex-1">
                                        <Label htmlFor="net_terms" className="flex items-center gap-2 text-base font-semibold cursor-pointer">
                                            <Clock className="h-4 w-4 text-blue-600" />
                                            Net Terms
                                        </Label>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Agent will receive extended payment terms. They must pay by the specified due date.
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>

                    {/* Net Terms Configuration */}
                    {paymentFlow === 'net_terms' && (
                        <Card className="border-blue-200 bg-blue-50/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-900">
                                    <CalendarDays className="h-5 w-5" />
                                    Payment Terms Configuration
                                </CardTitle>
                                <CardDescription>
                                    Set the payment due date for the agent
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Quick Options */}
                                <div>
                                    <Label className="text-sm font-medium text-blue-700 mb-3 block">Quick Options</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {quickOptions.map((option) => (
                                            <Button
                                                key={option.days}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleQuickOption(option.days)}
                                                className={cn(
                                                    "text-xs",
                                                    selectedDate &&
                                                        format(selectedDate, 'yyyy-MM-dd') === format(addDays(new Date(), option.days), 'yyyy-MM-dd')
                                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                                        : ""
                                                )}
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Custom Days Input */}
                                <div>
                                    <Label htmlFor="custom-days" className="text-sm font-medium text-blue-700">
                                        Custom Days
                                    </Label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Input
                                            id="custom-days"
                                            type="number"
                                            placeholder="Enter number of days"
                                            value={customDays}
                                            onChange={(e) => handleCustomDaysChange(e.target.value)}
                                            className="flex-1"
                                            min="1"
                                        />
                                        <span className="text-sm text-gray-600">days</span>
                                    </div>
                                </div>

                                <Separator />

                                {/* Date Input */}
                                <div>
                                    <Label htmlFor="due-date" className="text-sm font-medium text-blue-700 mb-3 block">
                                        Due Date
                                    </Label>
                                    {/* <Input
                                        id="due-date"
                                        type="date"
                                        value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                                        onChange={(e) => {
                                            const date = new Date(e.target.value)
                                            if (!isNaN(date.getTime())) {
                                                setSelectedDate(date)
                                            }
                                        }}
                                        min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                                        className="w-full"
                                    /> */}


                                    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                                        <PopoverTrigger>
                                            <Button
                                                variant="outline"
                                                id="date"
                                                className="w-48 justify-between font-normal"
                                            >
                                                {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0 z-50" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                captionLayout="dropdown"

                                                onSelect={(date) => {
                                                    setSelectedDate(date)
                                                    setOpenCalendar(false)
                                                }}
                                                className="rounded-lg border"
                                            />
                                        </PopoverContent>
                                    </Popover>

                                </div>

                                {/* Due Date Summary */}
                                {selectedDate && (
                                    <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
                                        <div className="flex items-center gap-2 text-blue-900">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span className="font-medium">Payment Due Date:</span>
                                            <span className="font-semibold">{calculateDueDate()}</span>
                                        </div>
                                        {!isDateValid && (
                                            <div className="flex items-center gap-2 mt-2 text-red-600">
                                                <AlertTriangle className="h-4 w-4" />
                                                <span className="text-sm">Please select a future date</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Summary */}
                    <Card className="border-amber-200 bg-amber-50/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-900">
                                <AlertTriangle className="h-5 w-5" />
                                Action Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Order will be approved and marked as ready for fulfillment</span>
                                </div>
                                {paymentFlow === 'pay_now' ? (
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-blue-600" />
                                        <span>Agent will receive immediate payment notification</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        <span>Agent will receive net terms notification with due date: {calculateDueDate() || 'Not set'}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-purple-600" />
                                    <span>Email notification will be sent to {order.agent.email}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <DialogFooter className="gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApprove}
                        disabled={isProcessing || (paymentFlow === 'net_terms' && !isDateValid)}
                        className="min-w-[120px]"
                    >
                        {isProcessing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Approving...
                            </>
                        ) : (
                            'Approve Order'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
