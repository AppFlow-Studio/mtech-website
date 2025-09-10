'use server'

interface PaymentCardResponse {
    success: boolean
    data?: any
    error?: string
    cardToken?: string
    transactionId?: string
}

export async function addPaymentCard(
    paymentToken: string,
    agentId: string,
    email: string,
    name: string,
    mobile: string
): Promise<PaymentCardResponse> {
    try {
        // Input validation
        if (!paymentToken?.trim()) {
            return {
                success: false,
                error: 'Payment token is required'
            }
        }

        if (!agentId?.trim()) {
            return {
                success: false,
                error: 'Agent ID is required'
            }
        }

        if (!email?.trim() || !email.includes('@')) {
            return {
                success: false,
                error: 'Valid email address is required'
            }
        }

        if (!name?.trim()) {
            return {
                success: false,
                error: 'Cardholder name is required'
            }
        }

        // Environment variable validation
        if (!process.env.NEXT_PUBLIC_DEJAVOO_TOKEN) {
            console.error('Missing NEXT_PUBLIC_DEJAVOO_TOKEN environment variable')
            return {
                success: false,
                error: 'Payment service configuration error'
            }
        }

        if (!process.env.NEXT_PUBLIC_DEJAVOO_POS_TRANSACT_URL) {
            console.error('Missing NEXT_PUBLIC_DEJAVOO_POS_TRANSACT_URL environment variable')
            return {
                success: false,
                error: 'Payment service configuration error'
            }
        }

        if (!process.env.DEJAVOO_MERCHANT_ID) {
            console.error('Missing DEJAVOO_MERCHANT_ID environment variable')
            return {
                success: false,
                error: 'Payment service configuration error'
            }
        }

        // Prepare request payload
        const requestPayload = {
            "merchantAuthentication": {
                "merchantId": process.env.DEJAVOO_MERCHANT_ID,
                "transactionReferenceId": "41312331"
            },
            "transactionRequest": {
                "transactionType": 1, // Sale (using token)
                "amount": "1", // Example: 1000 = $10.00 (amount is in cents, divided by 100)
                "paymentTokenId": paymentToken,
                "applySteamSettingTipFeeTax": false
            },
            "preferences": {
                "eReceipt": false,
                "requestCardToken": true
            },
        }

        console.log('Sending payment card request for agent:', agentId)

        // Make API request with timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

        const response = await fetch(process.env.NEXT_PUBLIC_DEJAVOO_POS_TRANSACT_URL, {
            method: 'POST',
            headers: {
                'token': process.env.NEXT_PUBLIC_DEJAVOO_TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload),
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        // Check if response is ok
        if (!response.ok) {
            const errorText = await response.text()
            console.error('Payment API error response:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            })

            return {
                success: false,
                error: `Payment service error: ${response.status} ${response.statusText}`
            }
        }

        // Parse response
        let data
        try {
            data = await response.json()
        } catch (parseError) {
            console.error('Failed to parse payment API response:', parseError)
            return {
                success: false,
                error: 'Invalid response from payment service'
            }
        }

        console.log('Payment API response:', data)

        // Check for API-level errors in response
        if (data.error || data.errors) {
            const errorMessage = data.error || data.errors?.[0]?.message || 'Payment processing failed'
            console.error('Payment API returned error:', errorMessage)
            return {
                success: false,
                error: errorMessage
            }
        }

        // Check for transaction failure
        if (data.transactionResponse?.responseCode !== '1' && data.transactionResponse?.responseCode !== 1) {
            const errorMessage = data.transactionResponse?.responseText || 'Transaction failed'
            console.error('Transaction failed:', errorMessage)
            return {
                success: false,
                error: errorMessage
            }
        }

        // Extract card token if available
        const cardToken = data.transactionResponse?.cardToken || data.cardToken
        const transactionId = data.transactionResponse?.transactionId || data.transactionId

        if (!cardToken) {
            console.warn('No card token returned from payment service')
            return {
                success: false,
                error: 'Failed to generate payment token'
            }
        }

        // TODO: Store the card token in your database associated with the agent
        // await storeCardToken(agentId, cardToken, {
        //     last4: data.transactionResponse?.last4,
        //     cardType: data.transactionResponse?.cardType,
        //     expiryMonth: data.transactionResponse?.expiryMonth,
        //     expiryYear: data.transactionResponse?.expiryYear
        // })

        return {
            success: true,
            data: data,
            cardToken: cardToken,
            transactionId: transactionId
        }

    } catch (error) {
        console.error('Error in addPaymentCard:', error)

        // Handle specific error types
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return {
                    success: false,
                    error: 'Request timeout. Please try again.'
                }
            }

            if (error.message.includes('fetch')) {
                return {
                    success: false,
                    error: 'Network error. Please check your connection and try again.'
                }
            }

            return {
                success: false,
                error: error.message
            }
        }

        return {
            success: false,
            error: 'An unexpected error occurred while processing your payment'
        }
    }
}