import { useProducts } from "../actions/ProductsServerState"
import { useAgents } from "../actions/AgentStore"
import { useTiers } from "../actions/TeirsStores"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Users, DollarSign, Settings, Plus, Mail, AlertCircle, UserCheck, CheckCircle, Clock } from "lucide-react"

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

            {/* Contact Forms Section */}
            <div>
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
            </div>
        </div>
    )
}
