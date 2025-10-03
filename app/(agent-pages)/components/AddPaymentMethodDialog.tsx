'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
    CreditCard,
    Lock,
    User,
    Calendar,
    Shield,
    Plus,
    X
} from 'lucide-react'
import { toast } from 'sonner'
import { addPaymentCard } from '../agent/profile-handling/add-payment-card'
import { Profile } from '@/lib/hooks/useProfile'
import { transactionStatusCheck } from '../agent/order/[order_id]/actions/transaction-status-check'
import { linkPaymentCardToAgent } from '../agent/profile-handling/link-payment-card-to-agent'
import { Sheet } from 'react-modal-sheet'

interface AddPaymentMethodDialogProps {
    agent: Profile | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onPaymentMethodAdded?: () => void
}

interface PaymentFormData {
    cardNumber: string
    expiryDate: string
    cvv: string
    cardholderName: string
}


export default function AddPaymentMethodDialog({
    agent,
    open,
    onOpenChange,
    onPaymentMethodAdded
}: AddPaymentMethodDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [paymentToken, setPaymentToken] = useState<string | null>(null)
    const [postData, setPostData] = useState(null); // State to hold postData function

    const [formData, setFormData] = useState<PaymentFormData>({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
    })

    const handleInputChange = (field: keyof PaymentFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const formatCardNumber = (value: string) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '')
        // Add spaces every 4 digits
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
    }

    const formatExpiryDate = (value: string) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '')
        // Add slash after 2 digits
        if (digits.length >= 2) {
            return digits.substring(0, 2) + '/' + digits.substring(2, 4)
        }
        return digits
    }

    const handleCardNumberChange = (value: string) => {
        const formatted = formatCardNumber(value)
        if (formatted.replace(/\s/g, '').length <= 16) {
            handleInputChange('cardNumber', formatted)
        }
    }

    const handleExpiryDateChange = (value: string) => {
        const formatted = formatExpiryDate(value)
        if (formatted.replace(/\D/g, '').length <= 4) {
            handleInputChange('expiryDate', formatted)
        }
    }

    const handleCvvChange = (value: string) => {
        const digits = value.replace(/\D/g, '')
        if (digits.length <= 4) {
            handleInputChange('cvv', digits)
        }
    }

    const getCardType = (cardNumber: string) => {
        const number = cardNumber.replace(/\s/g, '')
        if (number.startsWith('4')) return 'Visa'
        if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard'
        if (number.startsWith('3')) return 'American Express'
        return 'Card'
    }


    useEffect(() => {
        loadScript(); // Load the external script on component mount
    }, []);


    const loadScript = () => {
        if (!process.env.NEXT_PUBLIC_DEJAVOO_TOKEN) {
            alert('No Dejavoo token found. Please set the NEXT_PUBLIC_DEJAVOO_TOKEN environment variable.')
            return
        }
        const script = document.createElement('script');
        script.src = 'https://payment.ipospays.tech/ftd/v1/freedomtodesign.js';
        script.id = 'ftd';
        script.setAttribute('security_key', process.env.NEXT_PUBLIC_DEJAVOO_TOKEN || ''); // Replace with your actual security key


        script.onload = () => {
            console.log('Script loaded successfully');
            // Check if postData is defined after the script loads
            if (typeof window.postData === 'function') {
                setPostData(() => window.postData); // Set postData in state
            } else {
                console.error('postData function is not defined'); // Log if postData is not available
            }
        };


        script.onerror = (error) => {
            console.error('Failed to load script', error);
            alert('Failed to load payment script. Please check your connection or the script URL.');
        };


        document.body.appendChild(script); // Append the script to the document
    };


    const submitCardFunc = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setIsLoading(true)
        if (!agent) {
            toast.error('Agent not found');
            return;
        }
        if (!postData) {
            console.error('postData function is not set');
            return; // Exit if postData is not available
        }
        if (!postData) {
            console.error('postData function is not available');
            return; // Exit if postData is not available
        }
        try {
            const response = await postData(); // Call postData function
            console.log('Payment Token:', response); // Log the payment token
            if (
                !response.payment_token_id
            ) {
                toast.error('Error adding payment method:', {
                    description: 'Payment token not found'
                });
                return
            }

            const result = await addPaymentCard(response.payment_token_id, agent.id, agent.email || '', agent.first_name + ' ' + agent.last_name, agent.phone_number || '')

            if (result.success) {
                onPaymentMethodAdded?.()
                toast.success('Payment method added successfully!');
            } else {
                toast.error('Error adding payment method:', {
                    description: result.error || 'Error processing payment'
                });
                return
            }

        } catch (error) {
            toast.error('Error adding payment method:', {
                description: error instanceof Error ? error.message : 'Error processing payment'
            }); // Handle errors
            setIsLoading(false)
        } finally {
            setIsLoading(false)
            onOpenChange(false)
        }
    };

    return (
        <Sheet isOpen={open} onClose={() => onOpenChange(false)}>
            <Sheet.Container>
                <Sheet.Header />

                <Sheet.Content className="">
                    <section className='max-w-4xl mx-auto'>
                        <div className="flex flex-col items-start gap-2">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Add Payment Method
                            </div>
                            <div>
                                Add a new credit or debit card for faster checkout
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Card Preview */}
                            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-6 w-6" />
                                            <span className="font-semibold">
                                                {formData.cardNumber ? getCardType(formData.cardNumber) : 'Card'}
                                            </span>
                                        </div>
                                        <Shield className="h-5 w-5 opacity-70" />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="text-2xl font-mono tracking-wider">
                                            {formData.cardNumber || '•••• •••• •••• ••••'}
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="text-xs opacity-70 mb-1">CARDHOLDER NAME</div>
                                                <div className="text-sm font-medium">
                                                    {formData.cardholderName || 'YOUR NAME'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs opacity-70 mb-1">EXPIRES</div>
                                                <div className="text-sm font-medium">
                                                    {formData.expiryDate || 'MM/YY'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            {/* Payment Form */}
                            <form onSubmit={
                                (e) => {
                                    submitCardFunc(e)
                                    console.log(e.target)
                                }
                            } className="space-y-4">
                                <div className=''>
                                    <label htmlFor="ccnumber">Card Number</label>
                                    <div className="relative mt-1">
                                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input id="ccnumber" placeholder="Card Number"
                                            onChange={(e) => {
                                                handleCardNumberChange(e.target.value)
                                            }}
                                            maxLength={19}
                                            className="file:text-foreground pl-10 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                                    <div className="relative mt-1">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="cardholderName"
                                            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                                            placeholder="John Doe"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label htmlFor="ccexpiry">Expiry Date</label>
                                        <div className="relative mt-1">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <input id="ccexpiry" placeholder="Expiry Date"
                                                maxLength={5}
                                                onChange={(e) => handleExpiryDateChange(e.target.value)}
                                                className="file:text-foreground pl-10 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="cccvv">CVV</label>
                                        <div className="relative mt-1">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <input id="cccvv" placeholder="CVV"
                                                maxLength={4}
                                                onChange={(e) => handleCvvChange(e.target.value)}
                                                className="file:text-foreground pl-10 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" />
                                        </div>
                                    </div>
                                </div>
                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                        className="flex-1"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" id="payButton" className="flex-1"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Card
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>

                            <Separator />

                            {/* Security Notice */}
                            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-muted-foreground">
                                    <p className="font-medium text-foreground mb-1">Your payment information is secure</p>
                                    <p>We use industry-standard encryption to protect your card details. Your information is never stored in plain text.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onClick={() => onOpenChange(false)} />
        </Sheet>
    )
}
