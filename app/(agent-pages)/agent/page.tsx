'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    User,
    Mail,
    Phone,
    MessageSquare,
    Package,
    DollarSign,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    UserCheck,
    Star,
    TrendingUp,
    Settings,
    Search,
    Filter,
    Eye,
    Edit,
    Plus,
    RefreshCw,
    Loader2,
    ShoppingCart,
    Minus,
    Trash2,
    CreditCard,
    UserPlus,
    LogOut,
    Users,
    ShoppingBag,
    Plane,
    ClipboardList,
    Send,
    PackageCheck,
    List
} from "lucide-react"
import { useProfile } from "@/lib/hooks/useProfile"
import makeNewOrder from "../actions/make-new-order"
import { useSignOut } from "@/lib/auth-utils"
import { useAgentsInquiries } from "@/components/states/inquiries"
import { useInquiryNotes, useAddInquiryNote } from "@/components/states/notes"
import { agentUpdateInquiry } from "@/components/actions/agent-update inquirey"
import { toast } from "sonner"
import { useGetAgentById } from "@/app/(master-admin)/master-admin/actions/AgentStore"
import AgentProductsTab from "@/app/(agent-pages)/components/AgentProductsTab"
import NewOrderDialog from "./NewOrderDialog";
import useOrderState from "../components/order-state"
import OrdersSection from "./OrdersSection";
import { assignOrderItems } from "../actions/assign-order-items"
import { Product } from "@/lib/types"
import { createOrderWithItems } from "../actions/create-order-with-items"
import { syncOrderItems } from "../actions/sync-order-items"
import AgentOrdersScreen from "../components/AgentOrdersScreen"




