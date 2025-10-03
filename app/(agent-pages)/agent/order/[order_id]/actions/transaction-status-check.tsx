'use server'

export async function transactionStatusCheck(transactionReferenceId: string) {
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
    if (!process.env.DEJAVOO_MERCHANT_ID) {
        console.error('Missing DEJAVOO_MERCHANT_ID environment variable')
        return {
            success: false,
            error: 'Payment service configuration error, Missing DEJAVOO_MERCHANT_ID environment variable'
        }
    }
    try {

        const response = await fetch(process.env.NEXT_PUBLIC_DEJAVOO_CHECK_TRANSACTION_URL, {
            method: 'POST',
            headers: {
                'token': process.env.NEXT_PUBLIC_DEJAVOO_TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                merchantAuthentication: {
                    merchantId: process.env.DEJAVOO_MERCHANT_ID,
                    transactionReferenceId: transactionReferenceId
                }
            }),
        })

        // Handle HTTP status errors (e.g., 404, 500)
        if (!response.ok) {
            const errorText = await response.text()
            console.error('Transaction Status Check API error response:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            })
            return {
                success: false,
                error: 'Transaction Status Check API error response'
            }
        }

        // Attempt to parse the response as JSON (or handle other content types)
        const data = await response.json(); // Or .text(), .blob() etc.
        console.log('Transaction Status Check Response:', data)
        return {
            RespMsg : data.iposhpresponse.Response.RespMsg,
            Card : data.iposhpresponse.Card,
            transactionId: data.iposhpresponse.Response.TransactionId,
            success: true,
            BatchNo: data.iposhpresponse.Response.BatchNo,
            InvoiceNo : data.iposhpresponse.Response.InvoiceNo,
            RespStatus: data.iposhpresponse.Response.RespStatus,
            Rrn : data.iposhpresponse.Response.Rrn,
            Type: data.iposhpresponse.Card.Type
        };


    } catch (error) {
        console.error('Error in transactionStatusCheck:', error)
        return {
            success: false,
            error: 'Error in transactionStatusCheck'
        }
    }

}