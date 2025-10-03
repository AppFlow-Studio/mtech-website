'use server'

/**
 * @typedef ProcessRefundState
 * @property {object} [data] - An object containing validation errors for form fields.
 */

/**
 * Subscribes a user to the newsletter. This is an async server function.
 * It validates the input and simulates saving it to a database.
 * @param {string} Rrn - The previous state of the form.
 * @param {string} Amount - The form data submitted by the client.
 * @returns {Promise<ProcessRefundState>} The new state of the form after processing.
 */
export async function processRefund({
    Rrn,
    Amount,
    transactionReferenceId
}: {
    Rrn: string,
    Amount: number,
    transactionReferenceId: string
}
) {
    // Validate ENV Keys
    if (!process.env.DEJAVOO_MERCHANT_ID) {
        return {
            success: false,
            error: 'DEJAVOO_MERCHANT_ID is not set'
        }
    }
    if (!process.env.DEJAVOO_TOKEN) {
        return {
            success: false,
            error: 'DEJAVOO_TOKEN is not set'
        }
    }
    if (!process.env.DEJAVOO_URL) {
        return {
            success: false,
            error: 'DEJAVOO_URL is not set'
        }
    }
    // Validate Input
    if (!Rrn || !Amount) {
        return {
            success: false,
            error: 'Rrn and Amount are required'
        }
    }
    const requestPayload = {
        "merchantAuthentication": {
            "merchantId": process.env.DEJAVOO_MERCHANT_ID,
            "transactionReferenceId": transactionReferenceId
        },
        "transactionRequest": {
            "transactionType": 3,
            "rrn": Rrn,
            "amount": Amount
        }
    }
    // Process Refund
    const result = await fetch(`${process.env.NEXT_PUBLIC_DEJAVOO_POS_TRANSACT_URL}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEJAVOO_POS_TRANSACT_URL}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
    })

    if ( result.ok ) {
        const data = await result.json()
        console.log('Refund API response:', data)
        return {
            success: true,
            data: data
        }
    } else {
        const errorText = await result.json()
        console.error('Refund API error response:', errorText.errors.map((error: any) => {
            return {
                field : error.field,
                message : error.message
            }
        }).join(', '))


        return {
            success: false,
            error: errorText
        }
    }
}