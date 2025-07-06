import { useAuthStore } from '@/lib/auth-store'
import type { UserProfile } from '@/lib/types'

export function useAuth() {
    const {
        user,
        isLoading,
        setUser,
        setLoading,

    } = useAuthStore()
    return {
        // State
        user,
        isLoading,

        // Actions
        setUser,
        setLoading,


        // Convenience getters
        isAdmin: user?.role === 'ADMIN',
        isAgent: user?.role === 'AGENT',
        fullName: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '',
        displayName: user?.first_name || user?.last_name || 'User',
    }
}

// Type-safe hook for checking if user has specific role
export function useRole(role: 'ADMIN' | 'AGENT') {
    const { user } = useAuth()
    return user?.role === role
}

// Hook for admin-only access
export function useAdmin() {
    return useRole('ADMIN')
}

// Hook for agent-only access
export function useAgent() {
    return useRole('AGENT')
} 