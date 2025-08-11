'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export interface UpdateAgentProfileData {
    email?: string
    first_name?: string
    last_name?: string
    phone_number?: string
    password?: string
}

export async function updateAgentProfile(agentId: string, data: UpdateAgentProfileData) {
    const supabase = await createClient()

    try {
        // Start a transaction to update both profiles and auth if needed
        let updates: any = {}

        // Only include fields that are provided
        if (data.email !== undefined) updates.email = data.email
        if (data.first_name !== undefined) updates.first_name = data.first_name
        if (data.last_name !== undefined) updates.last_name = data.last_name
        if (data.phone_number !== undefined) updates.phone_number = data.phone_number

        // Update the profiles table
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', agentId)
           

        if (profileError) {
            console.error('Profile update error:', profileError)
            throw new Error(`Failed to update profile: ${profileError.message}`)
        }

        // If password is provided, update auth
        if (data.password) {
            const { error: authError } = await supabase.auth.updateUser({
                password: data.password
            })

            if (authError) {
                console.error('Auth update error:', authError)
                throw new Error(`Failed to update password: ${authError.message}`)
            }
        }

        // Revalidate the agent page
        revalidatePath('/agent')

        return {
            success: true,
            data: profileData,
            message: 'Profile updated successfully'
        }

    } catch (error) {
        console.error('Update agent profile error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }
    }
}
