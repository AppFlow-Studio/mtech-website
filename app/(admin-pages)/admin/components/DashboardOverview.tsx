import { useProducts } from "../actions/ProductsServerState"
import { useAgents } from "../actions/AgentStore"
import { useTiers } from "../actions/TeirsStores"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Users, DollarSign, Settings, Plus } from "lucide-react"

export default function DashboardOverview() {
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
