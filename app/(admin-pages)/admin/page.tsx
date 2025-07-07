'use client'
import { useState } from 'react'
import { useProfile } from '@/lib/hooks/useProfile'
import { useSignOut } from '@/lib/auth-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { mockProducts } from '@/lib/mockdata'
import {
    Users,
    Package,
    DollarSign,
    Plus,
    Edit,
    Trash2,
    Search,
    Settings,
    LogOut
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useProducts } from './actions/ProductsServerState'
import { useTiers } from './actions/TeirsStores'
import { useAddAgent, useAgents, useDeleteAgent } from './actions/AgentStore'
import { toast } from 'sonner'

type TabType = 'agents' | 'products' | 'pricing' | null

export default function AdminDashboard() {
    const { profile } = useProfile()
    const signOut = useSignOut()
    const [activeTab, setActiveTab] = useState<TabType | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

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

// Agent Management Component
function AgentManagement() {
    const { data: agents } = useAgents()
    const { data: tiers } = useTiers()
    const { mutate: addAgent } = useAddAgent()
    const { mutate: deleteAgent } = useDeleteAgent()
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        tier: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        addAgent(formData, {
            onSuccess: () => {
                toast.success('Agent added successfully')
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    tier: ''
                })
                setOpen(false)
            },
            onError: () => {
                toast.error('Failed to add agent')
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Agent Management</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Agent
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Agent</DialogTitle>
                            <DialogDescription>
                                Add a new agent to the system with their contact information and tier assignment.
                            </DialogDescription>
                        </DialogHeader>
                        <AgentForm onSubmit={handleSubmit} formData={formData} setFormData={setFormData} tiers={tiers} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Agents List */}
            <div className="bg-card border border-border rounded-lg">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-medium text-foreground">Current Agents</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-4 text-sm font-medium text-foreground">Name</th>
                                <th className="text-left p-4 text-sm font-medium text-foreground">Email</th>
                                <th className="text-left p-4 text-sm font-medium text-foreground">Tier</th>
                                <th className="text-left p-4 text-sm font-medium text-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents?.map((agent: any) => (
                                <tr key={agent.id} className="border-t border-border">
                                    <td className="p-4 text-sm text-foreground">
                                        {agent.first_name} {agent.last_name}
                                    </td>
                                    <td className="p-4 text-sm text-foreground">{agent.email}</td>
                                    <td className="p-4 text-sm text-foreground">
                                        <Badge variant="secondary">
                                            {agent.tier ? agent.tier : 'unassigned'}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-sm text-foreground">
                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="outline">
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="w-full max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Agent: {agent.first_name} {agent.last_name}</DialogTitle>
                                                        <DialogDescription>
                                                            Update agent information and tier assignment.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <AgentEditForm agent={agent} tiers={tiers} />
                                                </DialogContent>
                                            </Dialog>
                                            <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => deleteAgent(agent.id, {
                                                onSuccess: () => {
                                                    toast.success('Agent deleted successfully')
                                                },
                                                onError: () => {
                                                    toast.error('Failed to delete agent')
                                                }
                                            })}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// Product Management Component
function ProductManagement({ searchTerm, setSearchTerm }: {
    searchTerm: string,
    setSearchTerm: (term: string) => void
}) {
    const { data: products, isLoading, isError } = useProducts()
    const [open, setOpen] = useState(false)
    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">Loading products...</div>
        </div>
    )

    if (isError) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-lg text-destructive">Error loading products</div>
        </div>
    )

    // Filter products based on search term
    const filteredProducts = products?.filter((product: any) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Product Management</h2>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product: any) => (
                    <div key={product.link} className="bg-card border border-border rounded-lg overflow-hidden">
                        <div className="aspect-square bg-muted relative">
                            <img
                                src={product.imageSrc}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.inStock
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-foreground mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                                {product.tags.map((tag: string) => (
                                    <Badge key={tag} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Edit Product: {product.name}</DialogTitle>
                                            <DialogDescription>
                                                Update product information, pricing, and availability.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <ProductEditForm product={product} />
                                    </DialogContent>
                                </Dialog>
                                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Agent Form Component (for creating new agents)
function AgentForm({ onSubmit, formData, setFormData, tiers }: {
    onSubmit: (e: React.FormEvent) => void
    formData: any
    setFormData: (data: any) => void
    tiers: any
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                    <Input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                    <Input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tier</label>
                <Select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                >
                    <option value={''}>Unassigned</option>
                    {tiers?.map((tier: any) => (
                        <option key={tier.id} value={tier.id}>{tier.name}</option>
                    ))}
                </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="submit">Create Agent</Button>
            </div>
        </form>
    )
}

// Agent Edit Form Component
function AgentEditForm({ agent, tiers }: { agent: any, tiers: any }) {
    const [formData, setFormData] = useState({
        first_name: agent.first_name || '',
        last_name: agent.last_name || '',
        email: agent.email || '',
        tier: agent.tier || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Update agent in database
        console.log('Updated agent:', formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                    <Input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                    <Input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tier</label>
                <Select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                >
                    {tiers?.map((tier: any) => (
                        <option key={tier.id} value={tier.id}>{tier.name}</option>
                    ))}
                </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline">
                    Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    )
}

// Product Edit Form Component
function ProductEditForm({ product }: { product: any }) {
    const [formData, setFormData] = useState({
        name: product.name || '',
        description: product.description || '',
        imageSrc: product.imageSrc || '',
        link: product.link || '',
        inStock: product.inStock || false,
        tags: product.tags || [],
        price: product.price || 0
    })
    const [newTag, setNewTag] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Update product in database
        console.log('Updated product:', formData)
    }

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, newTag.trim()]
            })
            setNewTag('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((tag: any) => tag !== tagToRemove)
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Image */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Product Image</label>
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                            src={formData.imageSrc}
                            alt={formData.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder-product.png'
                            }}
                        />
                    </div>
                    <div className="flex-1">
                        <Input
                            type="url"
                            placeholder="Image URL"
                            value={formData.imageSrc}
                            onChange={(e) => setFormData({ ...formData, imageSrc: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Product Name</label>
                    <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter product name"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Product Link</label>
                    <Input
                        type="text"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        placeholder="product-slug"
                        required
                    />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={4}
                    required
                />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Price ($)</label>
                    <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Stock Status</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="inStock"
                            checked={formData.inStock}
                            onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                            className="rounded border-gray-300"
                        />
                        <label htmlFor="inStock" className="text-sm text-foreground">
                            In Stock
                        </label>
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tags</label>
                <div className="flex gap-2 mb-2">
                    <Input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                        Add
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag: any) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-destructive"
                            >
                                ×
                            </button>
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Product Preview */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Preview</label>
                <div className="border border-border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                                src={formData.imageSrc}
                                alt={formData.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder-product.png'
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-foreground">{formData.name || 'Product Name'}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {formData.description || 'Product description will appear here...'}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-medium text-foreground">
                                    ${formData.price.toFixed(2)}
                                </span>
                                <Badge variant={formData.inStock ? "default" : "secondary"}>
                                    {formData.inStock ? "In Stock" : "Out of Stock"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button type="button" variant="outline" >
                    Cancel
                </Button>
                <Button type="submit">
                    Save Changes
                </Button>
            </div>
        </form>
    )
}

// Dashboard Overview Component
function DashboardOverview() {
    const { data: products } = useProducts()
    const { data: agents } = useAgents()
    const { data: tiers } = useTiers()
    const totalProducts = products?.length || 0
    const inStockProducts = products?.filter((p: any) => p.inStock).length || 0
    const outOfStockProducts = totalProducts - inStockProducts

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Dashboard Overview</h2>
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
            </div>

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
                                <Settings className="h-4 w-4 mr-2" />
                                System Settings
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// Pricing Tiers Component
function PricingTiers() {
    const { data: products } = useProducts()
    const { data: tiers } = useTiers()
    const [showForm, setShowForm] = useState(false)
    const [pricingSearchTerm, setPricingSearchTerm] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        discount: 0
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newTier = {
            id: Date.now(),
            ...formData,
            productPrices: {}
        }
        //setTiers([...tiers, newTier])
        setFormData({ name: '', description: '', discount: 0 })
        setShowForm(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Pricing Tiers</h2>
                <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Tier
                </Button>
            </div>

            {/* Tier Creation Form */}
            {showForm && (
                <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-medium text-foreground mb-4">Create New Pricing Tier</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Tier Name</label>
                            <Input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Tier 1, Premium, etc."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe this tier's benefits and requirements"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Commission Rate (%)</label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.discount}
                                onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit">Create Tier</Button>
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tiers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tiers?.map((tier: any) => (
                    <div key={tier.id} className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-foreground">{tier.name}</h3>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                    <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">Commission Rate:</span>
                                <span className="text-lg font-bold text-primary">{tier.commission_rate}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">Products Priced:</span>
                                <span className="text-sm text-muted-foreground">
                                    {tier.agent_product_prices.length} products
                                </span>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full"

                                    >
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        Manage Product Prices
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Product Pricing for {tier.name}
                                        </DialogTitle>
                                        <DialogDescription>
                                            Set individual product prices for this tier. Each product can have a different price for different agent tiers.
                                        </DialogDescription>
                                    </DialogHeader>

                                    {/* Search and Bulk Actions */}
                                    <div className="flex gap-4 mb-6">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                placeholder="Search products..."
                                                value={pricingSearchTerm}
                                                onChange={(e) => setPricingSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                // Bulk set price for all visible products
                                                const visibleProducts = products?.filter((product: any) =>
                                                    product.name?.toLowerCase().includes(pricingSearchTerm.toLowerCase()) ||
                                                    product.description?.toLowerCase().includes(pricingSearchTerm.toLowerCase())
                                                ) || []
                                                const newPrice = prompt('Enter price for all visible products:')
                                                if (newPrice && !isNaN(parseFloat(newPrice))) {
                                                    const price = parseFloat(newPrice)
                                                    const updatedTier = {
                                                        ...tier,
                                                        productPrices: {
                                                            ...tier.productPrices,
                                                            ...Object.fromEntries(
                                                                visibleProducts.map((product: any) => [product.link, price])
                                                            )
                                                        }
                                                    }
                                                    //setSelectedTier(updatedTier)
                                                    // TODO: Update tier in database
                                                }
                                            }}
                                        >
                                            Bulk Set Price
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {products?.filter((product: any) =>
                                            product.name?.toLowerCase().includes(pricingSearchTerm.toLowerCase()) ||
                                            product.description?.toLowerCase().includes(pricingSearchTerm.toLowerCase())
                                        )
                                            .map((product: any) => {
                                                const currentPrice = tier.productPrices?.[product.link] || 0
                                                return (
                                                    <div key={product.link} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                                                <img
                                                                    src={product.imageSrc}
                                                                    alt={product.name}
                                                                    className="w-8 h-8 object-cover rounded"
                                                                />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-foreground">{product.name}</h4>
                                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                                    {product.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm text-muted-foreground">$</span>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={currentPrice}
                                                                onChange={(e) => {
                                                                    const newPrice = parseFloat(e.target.value) || 0
                                                                    const updatedTier = {
                                                                        ...tier,
                                                                        productPrices: {
                                                                            ...tier.productPrices,
                                                                            [product.link]: newPrice
                                                                        }
                                                                    }
                                                                    // TODO: Update tier in database
                                                                }}
                                                                className="w-24"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </div>

                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                                        <div className="text-sm text-muted-foreground">
                                            {Object.keys(tier.productPrices || {}).length} of {products?.length || 0} products priced
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline">
                                                Cancel
                                            </Button>
                                            <Button>
                                                Save All Prices
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}