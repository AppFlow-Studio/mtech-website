import { useProducts } from "../actions/ProductsServerState"
import { useAgents } from "../actions/AgentStore"
import { useTiers } from "../actions/TeirsStores"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Users, DollarSign, Settings, Plus, Mail, AlertCircle, UserCheck, CheckCircle, Clock, ListOrdered, TrendingUp, BarChart3, PieChart, Activity } from "lucide-react"
import { useSubmittedOrders } from "../actions/OrderStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart"
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Area, AreaChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"

// Mock contact form data for dashboard
const mockContactForms = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@email.com",
        itemInterested: "Clover POS System",
        status: "new",
        createdAt: "2024-01-15T10:30:00Z"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@business.com",
        itemInterested: "ATM Machine",
        status: "assigned",
        createdAt: "2024-01-14T14:20:00Z"
    },
    {
        id: 3,
        name: "Mike Chen",
        email: "mike.chen@restaurant.com",
        itemInterested: "Figure POS System",
        status: "contacted",
        createdAt: "2024-01-13T09:15:00Z"
    },
    {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@retail.com",
        itemInterested: "Dual Pricing System",
        status: "new",
        createdAt: "2024-01-12T16:45:00Z"
    },
    {
        id: 5,
        name: "David Wilson",
        email: "david.wilson@gas.com",
        itemInterested: "Gas Station POS",
        status: "assigned",
        createdAt: "2024-01-11T11:30:00Z"
    }
]

