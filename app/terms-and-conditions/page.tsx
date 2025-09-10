'use client'
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"
import { useEffect, useState } from "react";

export default function TestCardsTerms() {
    const [postData, setPostData] = useState(null); // State to hold postData function
    const [ response, setResponse ] = useState()
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
    const submitCardFunc = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        if (!postData) {
            console.error('postData function is not available');
            return; // Exit if postData is not available
        }
        try {
            const response = await postData(); // Call postData function
            setResponse(JSON.stringify(response))
            console.log('Payment Token:', response); // Log the payment token
        } catch (error) {
            console.error('Error processing payment:', error); // Handle errors
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                </CardTitle>
                <CardDescription>
                    Enter your payment details for authorization hold
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={submitCardFunc} className="space-y-4">
                    {/* <Input
                    id="ccnumber"
                    value={paymentData.ccnumber}
                    onChange={(e) => handleInputChange('ccnumber', formatCardNumber(e.target.value))}
                    placeholder="Card Number"
                    maxLength={19}
                    className="w-full"
                />
                <Input
                    id="ccexpiry"
                    value={paymentData.ccexpiry}
                    onChange={(e) => handleInputChange('ccexpiry', formatExpiryDate(e.target.value))}
                    placeholder="Expiry Date"
                    maxLength={5}
                    className="w-full"
                />
                <Input
                    id="cccvv"
                    value={paymentData.cccvv}
                    onChange={(e) => handleInputChange('cccvv', e.target.value.replace(/\D/g, ''))}
                    placeholder="CVV"
                    maxLength={4}
                    className="w-full"
                /> */}
                    <input id="ccnumber" placeholder="Card Number"
                        maxLength={19}
                        className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" />
                    <input id="ccexpiry" placeholder="Expiry Date"
                        maxLength={5}
                        className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" />
                    <input id="cccvv" placeholder="CVV"
                        maxLength={4}
                        className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" />
                    <Button type="submit" id="payButton" className="w-full">
                        Pay
                    </Button>
                </form>

                {
                    response
                }
            </CardContent>
        </Card>
    )
}

