import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    DollarSign,
    Package,
    Users,
    Calendar,
    AlertCircle,
    ShoppingCart
} from 'lucide-react'

interface QuoteRequestStatsProps {
    stats: {
        total: number
        pending: number
        approved: number
        closed: number
        rejected: number
        totalValue: number
        averageValue: number
        thisMonth: number
        lastMonth: number
        conversionRate: number
        avgResponseTime: number
    }
}

export default function QuoteRequestStats({ stats }: QuoteRequestStatsProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="h-4 w-4" />
            case 'approved': return <CheckCircle className="h-4 w-4" />
            case 'closed': return <XCircle className="h-4 w-4" />
            case 'rejected': return <XCircle className="h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const formatPercentage = (value: number) => {
        return `${(value * 100).toFixed(1)}%`
    }

    return (
        <div className="space-y-6">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Quote Requests */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            All time quote requests
                        </p>
                    </CardContent>
                </Card>

                {/* Total Value */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
                        <p className="text-xs text-muted-foreground">
                            Combined quote value
                        </p>
                    </CardContent>
                </Card>

                {/* Conversion Rate */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPercentage(stats.conversionRate)}</div>
                        <p className="text-xs text-muted-foreground">
                            Quote to order rate
                        </p>
                    </CardContent>
                </Card>

                {/* Average Response Time */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgResponseTime}h</div>
                        <p className="text-xs text-muted-foreground">
                            Average response time
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Status Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { status: 'pending', count: stats.pending, label: 'Pending Review' },
                                { status: 'approved', count: stats.approved, label: 'Approved' },
                                { status: 'closed', count: stats.closed, label: 'Closed' },
                                { status: 'rejected', count: stats.rejected, label: 'Rejected' }
                            ].map((item) => (
                                <div key={item.status} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(item.status)}
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">{item.count}</span>
                                        <Badge className={getStatusColor(item.status)}>
                                            {stats.total > 0 ? formatPercentage(item.count / stats.total) : '0%'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Comparison */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Monthly Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium">This Month</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-blue-600">{stats.thisMonth}</div>
                                    <p className="text-xs text-muted-foreground">New requests</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium">Last Month</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-gray-600">{stats.lastMonth}</div>
                                    <p className="text-xs text-muted-foreground">Previous period</p>
                                </div>
                            </div>
                            <div className="pt-2 border-t">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Growth</span>
                                    <Badge variant={stats.thisMonth > stats.lastMonth ? "default" : "secondary"}>
                                        {stats.lastMonth > 0
                                            ? `${((stats.thisMonth - stats.lastMonth) / stats.lastMonth * 100).toFixed(1)}%`
                                            : 'N/A'
                                        }
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <h3 className="font-medium text-blue-900 dark:text-blue-100">Pending Reviews</h3>
                            <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">Need attention</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <h3 className="font-medium text-green-900 dark:text-green-100">Approved</h3>
                            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                            <p className="text-xs text-green-700 dark:text-green-300">Converted to orders</p>
                        </div>
                        <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                            <DollarSign className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                            <h3 className="font-medium text-amber-900 dark:text-amber-100">Avg Value</h3>
                            <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.averageValue)}</p>
                            <p className="text-xs text-amber-700 dark:text-amber-300">Per request</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 