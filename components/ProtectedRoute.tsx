'use client'

import { useAuthStore } from '@/lib/auth-store'
import { useProfile } from '@/lib/hooks/useProfile'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: 'ADMIN' | 'AGENT' | 'MASTER_ADMIN'
    fallback?: React.ReactNode
    redirectTo?: string
}

export function ProtectedRoute({
    children,
    requiredRole,
    fallback,
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const {  isLoading, profile } = useProfile()
    const { user } = useAuthStore()
    const router = useRouter()
    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-[#0B0119] dark:via-[#1a0b2e] dark:to-[#0B0119]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
                </div>
            </div>
        )
    }

    // Not authenticated
    if (!user) {
        return fallback || (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-[#0B0119] dark:via-[#1a0b2e] dark:to-[#0B0119]">
                <div className="text-center">
                    <div className="bg-red-100 dark:bg-red-900/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                        <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400">You need to be logged in to access this page.</p>
                </div>
            </div>
        )
    }

    // Check role if required
    if (requiredRole && profile?.role !== requiredRole) {
        return fallback || (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-[#0B0119] dark:via-[#1a0b2e] dark:to-[#0B0119]">
                <div className="text-center">
                    <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                        <svg className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Insufficient Permissions</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        You need {requiredRole} role to access this page. Your current role is {profile?.role}.
                    </p>
                </div>
            </div>
        )
    }

    // All checks passed
    return <>{children}</>
} 