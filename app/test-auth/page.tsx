'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { UserProfile } from '@/components/UserProfile'

export default function TestAuthPage() {
    const { user, isAuthenticated, isLoading, error } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-[#0B0119] dark:via-[#1a0b2e] dark:to-[#0B0119]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading auth state...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-[#0B0119] dark:via-[#1a0b2e] dark:to-[#0B0119] p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Authentication Test Page
                </h1>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Auth State */}
                    <div className="bg-white/80 dark:bg-[#241b30]/80 backdrop-blur-md rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Auth State
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Authenticated:</span>
                                <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${isAuthenticated
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                    }`}>
                                    {isAuthenticated ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Loading:</span>
                                <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${isLoading
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    }`}>
                                    {isLoading ? 'Yes' : 'No'}
                                </span>
                            </div>
                            {error && (
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Error:</span>
                                    <span className="ml-2 text-red-600 dark:text-red-400 text-sm">{error}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Data */}
                    <div className="bg-white/80 dark:bg-[#241b30]/80 backdrop-blur-md rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            User Data
                        </h2>
                        {user ? (
                            <div className="space-y-3">
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">ID:</span>
                                    <span className="ml-2 text-gray-900 dark:text-white text-sm font-mono">{user.id}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                                    <span className="ml-2 text-gray-900 dark:text-white">
                                        {user.first_name} {user.last_name}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Role:</span>
                                    <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${user.role === 'ADMIN'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                        }`}>
                                        {user.role}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Created:</span>
                                    <span className="ml-2 text-gray-900 dark:text-white text-sm">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400">No user data available</p>
                        )}
                    </div>
                </div>

                {/* User Profile Component */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        User Profile Component
                    </h2>
                    <UserProfile />
                </div>

                {/* Debug Info */}
                <div className="mt-8 bg-white/80 dark:bg-[#241b30]/80 backdrop-blur-md rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Debug Information
                    </h2>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
                        {JSON.stringify({ user, isAuthenticated, isLoading, error }, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    )
} 