"use client"

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { FileText, Mail, Phone, Building, Calendar, DollarSign, ExternalLink, Search, Filter, X, BarChart3, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useQuoteRequests } from '../actions/hook/useQuoteRequests'
import Link from 'next/link'

interface QuoteRequestItem {
    id: string
    product_id: string
    product_name: string
    quantity: number
    notes?: string
}

interface QuoteRequest {
    id: string
    customer_name: string
    customer_email: string
    customer_phone: string
    customer_company?: string
    customer_message?: string
    total_items: number
    status: 'pending' | 'approved' | 'closed' | 'rejected'
    created_at: string
    quote_request_items: QuoteRequestItem[]
}

export function QuoteRequests() {
    const { data: quoteRequests, isLoading, isError, refetch } = useQuoteRequests()
    const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null)

    // Filter states
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [dateFilter, setDateFilter] = useState<string>('all')
    const [showFilters, setShowFilters] = useState(false)

    const updateStatus = async (requestId: string, status: QuoteRequest['status']) => {
        try {
            const response = await fetch(`/api/quote-requests/${requestId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            })

            if (response.ok) {
                toast.success('Status updated successfully')
                refetch() // Refresh the list
            } else {
                throw new Error('Failed to update status')
            }
        } catch (error) {
            console.error('Error updating status:', error)
            toast.error('Failed to update status')
        }
    }

    const getStatusBadge = (status: QuoteRequest['status']) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Pending' },
            approved: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Quoted' },
            closed: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'Closed' },
            rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Rejected' },
        }

        const config = statusConfig[status]
        return (
            <Badge className={config.color}>
                {config.label}
            </Badge>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    // Calculate stats
    const stats = useMemo(() => {
        if (!quoteRequests) return null

        const total = quoteRequests.length
        const pending = quoteRequests.filter(r => r.status === 'pending').length
        const approved = quoteRequests.filter(r => r.status === 'approved').length
        const closed = quoteRequests.filter(r => r.status === 'closed').length
        const rejected = quoteRequests.filter(r => r.status === 'rejected').length

        return { total, pending, approved, closed, rejected }
    }, [quoteRequests])

    // Filter quote requests
    const filteredRequests = useMemo(() => {
        if (!quoteRequests) return []

        return quoteRequests.filter(request => {
            // Search filter
            const matchesSearch = searchTerm === '' ||
                request.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.customer_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.customer_phone.includes(searchTerm)

            // Status filter
            const matchesStatus = statusFilter === 'all' || request.status === statusFilter

            // Date filter
            const requestDate = new Date(request.created_at)
            const now = new Date()
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

            let matchesDate = true
            switch (dateFilter) {
                case 'today':
                    matchesDate = requestDate >= oneDayAgo
                    break
                case 'week':
                    matchesDate = requestDate >= sevenDaysAgo
                    break
                case 'month':
                    matchesDate = requestDate >= thirtyDaysAgo
                    break
                default:
                    matchesDate = true
            }

            return matchesSearch && matchesStatus && matchesDate
        })
    }, [quoteRequests, searchTerm, statusFilter, dateFilter])

    const clearFilters = () => {
        setSearchTerm('')
        setStatusFilter('all')
        setDateFilter('all')
    }

    const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || dateFilter !== 'all'

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">Loading quote requests...</div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">Error loading quote requests</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Quote Requests</h2>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2"
                    >
                        <Filter className="h-4 w-4" />
                        <span>Filters</span>
                    </Button>
                    <Button onClick={async () => await refetch()} variant="outline">
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Total</span>
                            </div>
                            <div className="text-2xl font-bold mt-2">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium">Pending</span>
                            </div>
                            <div className="text-2xl font-bold mt-2 text-yellow-600">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium">Approved</span>
                            </div>
                            <div className="text-2xl font-bold mt-2 text-green-600">{stats.approved}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-medium">Rejected</span>
                            </div>
                            <div className="text-2xl font-bold mt-2 text-red-600">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">Closed</span>
                            </div>
                            <div className="text-2xl font-bold mt-2 text-gray-600">{stats.closed}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            {showFilters && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, company..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="closed">Closed</option>
                            </select>

                            {/* Date Filter */}
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">Last 7 Days</option>
                                <option value="month">Last 30 Days</option>
                            </select>

                            {/* Clear Filters */}
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                disabled={!hasActiveFilters}
                                className="flex items-center space-x-2"
                            >
                                <X className="h-4 w-4" />
                                <span>Clear Filters</span>
                            </Button>
                        </div>

                        {hasActiveFilters && (
                            <div className="mt-4 flex items-center space-x-2">
                                <Badge variant="secondary">
                                    {filteredRequests.length} of {quoteRequests?.length || 0} results
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {filteredRequests?.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No quote requests found</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredRequests?.map((request) => (
                        <Card key={request.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{request.customer_name} {request.customer_last_name}</CardTitle>
                                    {getStatusBadge(request.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{request.customer_email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{request.customer_phone}</span>
                                    </div>
                                    {request.customer_company && (
                                        <div className="flex items-center space-x-2">
                                            <Building className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{request.customer_company}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{formatDate(request.created_at)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        {/* <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">${request.total_value.toFixed(2)}</span>
                                        <span className="text-sm text-muted-foreground">
                                            ({request.total_items} items)
                                        </span> */}
                                    </div>

                                    <div className="flex space-x-2">
                                        <Link href={`/master-admin/quote-requests/${request.id}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center hover:cursor-pointer space-x-2"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                <span>View Details</span>
                                            </Button>
                                        </Link>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedRequest(request)}
                                                    className='hover:cursor-pointer'
                                                >
                                                    Quick View
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Quote Request Details</DialogTitle>
                                                </DialogHeader>
                                                {selectedRequest && (
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-sm font-medium">Customer Name</label>
                                                                <p className="text-sm text-muted-foreground">{selectedRequest.customer_name}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-sm font-medium">Email</label>
                                                                <p className="text-sm text-muted-foreground">{selectedRequest.customer_email}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-sm font-medium">Phone</label>
                                                                <p className="text-sm text-muted-foreground">{selectedRequest.customer_phone}</p>
                                                            </div>
                                                            {selectedRequest.customer_company && (
                                                                <div>
                                                                    <label className="text-sm font-medium">Company</label>
                                                                    <p className="text-sm text-muted-foreground">{selectedRequest.customer_company}</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {selectedRequest.customer_message && (
                                                            <div>
                                                                <label className="text-sm font-medium">Message</label>
                                                                <p className="text-sm text-muted-foreground">{selectedRequest.customer_message}</p>
                                                            </div>
                                                        )}

                                                        <div>
                                                            <label className="text-sm font-medium">Requested Items</label>
                                                            <div className="mt-2 space-y-2">
                                                                {selectedRequest.quote_request_items.map((item) => (
                                                                    <div key={item.id} className="border rounded-lg p-3">
                                                                        <div className="flex justify-between items-start">
                                                                            <div>
                                                                                <p className="font-medium">{item.product_name}</p>
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    {/* Quantity: {item.quantity} × ${item.price.toFixed(2)} */}
                                                                                </p>
                                                                                {item.notes && (
                                                                                    <p className="text-sm text-muted-foreground mt-1">
                                                                                        Notes: {item.notes}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <p className="font-medium">
                                                                                {/* ${(item.quantity * item.price).toFixed(2)} */}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
} 