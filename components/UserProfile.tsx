'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { LogOut, User, Shield, Calendar } from 'lucide-react'

export function UserProfile() {
    const { user, isAuthenticated, isLoading, logout, displayName, fullName, isAdmin, isAgent } = useAuth()

    if (isLoading) {
        return (
            <div className="bg-white/80 dark:bg-[#241b30]/80 backdrop-blur-md rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="bg-white/80 dark:bg-[#241b30]/80 backdrop-blur-md rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Not logged in</p>
            </div>
        )
    }

    return (
        <div className="bg-white/80 dark:bg-[#241b30]/80 backdrop-blur-md rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{displayName}</h3>
                        <div className="flex items-center space-x-2">
                            {isAdmin && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Admin
                                </span>
                            )}
                            {isAgent && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                    <User className="h-3 w-3 mr-1" />
                                    Agent
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Logout"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>

            <div className="space-y-3">
                {fullName && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="h-4 w-4" />
                        <span>{fullName}</span>
                    </div>
                )}

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {new Date(user.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="h-4 w-4" />
                    <span>Role: {user.role}</span>
                </div>
            </div>
        </div>
    )
} 