export default function AgentPage() {
    const { profile } = useProfile()
    const [selectedInquiry, setSelectedInquiry] = useState<any>(null)
    const [openInquiryDialog, setOpenInquiryDialog] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const signOut = useSignOut()
    const [editForm, setEditForm] = useState({
        status: '',
        priority: ''
    })
    const [isUpdating, setIsUpdating] = useState(false)
    const [activeTab, setActiveTab] = useState('dashboard')
    const [cartItems, setCartItems] = useState<any[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [cartMode, setCartMode] = useState<'guest' | 'inquiry'>('guest')
    const [isAssigningOrderItems, setIsAssigningOrderItems] = useState(false)
    const [selectedInquiryForCart, setSelectedInquiryForCart] = useState<any>(null)
    const onSetSelectedInquiryForCart = (inquiry: any) => {
        setSelectedInquiryForCart(inquiry)
        setActiveTab('products')
    }
    const [showNoteForm, setShowNoteForm] = useState(false)
    const [newNote, setNewNote] = useState("")
    const [isAddingNote, setIsAddingNote] = useState(false)
    const [openOrderDialog, setOpenOrderDialog] = useState(false);
    const [openCreateOrderDialog, setOpenCreateOrderDialog] = useState(false);
    const [newOrderForm, setNewOrderForm] = useState({
        order_name: "",
        notes: ""
    });
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const { data: agent, isLoading } = useGetAgentById(profile?.id || '')
    const { data: inquiries, isLoading: inquiriesLoading, refetch } = useAgentsInquiries(profile?.id || '')
    const { data: orders, isLoading: ordersLoading, refetch: refetchAgentOrders } = useOrderState(profile?.id || '')

    const { data: notes, isLoading: notesLoading } = useInquiryNotes(selectedInquiry?.id || '')
    const addNoteMutation = useAddInquiryNote()
    // Don't render anything until we have a valid profile ID
    if (!profile?.id) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                        <div className="relative bg-primary/10 rounded-full p-6 items-center justify-center flex">
                            <User className="h-12 w-12 text-primary animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">Loading Profile</h2>
                        <p className="text-muted-foreground">Please wait while we load your profile...</p>
                    </div>
                    <div className="flex justify-center">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                        <div className="relative bg-primary/10 rounded-full p-6 items-center justify-center flex">
                            <User className="h-12 w-12 text-primary animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">Loading Agent Dashboard</h2>
                        <p className="text-muted-foreground">Setting up your workspace...</p>
                    </div>
                    <div className="flex justify-center">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!agent) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md">
                    <div className="relative">
                        <div className="absolute inset-0 bg-destructive/20 rounded-full animate-ping"></div>
                        <div className="relative bg-destructive/10 rounded-full p-6">
                            <AlertCircle className="h-12 w-12 text-destructive animate-pulse" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-foreground">Agent Not Found</h2>
                        <p className="text-muted-foreground">We couldn't find your agent profile. Please contact support.</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="animate-pulse"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }
    const getStatusBadge = (status: string) => {
        if (!status) return null
        const statusConfig = {
            new: { color: "bg-blue-100 text-blue-800", icon: AlertCircle },
            assigned: { color: "bg-purple-100 text-purple-800", icon: UserCheck },
            contacted: { color: "bg-cyan-100 text-cyan-800", icon: CheckCircle },
            follow_up: { color: "bg-orange-100 text-orange-800", icon: Clock },
            completed: { color: "bg-green-100 text-green-800", icon: CheckCircle }
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        if (!config) return null
        const Icon = config.icon
        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </Badge>
        )
    }

    const getPriorityBadge = (priority: string) => {
        const priorityConfig = {
            high: { color: "bg-red-100 text-red-800" },
            medium: { color: "bg-yellow-100 text-yellow-800" },
            low: { color: "bg-green-100 text-green-800" }
        }
        const config = priorityConfig[priority as keyof typeof priorityConfig]
        return (
            <Badge className={config.color}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
        )
    }

    const formatDate = (dateString: Date) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const filteredInquiries = inquiries?.filter(inquiry => {
        const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.itemInterested.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter
        const matchesPriority = priorityFilter === "all" || inquiry.priority === priorityFilter
        return matchesSearch && matchesStatus && matchesPriority
    })

    const handleEditInquiry = (inquiry: any) => {
        setSelectedInquiry(inquiry)
        setEditForm({
            status: inquiry.status,
            priority: inquiry.priority
        })
        setOpenEditDialog(true)
    }

    const handleUpdateInquiry = async () => {
        setIsUpdating(true)
        const result = await agentUpdateInquiry(selectedInquiry.id, editForm)
        if (!result) {
            toast.success('Inquiry updated successfully')
            refetch()
        } else {
            toast.error('Failed to update inquiry')
        }
        setIsUpdating(false)
        setOpenEditDialog(false)
    }

    const getStatusOptions = () => [
        { value: 'new', label: 'New', icon: AlertCircle, color: 'text-blue-600' },
        { value: 'assigned', label: 'Assigned', icon: UserCheck, color: 'text-purple-600' },
        { value: 'contacted', label: 'Contacted', icon: UserCheck, color: 'text-yellow-600' },
        { value: 'follow_up', label: 'Follow Up', icon: Clock, color: 'text-orange-600' },
        { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600' }
    ]

    const getPriorityOptions = () => [
        { value: 'high', label: 'High Priority', color: 'text-red-600' },
        { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
        { value: 'low', label: 'Low Priority', color: 'text-green-600' }
    ]

    const handleAddNote = async () => {
        if (!newNote.trim() || !selectedInquiry?.id || !profile?.id) return

        setIsAddingNote(true)
        try {
            await addNoteMutation.mutateAsync({
                inquiryId: selectedInquiry.id,
                agentId: profile.id,
                agent_name: agent.first_name + " " + agent.last_name,
                note: newNote.trim()
            })
            setNewNote("")
            setShowNoteForm(false)
            toast.success('Note added successfully')
        } catch (error) {
            toast.error('Failed to add note')
        } finally {
            setIsAddingNote(false)
        }
    }

    const handleCancelNote = () => {
        setNewNote("")
        setShowNoteForm(false)
    }

    // Cart functions
    const addToCart = (product: any) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id)
            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: Number(item.quantity) + 1 }
                        : item
                )
            }
            return [...prev, { ...product, quantity: 1 }]
        })
    }

    const removeFromCart = (productId: string) => {
        setCartItems(prev => prev.filter(item => item.id !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        setCartItems(prev =>
            prev.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        )
    }

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const getTaxAmount = () => {
        return getCartTotal() * 0.08 // 8% tax
    }

    const getGrandTotal = () => {
        return getCartTotal() + getTaxAmount()
    }

    const clearCart = () => {
        setCartItems([])
        setSelectedInquiryForCart(null)
        setCartMode('guest')
    }

    const handleAssignOrderItems = async ({ cartItems, selectedInquiryForCart }: {
        cartItems: {
            id: string,
            quantity: number,
            price: number
        }[], selectedInquiryForCart: any
    }) => {
        if (!selectedInquiryForCart) {
            toast.error('Please select an order to assign items to')
            return
        }
        setIsAssigningOrderItems(true)
        const orders_items = cartItems.map((item) => ({
            order_id: selectedInquiryForCart.id,
            product_id: item.id,
            quantity: Number(item.quantity),
            price_at_order: item.price
        }))
        console.log('Selected Inquiry For Cart items', orders_items)
        console.log('Order Items', orders_items)
        const result = await syncOrderItems(selectedInquiryForCart.id, orders_items)
        if (result instanceof Error) {
            toast.error(result.message)
        } else {
            toast.success('Order items assigned successfully')
            setIsCartOpen(false)
            clearCart()
            refetchAgentOrders()
        }
        setIsAssigningOrderItems(false)
    }

    console.log(orders)
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Agent Dashboard</h1>
                            <p className="text-muted-foreground">Welcome back, {agent.first_name}!</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="flex items-center gap-2">
                                <Star className="h-4 w-4" />
                                {agent.agent_tiers.name}
                            </Badge>
                            <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </Button>
                            <Button variant="outline" size="sm" onClick={signOut}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="border-b border-border">
                        <nav className="flex items-center justify-between">
                            <div className="flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('dashboard')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'dashboard'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Dashboard
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('products')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'products'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Products
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'orders'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <List className="h-4 w-4" />
                                        Orders
                                    </div>
                                </button>
                            </div>

                            {/* Shopping Cart Button */}
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsCartOpen(true)}
                                    className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-200 hover:scale-105"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    Cart
                                    {cartItems.length > 0 && (
                                        <Badge variant="outline" className="ml-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs">
                                            {cartItems.length}
                                        </Badge>
                                    )}
                                </Button>
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'dashboard' ? (
                    <>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Total Orders */}
                            <div className="bg-white dark:bg-muted rounded-xl shadow-md p-6 flex flex-col items-start gap-2 animate-in fade-in-0 slide-in-from-bottom-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <ClipboardList className="h-6 w-6 text-blue-600 animate-pulse" />
                                    <span className="text-lg font-semibold">Total Orders</span>
                                </div>
                                <span className="text-3xl font-bold text-blue-700">{Array.isArray(orders) ? orders.length : 0}</span>
                            </div>
                            {/* Orders Submitted */}
                            <div className="bg-white dark:bg-muted rounded-xl shadow-md p-6 flex flex-col items-start gap-2 animate-in fade-in-0 slide-in-from-bottom-2 delay-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Send className="h-6 w-6 text-green-600 " />
                                    <span className="text-lg font-semibold">Submitted</span>
                                </div>
                                <span className="text-3xl font-bold text-green-700">{Array.isArray(orders) ? orders.filter((o: any) => o.status === 'submitted').length : 0}</span>
                            </div>
                            {/* Orders Fulfilled */}
                            <div className="bg-white dark:bg-muted rounded-xl shadow-md p-6 flex flex-col items-start gap-2 animate-in fade-in-0 slide-in-from-bottom-2 delay-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <PackageCheck className="h-6 w-6 text-purple-600 " />
                                    <span className="text-lg font-semibold">Fulfilled</span>
                                </div>
                                <span className="text-3xl font-bold text-purple-700">{Array.isArray(orders) ? orders.filter((o: any) => o.status === 'fulfilled' || o.status === 'completed').length : 0}</span>
                            </div>
                            {/* Most Recently Updated Order/Cart Item */}
                            <div className="bg-white dark:bg-muted rounded-xl shadow-md p-6 flex flex-col items-start gap-2 animate-in fade-in-0 slide-in-from-bottom-2 delay-300">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="h-6 w-6 text-orange-600 animate-spin-slow" />
                                    <span className="text-lg font-semibold">Most Recent Update</span>
                                </div>
                                {Array.isArray(orders) && orders.length > 0 ? (
                                    (() => {
                                        // Find the most recently updated order or order item
                                        let mostRecentOrder = orders[0];
                                        for (const curr of orders) {
                                            if (new Date(curr.created_at) > new Date(mostRecentOrder.created_at)) {
                                                mostRecentOrder = curr;
                                            }
                                        }
                                        let mostRecentItem: any = null;
                                        for (const order of orders) {
                                            for (const item of order.order_items) {
                                                if (!mostRecentItem || new Date(item.updated_at) > new Date(mostRecentItem.updated_at)) {
                                                    mostRecentItem = { ...item, order_name: order.order_name };
                                                }
                                            }
                                        }
                                        if (mostRecentItem && new Date(mostRecentItem.created_at) > new Date(mostRecentOrder.created_at)) {
                                            return (
                                                <div className="text-sm text-muted-foreground">
                                                    <span className="font-semibold">Cart Item:</span> {mostRecentItem.products?.name || 'N/A'}<br />
                                                    <span className="font-semibold">Order:</span> {mostRecentItem.order_name}<br />
                                                    <span className="font-semibold">Updated:</span> {new Date(mostRecentItem.updated_at).toLocaleString()}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className="text-sm text-muted-foreground">
                                                    <span className="font-semibold">Order:</span> {mostRecentOrder.order_name}<br />
                                                    <span className="font-semibold">Updated:</span> {new Date(mostRecentOrder.updated_at).toLocaleString()}
                                                </div>
                                            );
                                        }
                                    })()
                                ) : (
                                    <span className="text-muted-foreground">No recent updates</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Assigned Inquiries */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Manage Your Orders</CardTitle>
                                                <CardDescription>Manage your orders and their status</CardDescription>
                                            </div>
                                            <Button size="sm" onClick={() => setOpenOrderDialog(true)}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                New Order
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Filters */}
                                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search orders..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                            <select
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                                className="px-3 py-2 border border-border rounded-md"
                                            >
                                                <option value="all">All Status</option>
                                                <option value="draft">Draft</option>
                                                <option value="submitted">Submitted</option>
                                                <option value="approved">Approved</option>
                                                <option value="fulfilled">Fulfilled</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            {/* <select
                                                value={priorityFilter}
                                                onChange={(e) => setPriorityFilter(e.target.value)}
                                                className="px-3 py-2 border border-border rounded-md"
                                            >
                                                <option value="all">All Priority</option>
                                                <option value="high">High</option>
                                                <option value="medium">Medium</option>
                                                <option value="low">Low</option>
                                            </select> */}
                                        </div>

                                        {/* Orders List */}
                                        <section className="space-y-4">
                                            {ordersLoading ? (
                                                <div className="flex items-center gap-2 justify-center py-8">
                                                    <Loader2 className="h-8 w-8 animate-spin" />
                                                    Loading orders...
                                                </div>
                                            ) : orders instanceof Error ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex items-center gap-2 justify-center py-8">
                                                        <AlertCircle className="h-8 w-8 text-destructive" />
                                                        Failed to load orders
                                                    </div>
                                                    <div className="text-sm text-muted-foreground"> Error: {orders.message}</div>
                                                </div>
                                            ) : (
                                                <OrdersSection
                                                    orders={orders || []}
                                                    refetchOrders={refetchAgentOrders}
                                                    setSelectedInquiryForCart={onSetSelectedInquiryForCart}
                                                    setCartItems={setCartItems}
                                                />
                                            )}
                                        </section>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Tier Products */}
                            <div>

                            </div>
                        </div>
                    </>
                ) : activeTab === 'products' ? (
                    <AgentProductsTab
                        agent_id={profile?.id || ''}
                        addToCart={addToCart}
                        selectedInquiryForCart={selectedInquiryForCart}
                    />
                ) : (
                    <AgentOrdersScreen />
                )}

                {/* Shopping Cart Dialog */}
                <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                    <DialogContent className="max-w-2xl sm:max-w-[calc(90vw-2rem)] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-primary" />
                                Shopping Cart
                                {cartItems.length > 0 && (
                                    <Badge variant="outline" className="ml-2">
                                        {cartItems.length} items
                                    </Badge>
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                Review your cart and proceed to checkout
                            </DialogDescription>
                        </DialogHeader>

                        {cartItems.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 rounded-full"></div>
                                    <div className="relative bg-primary/10 flex items-center justify-center w-fit mx-auto rounded-full p-6">
                                        <ShoppingCart className="h-12 w-12 self-center text-primary animate-pulse" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-3">Your cart is empty</h3>
                                <Button
                                    onClick={() => {
                                        setActiveTab('products')
                                        setIsCartOpen(false)
                                    }}
                                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-2"
                                >
                                    <Package className="h-5 w-5 mr-2 animate-bounce" />
                                    Start Shopping
                                    <div className="ml-2 flex space-x-1">
                                        <div className="w-1 h-1 bg-primary-foreground rounded-full animate-pulse"></div>
                                        <div className="w-1 h-1 bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-1 h-1 bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Cart Items */}
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={item.imageSrc}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm font-medium text-foreground">
                                                        ${item.price}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}
                                                            className="h-6 w-6 p-0"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                                                            className="h-6 w-6 p-0"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Cart Summary */}
                                <div className="border-t border-border pt-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal:</span>
                                            <span>${getCartTotal().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Tax (8%):</span>
                                            <span>${getTaxAmount().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-medium text-lg border-t border-border pt-2">
                                            <span>Total:</span>
                                            <span className="text-green-600">${getGrandTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Options */}
                                <div className="space-y-4">
                                    {/* Replace the green cart summary box with a dropdown */}
                                    <div className="mb-6 flex items-center gap-2">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium mb-1">Assign Cart to Order</label>
                                            <select
                                                className="w-full px-3 py-2 border border-green-200 rounded-lg bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                                                value={selectedInquiryForCart?.id || ""}
                                                onChange={e => {
                                                    const selected = Array.isArray(orders) ? orders.find((order: any) => order.id === e.target.value) || null : null;
                                                    setSelectedInquiryForCart(selected);
                                                }}
                                                disabled={!Array.isArray(orders) || orders.length === 0}
                                            >
                                                <option value="">Select an order...</option>
                                                {Array.isArray(orders) && orders.length > 0 && orders.map((order: any) => (
                                                    <option key={order.id} value={order.id}>{order.order_name}</option>
                                                ))}
                                            </select>
                                            {(!Array.isArray(orders) || orders.length === 0) && (
                                                <div className="text-xs text-muted-foreground mt-2">No orders available. Create an order first.</div>
                                            )}
                                        </div>
                                    </div>

                                    {cartMode === 'inquiry' && (
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium">Select Inquiry:</label>
                                            <select
                                                value={selectedInquiryForCart?.id || ''}
                                                onChange={(e) => {
                                                    const inquiry = inquiries?.find(i => i.id === parseInt(e.target.value))
                                                    setSelectedInquiryForCart(inquiry || null)
                                                }}
                                                className="w-full px-3 py-2 border border-border rounded-md"
                                            >
                                                <option value="">Choose an inquiry...</option>
                                                {inquiries?.map((inquiry) => (
                                                    <option key={inquiry.id} value={inquiry.id}>
                                                        {inquiry.name} - {inquiry.item_interested}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={clearCart}
                                            className="flex-1"
                                        >
                                            Clear Cart
                                        </Button>
                                        {selectedInquiryForCart &&
                                            <Button
                                                onClick={async () => {
                                                    await handleAssignOrderItems({ cartItems, selectedInquiryForCart })
                                                }}
                                                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                                                disabled={isAssigningOrderItems}
                                            >
                                                {isAssigningOrderItems ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Assigning...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingBag className="h-4 w-4 mr-2" />
                                                        Assign to Order
                                                    </>
                                                )}
                                            </Button>}
                                        {selectedInquiryForCart ?
                                            <Button
                                                onClick={() => {
                                                    // Handle checkout logic here
                                                    console.log('Checkout:', {
                                                        items: cartItems,
                                                        mode: cartMode,
                                                        inquiry: selectedInquiryForCart,
                                                        total: getGrandTotal()
                                                    })
                                                    clearCart()
                                                    setIsCartOpen(false)
                                                }}
                                                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                                            >
                                                <Plane className="h-4 w-4 mr-2" />
                                                Submit Order
                                            </Button> :
                                            <Button
                                                onClick={() => setOpenCreateOrderDialog(true)}
                                                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create New Order
                                            </Button>
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* New Order Dialog */}
                <NewOrderDialog
                    open={openOrderDialog}
                    onOpenChange={setOpenOrderDialog}
                    refetchAgentOrders={refetchAgentOrders}
                />

                {/* Create New Order Dialog */}
                <Dialog open={openCreateOrderDialog} onOpenChange={setOpenCreateOrderDialog}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Create New Order</DialogTitle>
                            <DialogDescription>
                                Create a new order and assign current cart items to it.
                            </DialogDescription>
                        </DialogHeader>
                        <form
                            className="space-y-6"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setIsCreatingOrder(true);
                                const order_items = cartItems.map((item) => ({
                                    product_id: item.id,
                                    quantity: item.quantity,
                                    price_at_order: item.price
                                }))
                                try {

                                    const result = await createOrderWithItems(profile.id, newOrderForm.order_name, newOrderForm.notes, order_items);
                                    if (result instanceof Error) {
                                        toast.error(result.message)
                                    }
                                    else {
                                        toast.success('Order created successfully')
                                        setOpenCreateOrderDialog(false);
                                        setNewOrderForm({ order_name: "", notes: "" });
                                        clearCart();
                                        refetchAgentOrders();
                                        setIsCartOpen(false);
                                    }
                                } finally {
                                    setIsCreatingOrder(false);
                                }
                            }}
                        >
                            <div>
                                <label className="block text-sm font-medium mb-1">Order Name</label>
                                <input
                                    className="w-full px-3 py-2 border border-border rounded-md"
                                    value={newOrderForm.order_name}
                                    onChange={e => setNewOrderForm(f => ({ ...f, order_name: e.target.value }))}
                                    placeholder="Enter order name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Notes</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-border rounded-md min-h-[80px] resize-none"
                                    value={newOrderForm.notes}
                                    onChange={e => setNewOrderForm(f => ({ ...f, notes: e.target.value }))}
                                    placeholder="Add any notes for this order..."
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpenCreateOrderDialog(false)}
                                    className="flex-1"
                                    disabled={isCreatingOrder}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                                    disabled={isCreatingOrder || !newOrderForm.order_name}
                                >
                                    {isCreatingOrder ? "Creating..." : "Create Order"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    )
}