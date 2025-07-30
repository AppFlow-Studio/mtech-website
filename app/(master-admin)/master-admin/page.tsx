'use client'
import { useState, useEffect } from 'react'
import { useProfile } from '@/lib/hooks/useProfile'
import { useSignOut } from '@/lib/auth-utils'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Users,
    Package,
    DollarSign,
    Settings,
    LogOut,
    Tag,
    MessageSquare,
    ListOrdered,
    FileText
} from 'lucide-react'

import AgentManagement from './components/AgentManagement'
import ProductManagement from './components/ProductManagement'
import PricingTiers from './components/PricingTiers'
import DashboardOverview from './components/DashboardOverview'
import TagManagement from './components/TagManagement'
import { TagProvider } from './components/TagContext'
import OrderManagementPage from './components/OrderManagementPage'
import { QuoteRequests } from './components/QuoteRequests'

type TabType = 'agents' | 'products' | 'pricing' | 'tags' | 'orders' | 'quotes' | null

export default function AdminDashboard() {
    const { profile } = useProfile()
    const signOut = useSignOut()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState<TabType | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    // Sync tab state with URL
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab') as TabType | null
        if (tabFromUrl && ['agents', 'products', 'pricing', 'tags', 'orders', 'quotes'].includes(tabFromUrl)) {
            setActiveTab(tabFromUrl)
        } else {
            setActiveTab(null)
        }
    }, [searchParams])

    // Update URL when tab changes
    const handleTabChange = (tab: TabType | null) => {
        setActiveTab(tab)
        const params = new URLSearchParams(searchParams.toString())
        if (tab) {
            params.set('tab', tab)
        } else {
            params.delete('tab')
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <TagProvider>
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
                            onClick={() => handleTabChange(null)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === null
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Settings className="h-4 w-4" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => handleTabChange('agents')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'agents'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Users className="h-4 w-4" />
                            Agent Management
                        </button>
                        <button
                            onClick={() => handleTabChange('products')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'products'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Package className="h-4 w-4" />
                            Product Management
                        </button>
                        <button
                            onClick={() => handleTabChange('pricing')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'pricing'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <DollarSign className="h-4 w-4" />
                            Pricing Tiers
                        </button>
                        <button
                            onClick={() => handleTabChange('tags')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'tags'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Tag className="h-4 w-4" />
                            Tag Management
                        </button>
                        <button
                            onClick={() => handleTabChange('orders')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <ListOrdered className="h-4 w-4" />
                            Orders
                        </button>
                        <button
                            onClick={() => handleTabChange('quotes')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'quotes'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <FileText className="h-4 w-4" />
                            Quote Requests
                        </button>
                    </div>

                    {/* Content Sections */}
                    {activeTab === 'agents' && <AgentManagement />}
                    {activeTab === 'products' && <ProductManagement searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
                    {activeTab === 'pricing' && <PricingTiers />}
                    {activeTab === 'tags' && <TagManagement />}
                    {activeTab === 'orders' && <OrderManagementPage />}
                    {activeTab === 'quotes' && <QuoteRequests />}
                    {/* {activeTab === 'contact-inquiries' && <ContactInquiries />} */}
                    {/* Dashboard Overview - Show when no specific tab is selected */}
                    {!activeTab && <DashboardOverview />}
                </div>
            </div>
        </TagProvider>
    )
}


// Product Management Component


