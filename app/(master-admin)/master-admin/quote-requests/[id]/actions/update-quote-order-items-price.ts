'use server'
import { createClient } from "@/utils/supabase/server"

export async function updateQuoteOrderItemsPrice({ QuoteRequestItems}: { QuoteRequestItems : { quoteRequestId: string, product_id: string, quoted_price: number}[] }) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('quote_order_items').upsert(QuoteRequestItems)

    if (error) {
        return new Error(error.message)
    }

    return data
}
