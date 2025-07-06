import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return user
}

export async function getCurrentUserProfile() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return null
    }

    // Fetch user profile from profiles table
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, created_at')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        return null
    }

    return profile
}

export async function requireAuth() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    return user
}

export async function requireProfile() {
    const profile = await getCurrentUserProfile()

    if (!profile) {
        redirect('/login')
    }

    return profile
}

export async function requireRole(role: 'ADMIN' | 'AGENT') {
    const profile = await requireProfile()

    if (profile.role !== role) {
        redirect('/unauthorized')
    }

    return profile
} 