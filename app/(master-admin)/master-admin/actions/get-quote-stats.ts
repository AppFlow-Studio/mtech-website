'use server'

import { createClient } from '@/utils/supabase/server'

export async function getQuoteStats() {
    try {
        const supabase = await createClient()

        // Get all quote requests
        const { data: allQuotes, error: allQuotesError } = await supabase
            .from('quote_requests')
            .select('*')

        if (allQuotesError) {
            console.error('Error fetching all quotes:', allQuotesError)
            return new Error('Failed to fetch quote statistics')
        }

        // Get quote requests with items for value calculations
        const { data: quotesWithItems, error: itemsError } = await supabase
            .from('quote_requests')
            .select(`
                *,
                quote_request_items (
                    *,
                    product:products (default_price)
                )
            `)

        if (itemsError) {
            console.error('Error fetching quotes with items:', itemsError)
            return new Error('Failed to fetch quote items')
        }

        // Calculate stats
        const total = allQuotes?.length || 0
        const pending = allQuotes?.filter(q => q.status === 'pending').length || 0
        const approved = allQuotes?.filter(q => q.status === 'approved').length || 0
        const closed = allQuotes?.filter(q => q.status === 'closed').length || 0
        const rejected = allQuotes?.filter(q => q.status === 'rejected').length || 0

        // Calculate total value
        let totalValue = 0
        let totalQuotesWithValue = 0

        quotesWithItems?.forEach(quote => {
            let quoteValue = 0
            quote.quote_request_items?.forEach((item: any) => {
                const price = item.quoted_price || item.product?.default_price || 0
                quoteValue += price * item.quantity
            })
            if (quoteValue > 0) {
                totalValue += quoteValue
                totalQuotesWithValue++
            }
        })

        const averageValue = totalQuotesWithValue > 0 ? totalValue / totalQuotesWithValue : 0

        // Calculate conversion rate
        const conversionRate = total > 0 ? approved / total : 0

        // Calculate monthly stats
        const now = new Date()
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)

        const thisMonthQuotes = allQuotes?.filter(q =>
            new Date(q.created_at) >= thisMonth
        ).length || 0

        const lastMonthQuotes = allQuotes?.filter(q =>
            new Date(q.created_at) >= lastMonth && new Date(q.created_at) < thisMonth
        ).length || 0

        // Calculate average response time (simplified - you might want to track this separately)
        // For now, we'll use a placeholder value
        const avgResponseTime = 24 // hours

        return {
            total,
            pending,
            approved,
            closed,
            rejected,
            totalValue,
            averageValue,
            thisMonth: thisMonthQuotes,
            lastMonth: lastMonthQuotes,
            conversionRate,
            avgResponseTime
        }
    } catch (error) {
        console.error('Error calculating quote stats:', error)
        return new Error('Failed to calculate quote statistics')
    }
} 