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
    Users
} from "lucide-react"
import { useProfile } from "@/lib/hooks/useProfile"
import { useGetAgentById } from "../(admin-pages)/admin/actions/AgentStore"
import AgentProductsTab from "../(admin-pages)/admin/components/AgentProductsTab"
import { useSignOut } from "@/lib/auth-utils"
import { useAgentsInquiries } from "@/components/states/inquiries"
import { useInquiryNotes, useAddInquiryNote } from "@/components/states/notes"
import { agentUpdateInquiry } from "@/components/actions/agent-update inquirey"
import { toast } from "sonner"




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
    const [selectedInquiryForCart, setSelectedInquiryForCart] = useState<any>(null)
    const [showNoteForm, setShowNoteForm] = useState(false)
    const [newNote, setNewNote] = useState("")
    const [isAddingNote, setIsAddingNote] = useState(false)
    const { data: agent, isLoading } = useGetAgentById(profile?.id || '')
    const { data: inquiries, isLoading: inquiriesLoading, refetch } = useAgentsInquiries(profile?.id || '')
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
                        ? { ...item, quantity: item.quantity + 1 }
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
                                            <Button size="sm">
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
                                                    placeholder="Search inquiries..."
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
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="follow_up">Follow Up</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                            <select
                                                value={priorityFilter}
                                                onChange={(e) => setPriorityFilter(e.target.value)}
                                                className="px-3 py-2 border border-border rounded-md"
                                            >
                                                <option value="all">All Priority</option>
                                                <option value="high">High</option>
                                                <option value="medium">Medium</option>
                                                <option value="low">Low</option>
                                            </select>
                                        </div>

                                        {/* Inquiries List */}
                                        <div className="space-y-4">
                                            {filteredInquiries?.map((inquiry) => (
                                                <div key={inquiry.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 space-y-3">
                                                            <div className="flex items-center gap-4">
                                                                <div>
                                                                    <h3 className="font-semibold text-foreground">{inquiry.name}</h3>
                                                                    <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    {getStatusBadge(inquiry.status)}
                                                                    {getPriorityBadge(inquiry.priority)}
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                                    <span>{inquiry.phone}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Package className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="truncate">{inquiry.item_interested}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                    <span>{new Date(inquiry.created_at).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}</span>
                                                                </div>

                                                            </div>

                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-muted-foreground mb-1">Comments</span>
                                                                <div className="flex items-center gap-2">
                                                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                                    <p className="text-sm text-muted-foreground line-clamp-2">{inquiry.comments}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 ml-4">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setSelectedInquiry(inquiry)
                                                                    setOpenInquiryDialog(true)
                                                                }}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleEditInquiry(inquiry)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                onClick={() => {
                                                                    setSelectedInquiryForCart(inquiry)
                                                                    setCartMode('inquiry')
                                                                    setActiveTab('products')
                                                                    setIsCartOpen(false)
                                                                }}
                                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                            >
                                                                <ShoppingCart className="h-4 w-4 mr-1" />
                                                                Shop for Customer
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Tier Products */}
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Your Tier Products</CardTitle>
                                        <CardDescription>Products available at your {agent.agent_tiers.name} tier pricing</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* {mockTierProducts.slice(0, 4).map((product) => (
                                                <div key={product.id} className="border border-border rounded-lg p-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                                            <img
                                                                src={product.imageSrc}
                                                                alt={product.name}
                                                                className="w-8 h-8 object-cover rounded"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-foreground truncate">{product.name}</h4>
                                                            <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-sm line-through text-muted-foreground">
                                                                    ${product.regularPrice}
                                                                </span>
                                                                <span className="text-sm font-bold text-green-600">
                                                                    ${product.tierPrice}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))} */}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                ) : (
                    <AgentProductsTab
                        agent_id={profile?.id || ''}
                        addToCart={addToCart}
                        selectedInquiryForCart={selectedInquiryForCart}
                    />
                )}

                {/* Inquiry Detail Dialog */}
                <Dialog open={openInquiryDialog} onOpenChange={setOpenInquiryDialog}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Inquiry Details</DialogTitle>
                            <DialogDescription>
                                Complete information about this customer inquiry
                            </DialogDescription>
                        </DialogHeader>
                        {selectedInquiry && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Name</label>
                                        <p className="text-sm text-muted-foreground">{selectedInquiry.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <p className="text-sm text-muted-foreground">{selectedInquiry.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Phone</label>
                                        <p className="text-sm text-muted-foreground">{selectedInquiry.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Item Interested</label>
                                        <p className="text-sm text-muted-foreground">{selectedInquiry.itemInterested}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Comments</label>
                                    <p className="text-sm text-muted-foreground mt-1">{selectedInquiry.comments}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Status</label>
                                        <div className="mt-1">{getStatusBadge(selectedInquiry.status)}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Priority</label>
                                        <div className="mt-1">{getPriorityBadge(selectedInquiry.priority)}</div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Created</label>
                                    <p className="text-sm text-muted-foreground">{formatDate(selectedInquiry.created_at)}</p>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Edit Inquiry Dialog */}
                <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                    <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center space-y-4 p-2 w-full">
                            <DialogHeader className="space-y-2 w-full">
                                <DialogTitle className="text-xl font-semibold text-foreground">
                                    Update Inquiry
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    Update the status and add notes for this customer inquiry
                                </DialogDescription>
                            </DialogHeader>

                            {selectedInquiry && (
                                <div className="w-full space-y-6">
                                    {/* Customer Info */}
                                    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Name</label>
                                            <h4 className="font-medium text-foreground">{selectedInquiry.name}</h4>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Email</label>
                                            <p className="text-sm text-muted-foreground">{selectedInquiry.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Item Interested</label>
                                            <p className="text-sm text-muted-foreground">{selectedInquiry.item_interested}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Phone</label>
                                            <p className="text-sm text-muted-foreground">{selectedInquiry.phone}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Comments</label>
                                            <p className="text-sm text-muted-foreground">{selectedInquiry.comments}</p>
                                        </div>
                                    </div>

                                    {/* Status Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-3">Status</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {getStatusOptions().map((option) => {
                                                const Icon = option.icon
                                                return (
                                                    <Button
                                                        key={option.value}
                                                        variant={editForm.status === option.value ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setEditForm({ ...editForm, status: option.value })}
                                                        className="flex items-center gap-2 h-auto py-3"
                                                    >
                                                        <Icon className={`h-4 w-4 ${option.color}`} />
                                                        {option.label}
                                                    </Button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Priority Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-3">Priority</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {getPriorityOptions().map((option) => (
                                                <Button
                                                    key={option.value}
                                                    variant={editForm.priority === option.value ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setEditForm({ ...editForm, priority: option.value })}
                                                    className="text-xs h-auto py-2"
                                                >
                                                    {option.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Notes Section */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="block text-sm font-medium text-foreground">Notes</label>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setShowNoteForm(!showNoteForm)}
                                                className="flex items-center gap-2"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add Note
                                            </Button>
                                        </div>

                                        {/* Previous Notes */}
                                        {notesLoading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : notes && notes.length > 0 ? (
                                            <div className="space-y-3 mb-4">
                                                {notes.map((note) => (
                                                    <div key={note.id} className="bg-muted/30 rounded-lg p-4 border border-border">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-sm font-medium text-foreground">
                                                                    {note.profiles?.first_name} {note.profiles?.last_name}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {formatDate(note.created_at)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-foreground text-start w-full">{note.note}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 text-muted-foreground">
                                                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No notes yet</p>
                                            </div>
                                        )}

                                        {/* Add Note Form */}
                                        {showNoteForm && (
                                            <div className="border border-border rounded-lg p-4 bg-muted/20">
                                                <div className="space-y-3">
                                                    <Textarea
                                                        value={newNote}
                                                        onChange={(e) => setNewNote(e.target.value)}
                                                        placeholder="Add your notes about this inquiry..."
                                                        className="min-h-[100px] resize-none"
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={handleCancelNote}
                                                            disabled={isAddingNote}
                                                            className="flex-1"
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={handleAddNote}
                                                            disabled={isAddingNote || !newNote.trim()}
                                                            className="flex-1"
                                                        >
                                                            {isAddingNote ? (
                                                                <>
                                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                    Adding...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                                    Post Note
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 w-full pt-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setOpenEditDialog(false)}
                                            className="flex-1 hover:bg-accent transition-colors"
                                            disabled={isUpdating}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleUpdateInquiry}
                                            disabled={isUpdating || !editForm.status}
                                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Update Inquiry
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Shopping Cart Dialog */}
                <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
                                    <div className="absolute inset-0 bg-primary/20 rounded-full"></div>
                                    <div className="relative bg-primary/10 rounded-full p-6">
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
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="h-6 w-6 p-0"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                                    <div className="flex gap-2">
                                        <Button
                                            variant={cartMode === 'guest' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setCartMode('guest')}
                                            className="flex-1"
                                        >
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Guest Checkout
                                        </Button>
                                        <Button
                                            variant={cartMode === 'inquiry' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setCartMode('inquiry')}
                                            className="flex-1"
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            Assign to Inquiry
                                        </Button>
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
                                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                                        >
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            {cartMode === 'guest' ? 'Guest Checkout' : 'Assign & Checkout'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>


            </div>
        </div>
    )
}