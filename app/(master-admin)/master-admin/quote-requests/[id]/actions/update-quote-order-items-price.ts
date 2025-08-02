'use server'
import { createClient } from "@/utils/supabase/server"

export async function updateQuoteOrderItemsPrice({ QuoteRequestItems }: { QuoteRequestItems: { quote_request_id: string, product_id: string, quoted_price: number }[] }) {
    const supabase = await createClient()
    console.log('QuoteRequestItems', QuoteRequestItems)
    const { data, error } = await supabase
        .from('quote_request_items').upsert(QuoteRequestItems,
            {
                onConflict: 'id',
            }
        )

    console.log(error)
    if (error) {
        return new Error(error.message)
    }

    return data
}
