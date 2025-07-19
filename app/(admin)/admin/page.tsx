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
    ListOrdered,
    UserCheck,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type TabType = 'dashboard' | 'orders' | 'pricing' | null

export default function AdminDashboard() {
    const { profile } = useProfile()
    const signOut = useSignOut()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState<TabType | null>(null)

    // Sync tab state with URL
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab') as TabType | null
        if (tabFromUrl && ['dashboard', 'orders', 'pricing'].includes(tabFromUrl)) {
            setActiveTab(tabFromUrl)
        } else {
            setActiveTab('dashboard')
        }
    }, [searchParams])

    // Update URL when tab changes
    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab)
        const params = new URLSearchParams(searchParams.toString())
        if (tab && tab !== 'dashboard') {
            params.set('tab', tab)
        } else {
            params.delete('tab')
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }

    // Mock data for assigned orders
    const assignedOrders = [
        {
            id: '1',
            order_name: 'Clover POS System Order',
            status: 'submitted',
            created_at: '2024-01-15T10:30:00Z',
            total: 2499.99,
            items_count: 3,
            agent_name: 'John Smith'
        },
        {
            id: '2',
            order_name: 'ATM Machine Installation',
            status: 'approved',
            created_at: '2024-01-14T14:20:00Z',
            total: 8500.00,
            items_count: 1,
            agent_name: 'Sarah Johnson'
        },
        {
            id: '3',
            order_name: 'Figure POS System',
            status: 'fulfilled',
            created_at: '2024-01-13T09:15:00Z',
            total: 1899.99,
            items_count: 2,
            agent_name: 'Mike Chen'
        }
    ]

    // Mock pricing tiers
    const pricingTiers = [
        {
            id: 1,
            name: 'Bronze Tier',
            description: 'Entry level pricing for new agents',
            commission_rate: 5,
            product_count: 15
        },
        {
            id: 2,
            name: 'Silver Tier',
            description: 'Mid-level pricing for established agents',
            commission_rate: 8,
            product_count: 25
        },
        {
            id: 3,
            name: 'Gold Tier',
            description: 'Premium pricing for top performers',
            commission_rate: 12,
            product_count: 40
        }
    ]

    function statusBadge(status: string) {
        const config: Record<string, { color: string; label: string; icon: any }> = {
            submitted: { color: "bg-blue-100 text-blue-800", label: "Submitted", icon: Clock },
            approved: { color: "bg-green-100 text-green-800", label: "Approved", icon: CheckCircle },
            fulfilled: { color: "bg-purple-100 text-purple-800", label: "Fulfilled", icon: CheckCircle },
            draft: { color: "bg-gray-100 text-gray-800", label: "Draft", icon: AlertCircle },
        };
        const c = config[status] || config.draft;
        const Icon = c.icon;
        return <Badge className={`${c.color} font-medium flex items-center gap-1`}><Icon className="h-3 w-3" />{c.label}</Badge>;
    }

    function formatDate(date: string) {
        return new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    const totalAssignedOrders = assignedOrders.length
    const pendingOrders = assignedOrders.filter(order => order.status === 'submitted').length
    const totalValue = assignedOrders.reduce((sum, order) => sum + order.total, 0)

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                            <span className="text-sm text-muted-foreground">Welcome, {profile?.first_name} {profile?.last_name}</span>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Admin
                            </Badge>
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
                        onClick={() => handleTabChange('dashboard')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Settings className="h-4 w-4" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => handleTabChange('orders')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <ListOrdered className="h-4 w-4" />
                        Assigned Orders
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
                </div>

                {/* Dashboard Overview */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-2">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="animate-in fade-in-0 slide-in-from-bottom-2 delay-100">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Assigned Orders</CardTitle>
                                    <ListOrdered className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalAssignedOrders}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Orders assigned to you
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="animate-in fade-in-0 slide-in-from-bottom-2 delay-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">{pendingOrders}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Awaiting your review
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="animate-in fade-in-0 slide-in-from-bottom-2 delay-300">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Combined order value
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Orders */}
                        <Card className="animate-in fade-in-0 slide-in-from-bottom-2 delay-400">
                            <CardHeader>
                                <CardTitle>Recent Assigned Orders</CardTitle>
                                <CardDescription>Latest orders that have been assigned to you</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {assignedOrders.slice(0, 3).map((order, index) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors animate-in fade-in-0 slide-in-from-left-2" style={{ animationDelay: `${index * 100}ms` }}>
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <h4 className="font-medium text-foreground">{order.order_name}</h4>
                                                    <p className="text-sm text-muted-foreground">Agent: {order.agent_name}</p>
                                                    <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {statusBadge(order.status)}
                                                <div className="text-right">
                                                    <div className="font-semibold text-foreground">${order.total.toLocaleString()}</div>
                                                    <div className="text-xs text-muted-foreground">{order.items_count} items</div>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => handleTabChange('orders')}>
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Assigned Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-foreground">Orders Assigned to You</h2>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                {assignedOrders.length} Orders
                            </Badge>
                        </div>

                        <div className="grid gap-6">
                            {assignedOrders.map((order, index) => (
                                <Card key={order.id} className="animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: `${index * 100}ms` }}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{order.order_name}</CardTitle>
                                                <CardDescription>Order ID: {order.id} • Created {formatDate(order.created_at)}</CardDescription>
                                            </div>
                                            {statusBadge(order.status)}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Agent</p>
                                                    <p className="text-sm text-muted-foreground">{order.agent_name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Items</p>
                                                    <p className="text-sm text-muted-foreground">{order.items_count} products</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Total</p>
                                                    <p className="text-sm text-muted-foreground">${order.total.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <Button size="sm" variant="outline">
                                                View Details
                                            </Button>
                                            {order.status === 'submitted' && (
                                                <Button size="sm">
                                                    Review Order
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pricing Tiers Tab */}
                {activeTab === 'pricing' && (
                    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-foreground">Available Pricing Tiers</h2>
                            <p className="text-sm text-muted-foreground">View the pricing tiers available to agents</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {pricingTiers.map((tier, index) => (
                                <Card key={tier.id} className="animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: `${index * 150}ms` }}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5 text-primary" />
                                            {tier.name}
                                        </CardTitle>
                                        <CardDescription>{tier.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Commission Rate</span>
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                {tier.commission_rate}%
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Products Available</span>
                                            <Badge variant="outline">{tier.product_count}</Badge>
                                        </div>
                                        <div className="pt-4">
                                            <Button variant="outline" className="w-full" size="sm">
                                                View Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 