export default function DashboardOverview() {
    const { data: products } = useProducts()
    const { data: agents } = useAgents()
    const { data: tiers } = useTiers()
    const totalProducts = products?.length || 0
    const inStockProducts = products?.filter((p: any) => p.inStock).length || 0
    const outOfStockProducts = totalProducts - inStockProducts
    const { data: submittedOrders, isLoading: isSubmittedOrdersLoading } = useSubmittedOrders()

    // Chart configuration
    const chartConfig = {
        orders: {
            label: "Orders",
            color: "hsl(var(--chart-1))",

        },
        submitted: {
            label: "Submitted",
            color: "hsl(var(--chart-2))",
        },
        approved: {
            label: "Approved",
            color: "hsl(var(--chart-3))",
        },
        fulfilled: {
            label: "Fulfilled",
            color: "hsl(var(--chart-4))",
        },
        revenue: {
            label: "Revenue",
            color: "hsl(var(--chart-5))",
        },
    }

    // State for selected month
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date()
        return { month: now.getMonth(), year: now.getFullYear() }
    })

    // Process order data for charts
    const chartData = useMemo(() => {
        if (!submittedOrders || submittedOrders instanceof Error) return []

        const { month, year } = selectedMonth

        // Get orders from selected month
        const monthOrders = submittedOrders.filter((order: any) => {
            const orderDate = new Date(order.created_at)
            return orderDate.getMonth() === month && orderDate.getFullYear() === year
        })

        // Group by day for the selected month
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const dailyData = []

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            const dayOrders = monthOrders.filter((order: any) => {
                const orderDate = new Date(order.created_at)
                return orderDate.getDate() === day
            })

            const submitted = dayOrders.filter((order: any) => order.status === 'submitted').length
            const approved = dayOrders.filter((order: any) => order.status === 'approved').length
            const fulfilled = dayOrders.filter((order: any) => order.status === 'fulfilled').length
            const total = dayOrders.length

            // Calculate revenue
            const revenue = dayOrders.reduce((sum: number, order: any) => {
                if (order.order_items && order.order_items.length > 0) {
                    return sum + order.order_items.reduce((itemSum: number, item: any) =>
                        itemSum + (item.price_at_order * item.quantity), 0)
                }
                return sum
            }, 0)

            dailyData.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                orders: total,
                submitted,
                approved,
                fulfilled,
                revenue: Math.round(revenue)
            })
        }

        return dailyData
    }, [submittedOrders, selectedMonth])

    // Monthly summary data
    const monthlySummary = useMemo(() => {
        if (!submittedOrders || submittedOrders instanceof Error) return []

        const { month, year } = selectedMonth

        const monthOrders = submittedOrders.filter((order: any) => {
            const orderDate = new Date(order.created_at)
            return orderDate.getMonth() === month && orderDate.getFullYear() === year
        })

        const submitted = monthOrders.filter((order: any) => order.status === 'submitted').length
        const approved = monthOrders.filter((order: any) => order.status === 'approved').length
        const fulfilled = monthOrders.filter((order: any) => order.status === 'fulfilled').length
        const total = monthOrders.length

        return [
            { name: 'Submitted', value: submitted, color: '#3b82f6' },
            { name: 'Approved', value: approved, color: '#10b981' },
            { name: 'Fulfilled', value: fulfilled, color: '#8b5cf6' },
            { name: 'Total', value: total, color: '#f59e0b' }
        ]
    }, [submittedOrders, selectedMonth])

    // Status distribution for pie chart
    const statusDistribution = useMemo(() => {
        if (!submittedOrders || submittedOrders instanceof Error) return []

        const statusCounts = submittedOrders.reduce((acc: any, order: any) => {
            acc[order.status] = (acc[order.status] || 0) + 1
            return acc
        }, {})

        return Object.entries(statusCounts).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
            color: status === 'submitted' ? '#3b82f6' :
                status === 'approved' ? '#10b981' :
                    status === 'fulfilled' ? '#8b5cf6' :
                        status === 'pending' ? '#f59e0b' :
                            status === 'rejected' ? '#ef4444' : '#6b7280'
        }))
    }, [submittedOrders])

    // Helper functions for month navigation
    const getMonthName = (month: number, year: number) => {
        return new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    const goToPreviousMonth = () => {
        setSelectedMonth(prev => {
            const newMonth = prev.month === 0 ? 11 : prev.month - 1
            const newYear = prev.month === 0 ? prev.year - 1 : prev.year
            return { month: newMonth, year: newYear }
        })
    }

    const goToNextMonth = () => {
        setSelectedMonth(prev => {
            const newMonth = prev.month === 11 ? 0 : prev.month + 1
            const newYear = prev.month === 11 ? prev.year + 1 : prev.year
            return { month: newMonth, year: newYear }
        })
    }

    const goToCurrentMonth = () => {
        const now = new Date()
        setSelectedMonth({ month: now.getMonth(), year: now.getFullYear() })
    }

    // Contact form statistics
    const totalInquiries = mockContactForms.length
    const newInquiries = mockContactForms.filter(i => i.status === "new").length
    const assignedInquiries = mockContactForms.filter(i => i.status === "assigned").length
    const contactedInquiries = mockContactForms.filter(i => i.status === "contacted").length

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            new: { color: "bg-blue-100 text-blue-800", icon: AlertCircle },
            assigned: { color: "bg-yellow-100 text-yellow-800", icon: UserCheck },
            contacted: { color: "bg-green-100 text-green-800", icon: CheckCircle }
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        const Icon = config.icon
        return (
            <Badge className={`${config.color} flex items-center gap-1 text-xs`}>
                <Icon className="h-3 w-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Dashboard Overview</h2>
                {/* Statistics Cards -- Products, In Stock, Out of Stock, Active Agents, Total Orders, Submitted Orders, Approved Orders, Fulfilled Orders */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalProducts}</div>
                            <p className="text-xs text-muted-foreground">
                                Products in catalog
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                            <div className="h-4 w-4 rounded-full bg-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{inStockProducts}</div>
                            <p className="text-xs text-muted-foreground">
                                Available for purchase
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                            <div className="h-4 w-4 rounded-full bg-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{outOfStockProducts}</div>
                            <p className="text-xs text-muted-foreground">
                                Needs restocking
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{agents?.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {agents?.map((agent: any) => agent.first_name + ' ' + agent.last_name).join(', ')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Submitted Orders</CardTitle>
                            <ListOrdered className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {submittedOrders instanceof Error ? (
                                <div className="text-2xl font-bold">Error: {submittedOrders.message}</div>
                            ) : (
                                <div className="text-2xl font-bold text-blue-600">
                                    {submittedOrders?.filter((order: any) => order.status === 'submitted').length || 0}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Awaiting approval
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved Orders</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {submittedOrders instanceof Error ? (
                                <div className="text-2xl font-bold">Error: {submittedOrders.message}</div>
                            ) : (
                                <div className="text-2xl font-bold text-green-600">
                                    {submittedOrders?.filter((order: any) => order.status === 'approved').length || 0}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Ready for fulfillment
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Fulfilled Orders</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {submittedOrders instanceof Error ? (
                                <div className="text-2xl font-bold">Error: {submittedOrders.message}</div>
                            ) : (
                                <div className="text-2xl font-bold text-purple-600">
                                    {submittedOrders?.filter((order: any) => order.status === 'fulfilled').length || 0}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Ready to ship
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {submittedOrders instanceof Error ? (
                                <div className="text-2xl font-bold">Error: {submittedOrders.message}</div>
                            ) : (
                                <div className="text-2xl font-bold">
                                    {submittedOrders?.length || 0}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                                All time orders
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Charts Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Business Analytics</CardTitle>
                            <CardDescription>Track your business performance with interactive charts</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToPreviousMonth}
                                className="h-8 w-8 p-0"
                            >
                                ←
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToCurrentMonth}
                                className="text-xs"
                            >
                                {getMonthName(selectedMonth.month, selectedMonth.year)}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToNextMonth}
                                className="h-8 w-8 p-0"
                            >
                                →
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-fit">
                    <Tabs defaultValue="orders" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="orders" className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Orders
                            </TabsTrigger>
                            <TabsTrigger value="revenue" className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Revenue
                            </TabsTrigger>
                            {/* <TabsTrigger value="status" className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Status
                            </TabsTrigger> */}
                            <TabsTrigger value="distribution" className="flex items-center gap-2">
                                <PieChart className="h-4 w-4" />
                                Distribution
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="orders" className="space-y-4">
                            <div className="h-[350px] w-full" style={{ display: 'flex', alignItems: 'stretch' }}>
                                <ChartContainer config={chartConfig} style={{ flex: 1 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            accessibilityLayer
                                            data={chartData}
                                            margin={{
                                                left: 12,
                                                right: 12,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={false}
                                                domain={[0, (dataMax: number) => Math.max(dataMax + 1, 2)]}
                                            />
                                            <Tooltip cursor={false} content={<ChartTooltipContent />} />
                                            <Legend content={<ChartLegendContent />} />
                                            <defs>
                                                <linearGradient id="fillSubmitted" x1="0" y1="0" x2="0" y2="1">
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#10b981"
                                                        stopOpacity={0.8}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#10b981"
                                                        stopOpacity={0.1}
                                                    />
                                                </linearGradient>
                                                <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#8b5cf6"
                                                        stopOpacity={0.8}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#8b5cf6"
                                                        stopOpacity={0.1}
                                                    />
                                                </linearGradient>
                                                <linearGradient id="fillFulfilled" x1="0" y1="0" x2="0" y2="1">
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#f59e0b"
                                                        stopOpacity={0.8}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#f59e0b"
                                                        stopOpacity={0.1}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <Area
                                                dataKey="submitted"
                                                type="monotone"
                                                fill="url(#fillSubmitted)"
                                                fillOpacity={0.4}
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                baseValue={0}
                                            />
                                            <Area
                                                dataKey="approved"
                                                type="monotone"
                                                fill="url(#fillApproved)"
                                                fillOpacity={0.4}
                                                stroke="#8b5cf6"
                                                strokeWidth={2}
                                                baseValue={0}
                                            />
                                            <Area
                                                dataKey="fulfilled"
                                                type="monotone"
                                                fill="url(#fillFulfilled)"
                                                fillOpacity={0.4}
                                                stroke="#f59e0b"
                                                strokeWidth={2}
                                                baseValue={0}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>
                        </TabsContent>

                        <TabsContent value="revenue" className="space-y-4">
                            <div className="h-[350px] w-full" style={{ display: 'flex', alignItems: 'stretch' }}>
                                <ChartContainer config={chartConfig} style={{ flex: 1 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 12 }}
                                                interval="preserveStartEnd"
                                                stroke="#888888"
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                stroke="#888888"
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip content={<ChartTooltipContent />} />
                                            <Legend content={<ChartLegendContent />} />
                                            <Bar
                                                dataKey="revenue"
                                                fill="#10b981"
                                                stroke="#059669"
                                                strokeWidth={1}
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>
                        </TabsContent>

                        <TabsContent value="status" className="space-y-4">
                            <div className="h-[350px] w-full" style={{ display: 'flex', alignItems: 'stretch' }}>
                                <ChartContainer config={chartConfig} style={{ flex: 1 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlySummary} layout="horizontal">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis
                                                type="number"
                                                tick={{ fontSize: 12 }}
                                                stroke="#888888"
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                tick={{ fontSize: 12 }}
                                                width={80}
                                                stroke="#888888"
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip content={<ChartTooltipContent />} />
                                            <Bar
                                                dataKey="value"
                                                fill="#3b82f6"
                                                stroke="#2563eb"
                                                strokeWidth={1}
                                                radius={[0, 4, 4, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>
                        </TabsContent>

                        <TabsContent value="distribution" className="space-y-4">
                            <div className="h-[350px] w-full" style={{ display: 'flex', alignItems: 'stretch' }}>
                                <ChartContainer config={chartConfig} style={{ flex: 1 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Pie
                                                data={statusDistribution}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                stroke="#ffffff"
                                                strokeWidth={2}
                                            >
                                                {statusDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<ChartTooltipContent />} />
                                            <Legend content={<ChartLegendContent />} />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Contact Forms Section */}
            {/* <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Contact Forms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalInquiries}</div>
                            <p className="text-xs text-muted-foreground">
                                All time
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{newInquiries}</div>
                            <p className="text-xs text-muted-foreground">
                                Require attention
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
                            <UserCheck className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{assignedInquiries}</div>
                            <p className="text-xs text-muted-foreground">
                                In progress
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{contactedInquiries}</div>
                            <p className="text-xs text-muted-foreground">
                                Followed up
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>Recent Contact Inquiries</CardTitle>
                            <CardDescription>Latest customer inquiries requiring attention</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockContactForms.slice(0, 5).map((inquiry) => (
                                    <div key={inquiry.id} className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                            <Mail className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {inquiry.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {inquiry.email} • {inquiry.itemInterested}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(inquiry.createdAt)}
                                            </p>
                                        </div>
                                        {getStatusBadge(inquiry.status)}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common administrative tasks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Button className="w-full justify-start" variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add New Product
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Users className="h-4 w-4 mr-2" />
                                    Create Agent Account
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Manage Pricing Tiers
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Mail className="h-4 w-4 mr-2" />
                                    View All Inquiries
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Settings className="h-4 w-4 mr-2" />
                                    System Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div> */}

            {/* Orders Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Submitted Orders</CardTitle>
                    <CardDescription>All orders that have been submitted</CardDescription>
                </CardHeader>
                <CardContent>
                    {isSubmittedOrdersLoading ? (
                        <div className="text-muted-foreground py-8">Loading orders...</div>
                    ) : submittedOrders instanceof Error ? (
                        <div className="text-red-600 py-8">Error: {submittedOrders.message}</div>
                    ) : (
                        (submittedOrders && submittedOrders.length === 0) ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <Clock className="h-12 w-12 text-blue-400 mb-4" />
                                <div className="text-lg font-semibold mb-1">No submitted orders yet</div>
                                <div className="text-sm">All caught up! New orders will appear here as soon as they're submitted.</div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {submittedOrders?.map((order: any) => (
                                    <OrderDashboardCard key={order.id} order={order} />
                                ))}
                            </div>
                        )
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Order Fulfillments</CardTitle>
                    <CardDescription>All orders that are fulfilled and ready to be shipped</CardDescription>
                </CardHeader>
                <CardContent>
                    {isSubmittedOrdersLoading ? (
                        <div className="text-muted-foreground py-8">Loading orders...</div>
                    ) : submittedOrders instanceof Error ? (
                        <div className="text-red-600 py-8">Error: {submittedOrders.message}</div>
                    ) : (
                        (() => {
                            // Filter for fulfilled orders
                            const fulfilledOrders = submittedOrders?.filter((order: any) => order.status === "fulfilled") || [];
                            if (fulfilledOrders.length === 0) {
                                return (
                                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                        <CheckCircle className="h-12 w-12 text-green-400 mb-4" />
                                        <div className="text-lg font-semibold mb-1">No fulfilled orders yet</div>
                                        <div className="text-sm">Once orders are fulfilled and ready to ship, they will appear here.</div>
                                    </div>
                                );
                            }
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {fulfilledOrders.map((order: any) => (
                                        <OrderDashboardCard key={order.id} order={order} />
                                    ))}
                                </div>
                            );
                        })()
                    )}
                </CardContent>
            </Card>




            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Products</CardTitle>
                        <CardDescription>Latest products added to the catalog</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {products?.slice(0, 5).map((product: any) => (
                                <div key={product.link} className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                        <Package className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {product.description}
                                        </p>
                                    </div>
                                    <Badge variant={product.inStock ? "default" : "secondary"}>
                                        {product.inStock ? "In Stock" : "Out of Stock"}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// Helper: status badge
function statusBadge(status: string) {
    const config: Record<string, { color: string; label: string }> = {
        draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
        submitted: { color: "bg-blue-100 text-blue-800", label: "Submitted" },
        approved: { color: "bg-green-100 text-green-800", label: "Approved" },
        fulfilled: { color: "bg-purple-100 text-purple-800", label: "Fulfilled" },
    };
    const c = config[status] || config.draft;
    return <Badge className={`${c.color} font-medium`}>{c.label}</Badge>;
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

function OrderDashboardCard({ order }: { order: any }) {
    const [open, setOpen] = useState(false);
    const hasItems = order.order_items && order.order_items.length > 0;
    const total = hasItems ? order.order_items.reduce((acc: number, item: any) => acc + item.price_at_order * item.quantity, 0) : 0;
    return (
        <Card className="border border-border rounded-lg hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-lg font-semibold text-foreground truncate">{order.order_name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">Created {formatDate(order.created_at)}</CardDescription>
                </div>
                <div className="flex gap-2 items-center">{statusBadge(order.status)}</div>
            </CardHeader>
            <CardContent className="flex flex-row gap-0">
                {/* Order Info */}
                <section className="w-1/2 pr-6 flex flex-col justify-between">
                    <div>
                        <span className="block text-xs font-medium text-muted-foreground mb-1">Notes</span>
                        <p className="text-sm text-foreground whitespace-pre-line min-h-[24px]">{order.notes || <span className="italic text-muted-foreground">No notes</span>}</p>
                    </div>
                    <div className="flex mt-4">
                        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                            View Details
                        </Button>
                    </div>
                </section>
                {/* Vertical Divider */}
                <div className="w-px bg-border mx-6" />
                {/* Items in the order */}
                <section className="w-1/2 flex flex-col justify-center">
                    <div className="mb-2">
                        <span className="block text-xs font-medium text-muted-foreground mb-1">Cart Items</span>
                        {hasItems ? (
                            <ul className="space-y-2">
                                {order.order_items.slice(0, 2).map((item: any) => (
                                    <li key={item.product_id} className="flex items-center gap-3">
                                        {item.products?.imageSrc && (
                                            <img src={item.products.imageSrc} alt={item.products.name} className="w-10 h-10 object-cover rounded border" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <span className="block font-medium text-foreground truncate">{item.products?.name}</span>
                                            <span className="block text-xs text-muted-foreground">Qty: {item.quantity} &bull; ${item.price_at_order}</span>
                                        </div>
                                    </li>
                                ))}
                                {order.order_items.length > 2 && (
                                    <li className="text-xs text-muted-foreground italic">+{order.order_items.length - 2} more item(s)...</li>
                                )}
                            </ul>
                        ) : (
                            <div className="text-xs text-muted-foreground italic py-4">No items in cart</div>
                        )}
                    </div>
                </section>
            </CardContent>
            {/* View Details Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl sm:max-w-[calc(90vw-2rem)] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-foreground">Order Details</DialogTitle>
                        <DialogDescription>Detailed view of this order and its cart items.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-2">
                                <div>
                                    <span className="block text-xs font-medium text-muted-foreground mb-1">Order Name</span>
                                    <p className="text-base font-semibold text-foreground">{order.order_name}</p>
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-muted-foreground mb-1">Status</span>
                                    {statusBadge(order.status)}
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-muted-foreground mb-1">Created</span>
                                    <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-muted-foreground mb-1">Notes</span>
                                    <p className="text-sm text-foreground whitespace-pre-line min-h-[24px]">{order.notes || <span className="italic text-muted-foreground">No notes</span>}</p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <span className="block text-xs font-medium text-muted-foreground mb-1">Cart Items</span>
                                {hasItems ? (
                                    <ul className="space-y-3 max- overflow-y-auto">
                                        {order.order_items.map((item: any) => (
                                            <li key={item.product_id} className="flex items-center gap-4 border-b border-border pb-2 last:border-b-0">
                                                {item.products?.imageSrc && (
                                                    <img src={item.products.imageSrc} alt={item.products.name} className="w-12 h-12 object-cover rounded border" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <span className="block font-medium text-foreground truncate">{item.products?.name}</span>
                                                    <span className="block text-xs text-muted-foreground">Qty: {item.quantity} &bull; ${item.price_at_order}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-foreground">${(item.price_at_order * item.quantity).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-xs text-muted-foreground italic py-4">No items in cart</div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
