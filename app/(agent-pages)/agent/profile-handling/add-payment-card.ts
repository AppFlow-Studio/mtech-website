'use server'

import { transactionStatusCheck } from "../order/[order_id]/actions/transaction-status-check"
import { InsertTransactionsLog } from "../order/[order_id]/actions/transactions-log"
import { UpdateTransactionsLog } from "../order/[order_id]/actions/UpdateTransactionLog"
import { linkPaymentCardToAgent } from "./link-payment-card-to-agent"
import { processRefund } from "./process-refund"

interface PaymentCardResponse {
    success: boolean
    data?: any
    error?: string
    cardToken?: string
    transactionId?: string
}


interface TransactionStatusResponse {
    success: boolean
    error?: string
    Card?: {
        ChdToken: string,
        Label: string,
        MaskedPan: string
    }
    transactionId?: string
    BatchNo?: string
    InvoiceNo?: string
    RespStatus?: string
    RespMsg?: string
    Rrn?: string
}


export async function addPaymentCard(
    paymentToken: string,
    agentId: string,
    email: string,
    name: string,
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
        if (!process.env.NEXT_PUBLIC_DEJAVOO_CHECK_TRANSACTION_URL) {
            console.error('Missing NEXT_PUBLIC_DEJAVOO_CHECK_TRANSACTION_URL environment variable')
            return {
                success: false,
                error: 'Payment service configuration error, Missing NEXT_PUBLIC_DEJAVOO_CHECK_TRANSACTION_URL environment variable'
            }
        }
        if (!process.env.NEXT_PUBLIC_DEJAVOO_TOKEN) {
            console.error('Missing NEXT_PUBLIC_DEJAVOO_TOKEN environment variable')
            return {
                success: false,
                error: 'Payment service configuration error, Missing NEXT_PUBLIC_DEJAVOO_TOKEN environment variable'
            }
        }
        if (!process.env.NEXT_PUBLIC_DEJAVOO_POS_TRANSACT_URL) {
            console.error('Missing NEXT_PUBLIC_DEJAVOO_POS_TRANSACT_URL environment variable')
            return {
                success: false,
                error: 'Payment service configuration error, Missing NEXT_PUBLIC_DEJAVOO_POS_TRANSACT_URL environment variable'
            }
        }
        if (!process.env.DEJAVOO_MERCHANT_ID) {
            console.error('Missing DEJAVOO_MERCHANT_ID environment variable')
            return {
                success: false,
                error: 'Payment service configuration error, Missing DEJAVOO_MERCHANT_ID environment variable'
            }
        }

        // Insert transactions log
        const transactionsLogId = await InsertTransactionsLog(agentId, "ADD_PAYMENT_CARD");
        if (transactionsLogId instanceof Error) {
            return {
                success: false,
                error: transactionsLogId.message
            }
        }
        // Prepare request payload
        const requestPayload = {
            "merchantAuthentication": {
                "merchantId": process.env.DEJAVOO_MERCHANT_ID,
                "transactionReferenceId": transactionsLogId
            },
            "transactionRequest": {
                "transactionType": 1, // Sale (using token)
                "amount": "100", // Example: 102 = $1.01 (amount is in cents, divided by 100)
                "paymentTokenId": paymentToken,
                "applySteamSettingTipFeeTax": false,
            },
            "preferences": {
                "eReceipt": false,
                "requestCardToken": true
            },
        }

        // Dejavoo iPos Transact API -> GET ChdToken and TransactionId
        const response = await fetch(process.env.NEXT_PUBLIC_DEJAVOO_POS_TRANSACT_URL, {
            method: 'POST',
            headers: {
                'token': process.env.NEXT_PUBLIC_DEJAVOO_TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload),
        })

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
            const error = await UpdateTransactionsLog(transactionsLogId, "FAILED", "No Transaction ID", "Failed to parse payment API response")

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
            const error = await UpdateTransactionsLog(transactionsLogId, "FAILED", "No Transaction ID", errorMessage)

            return {
                success: false,
                error: errorMessage
            }
        }

        // Check for transaction failure
        if (data.iposhpresponse?.responseCode !== '200') {
            const errorMessage = data.transactionResponse?.responseMessage || 'Transaction failed'
            const error = await UpdateTransactionsLog(transactionsLogId, "FAILED", data.iposhpresponse?.transactionId, errorMessage)
            console.error('Transaction failed:', errorMessage)
            return {
                success: false,
                error: errorMessage
            }
        }

        // Extract card token if available
        const cardChdToken = data.iposhpresponse?.chdToken
        const transactionId = data.iposhpresponse?.transactionId

        if (!cardChdToken) {
            console.warn('No card token returned from payment service')
            return {
                success: false,
                error: 'Failed to generate payment token'
            }
        }


        const transactionStatusResponse: TransactionStatusResponse = await transactionStatusCheck(transactionsLogId)
        if (!transactionStatusResponse.success) {
            return {
                success: false,
                error: 'Failed to get transaction status from transaction status check'
            }
        }
        // Make sure Rrn is not undefined
        if (transactionStatusResponse.success && !transactionStatusResponse.Rrn) {
            const error = await UpdateTransactionsLog(transactionsLogId, "FAILED", data.iposhpresponse?.transactionId, `Failed to get Rrn from transaction status check`)
            return {
                success: false,
                error: 'Failed to get Rrn from transaction status check'
            }
        }

        if (transactionStatusResponse.success && transactionStatusResponse.Card) {
            // Link Card info to agent and Refund user account with card info
            const linkCardResponse = await linkPaymentCardToAgent({
                agentId,
                cardInfo: transactionStatusResponse.Card,
                transaction_id: transactionId
            })
            // Process Refund
            if (linkCardResponse.success) {
                const refundResponse = await processRefund({
                    Rrn: transactionStatusResponse.Rrn || '',
                    Amount: 100,
                    transactionReferenceId: transactionsLogId
                })
                const error = await UpdateTransactionsLog(transactionsLogId, "SUCCESS", data.iposhpresponse?.transactionId, `Successfully processed refund & linked card info to agent`)
                if (refundResponse.success) {
                    return {
                        success: true,
                    }
                }

            } else {
                const error = await UpdateTransactionsLog(transactionsLogId, "FAILED", data.iposhpresponse?.transactionId, `Failed to link card info to agent`)
                return {
                    success: false,
                    error: 'Failed to link card info to agent'
                }
            }

        }
        return {
            success: true,
            data: data,
            cardToken: cardChdToken,
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