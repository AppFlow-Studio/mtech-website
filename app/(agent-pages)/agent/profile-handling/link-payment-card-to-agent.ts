'use server'
import { createClient } from '@/utils/supabase/server'

export async function linkPaymentCardToAgent({
    agentId,
    cardInfo,
    transaction_id
}:
    {
        agentId: string,
        cardInfo: {
            ChdToken: string,
            Label: string,
            MaskedPan: string,
        },
        transaction_id: string
    }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('card_payment_info').insert({
        user_id: agentId,
        chd_token: cardInfo.ChdToken,
        label: cardInfo.Label,
        masked_pan: cardInfo.MaskedPan,
        transaction_id: transaction_id,
    })

    if (error) {
        console.error('Error linking payment card to agent:', error)
        return {
            success: false,
            error: error.message
        }
    }
    console.log('Payment card linked to agent:', data)
    return {
        success: true,
        data: data
    }
}