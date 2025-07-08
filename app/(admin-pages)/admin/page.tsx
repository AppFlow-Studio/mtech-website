'use client'
import { useState } from 'react'
import { useProfile } from '@/lib/hooks/useProfile'
import { useSignOut } from '@/lib/auth-utils'
import { Button } from '@/components/ui/button'
import {
    Users,
    Package,
    DollarSign,
    Settings,
    LogOut
} from 'lucide-react'

import AgentManagement from './components/AgentManagement'
import ProductManagement from './components/ProductManagement'
import PricingTiers from './components/PricingTiers'
import DashboardOverview from './components/DashboardOverview'

type TabType = 'agents' | 'products' | 'pricing' | null

export default function AdminDashboard() {
    const { profile } = useProfile()
    const signOut = useSignOut()
    const [activeTab, setActiveTab] = useState<TabType | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    // const filteredProducts = mockProducts.filter(product =>
    //     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     product.description.toLowerCase().includes(searchTerm.toLowerCase())
    // )

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                            <span className="text-sm text-muted-foreground">Welcome, {profile?.email}</span>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => signOut()}
                            className="flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
                    <button
                        onClick={() => setActiveTab(null)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === null
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Settings className="h-4 w-4" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('agents')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'agents'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Users className="h-4 w-4" />
                        Agent Management
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'products'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Package className="h-4 w-4" />
                        Product Management
                    </button>
                    <button
                        onClick={() => setActiveTab('pricing')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'pricing'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <DollarSign className="h-4 w-4" />
                        Pricing Tiers
                    </button>
                </div>

                {/* Content Sections */}
                {activeTab === 'agents' && <AgentManagement />}
                {activeTab === 'products' && <ProductManagement searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
                {activeTab === 'pricing' && <PricingTiers />}

                {/* Dashboard Overview - Show when no specific tab is selected */}
                {!activeTab && <DashboardOverview />}
            </div>
        </div>
    )
}


// Product Management Component


