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
    AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAssignedOrders } from '../actions/hooks/useAssignedOrders'
import PricingTiers from '@/app/(master-admin)/master-admin/components/PricingTiers'

type TabType = 'dashboard' | 'orders' | 'pricing' | null

export default function AdminDashboard() {
    const { profile } = useProfile()
    const { data: assignedOrders, isLoading: isAssignedOrdersLoading } = useAssignedOrders(profile?.id || '')
    const signOut = useSignOut()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState<TabType | null>(null)
    const [statusFilter, setStatusFilter] = useState<string>('all')

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

    // Filter orders based on status
    const filteredOrders = assignedOrders?.filter((order: any) => {
        if (statusFilter === 'all') return true
        return order.status === statusFilter
    }) || []


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

    if (isAssignedOrdersLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span className="text-lg font-medium text-blue-700 animate-pulse">Loading your dashboard...</span>
                </div>
            </div>
        )
    }

    const totalAssignedOrders = assignedOrders?.length || 0
    const pendingOrders = assignedOrders?.filter((order: any) => order.status === 'submitted').length || 0
    const approvedOrders = assignedOrders?.filter((order: any) => order.status === 'approved').length || 0
    const totalValue = assignedOrders?.reduce((sum: number, order: any) => sum + order.order_items.reduce((sum: number, item: any) => sum + item.price_at_order * item.quantity, 0), 0) || 0

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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="delay-100">
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
                            <Card className="delay-200">
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
                            <Card className="delay-300">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Approved Orders</CardTitle>
                                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">{approvedOrders}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Approved by you
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="delay-400">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Combined orders value
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Orders */}
                        <Card className="delay-400">
                            <CardHeader>
                                <CardTitle>Recent Assigned Orders</CardTitle>
                                <CardDescription>Latest orders that have been assigned to you</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {assignedOrders?.slice(0, 3).map((order: any, index: number) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors animate-in fade-in-0 slide-in-from-left-2" style={{ animationDelay: `${index * 100}ms` }}>
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <h4 className="font-medium text-foreground">{order.order_name}</h4>
                                                    <p className="text-sm text-muted-foreground">Agent: {order.agent.first_name} {order.agent.last_name}</p>
                                                    <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {statusBadge(order.status)}
                                                <div className="text-right">
                                                    <div className="font-semibold text-foreground">${order.order_items.reduce((sum: number, item: any) => sum + item.price_at_order * item.quantity, 0)}</div>
                                                    <div className="text-xs text-muted-foreground">{order.order_items.length} items</div>
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
                                {filteredOrders.length} Orders
                            </Badge>
                        </div>

                        {/* Status Filters */}
                        <div className="flex space-x-2 mb-4">
                            <Button
                                variant={statusFilter === 'all' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('all')}
                                className="text-sm"
                            >
                                All
                            </Button>
                            <Button
                                variant={statusFilter === 'submitted' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('submitted')}
                                className="text-sm"
                            >
                                Submitted
                            </Button>
                            <Button
                                variant={statusFilter === 'approved' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('approved')}
                                className="text-sm"
                            >
                                Approved
                            </Button>
                            <Button
                                variant={statusFilter === 'fulfilled' ? 'default' : 'outline'}
                                onClick={() => setStatusFilter('fulfilled')}
                                className="text-sm"
                            >
                                Fulfilled
                            </Button>
                        </div>

                        <div className="grid gap-6">
                            {filteredOrders?.map((order: any, index: number) => (
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
                                            <div className="flex items-start gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Agent</p>
                                                    <p className="text-sm text-muted-foreground">{order.agent.first_name} {order.agent.last_name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Items</p>
                                                    <p className="text-sm text-muted-foreground">{order.order_items.length} products</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Total</p>
                                                    <p className="text-sm text-muted-foreground">${order.order_items.reduce((sum: number, item: any) => sum + item.price_at_order * item.quantity, 0).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <Button size="sm">
                                                    Review Order
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pricing Tiers Tab */}
                {activeTab === 'pricing' && (
                    <PricingTiers />
                )}
            </div>
        </div>
    )
} 