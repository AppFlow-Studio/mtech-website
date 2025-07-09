import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Mail,
    Phone,
    User,
    MessageSquare,
    Package,
    Calendar,
    Clock,
    Users,
    TrendingUp,
    Filter,
    Search,
    Eye,
    UserCheck,
    AlertCircle,
    CheckCircle,
    Clock as ClockIcon
} from "lucide-react"
import { useAgents } from "../actions/AgentStore"
import { useTiers } from "../actions/TeirsStores"

// Mock data for contact inquiries
const mockInquiries = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        itemInterested: "Clover POS System",
        comments: "Looking for a complete POS solution for my coffee shop. Need something user-friendly with inventory management.",
        status: "new",
        assignedAgent: null,
        createdAt: "2024-01-15T10:30:00Z",
        pageSource: "/products/clover"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@business.com",
        phone: "+1 (555) 987-6543",
        itemInterested: "ATM Machine",
        comments: "Interested in ATM placement for my convenience store. Need information about installation and maintenance.",
        status: "assigned",
        assignedAgent: "agent_1",
        createdAt: "2024-01-14T14:20:00Z",
        pageSource: "/products/genmega-atm"
    },
    {
        id: 3,
        name: "Mike Chen",
        email: "mike.chen@restaurant.com",
        phone: "+1 (555) 456-7890",
        itemInterested: "Figure POS System",
        comments: "Need a robust POS system for my restaurant. Looking for something that can handle high volume.",
        status: "contacted",
        assignedAgent: "agent_2",
        createdAt: "2024-01-13T09:15:00Z",
        pageSource: "/products/figure-pos"
    },
    {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@retail.com",
        phone: "+1 (555) 321-0987",
        itemInterested: "Dual Pricing System",
        comments: "Interested in implementing dual pricing for my retail store. Need to understand the setup process.",
        status: "new",
        assignedAgent: null,
        createdAt: "2024-01-12T16:45:00Z",
        pageSource: "/dual-pricing"
    },
    {
        id: 5,
        name: "David Wilson",
        email: "david.wilson@gas.com",
        phone: "+1 (555) 654-3210",
        itemInterested: "Gas Station POS",
        comments: "Looking for a complete solution for my gas station. Need POS, payment processing, and fuel management.",
        status: "assigned",
        assignedAgent: "agent_1",
        createdAt: "2024-01-11T11:30:00Z",
        pageSource: "/business-type/gas-stations"
    },
    {
        id: 6,
        name: "Lisa Brown",
        email: "lisa.brown@salon.com",
        phone: "+1 (555) 789-0123",
        itemInterested: "Beauty Salon POS",
        comments: "Need a POS system for my beauty salon. Looking for appointment scheduling and payment processing.",
        status: "contacted",
        assignedAgent: "agent_3",
        createdAt: "2024-01-10T13:20:00Z",
        pageSource: "/business-type/beauty-salon"
    },
    {
        id: 7,
        name: "Robert Taylor",
        email: "robert.taylor@bakery.com",
        phone: "+1 (555) 234-5678",
        itemInterested: "Bakery POS System",
        comments: "Looking for a POS system for my bakery. Need inventory management and customer loyalty features.",
        status: "new",
        assignedAgent: null,
        createdAt: "2024-01-09T08:45:00Z",
        pageSource: "/business-type/bakeries-and-delis"
    },
    {
        id: 8,
        name: "Jennifer Lee",
        email: "jennifer.lee@hardware.com",
        phone: "+1 (555) 876-5432",
        itemInterested: "Hardware Store POS",
        comments: "Need a POS system for my hardware store. Looking for barcode scanning and inventory tracking.",
        status: "assigned",
        assignedAgent: "agent_2",
        createdAt: "2024-01-08T15:10:00Z",
        pageSource: "/business-type/hardware-stores"
    }
]

const mockAgents = [
    { id: "agent_1", name: "Alex Rodriguez", tier: "Premium", email: "alex@mtech.com" },
    { id: "agent_2", name: "Maria Garcia", tier: "Standard", email: "maria@mtech.com" },
    { id: "agent_3", name: "James Wilson", tier: "Basic", email: "james@mtech.com" }
]

export default function ContactInquiries() {
    const { data: agents } = useAgents()
    const { data: tiers } = useTiers()
    const [inquiries, setInquiries] = useState(mockInquiries)
    const [selectedInquiry, setSelectedInquiry] = useState<any>(null)
    const [openDetailDialog, setOpenDetailDialog] = useState(false)
    const [openAssignDialog, setOpenAssignDialog] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [agentFilter, setAgentFilter] = useState("all")

    // Calculate statistics
    const totalInquiries = inquiries.length
    const newInquiries = inquiries.filter(i => i.status === "new").length
    const assignedInquiries = inquiries.filter(i => i.status === "assigned").length
    const contactedInquiries = inquiries.filter(i => i.status === "contacted").length
    const avgResponseTime = "2.5 hours"

    // Filter inquiries
    const filteredInquiries = inquiries.filter(inquiry => {
        const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.itemInterested.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter
        const matchesAgent = agentFilter === "all" || inquiry.assignedAgent === agentFilter
        return matchesSearch && matchesStatus && matchesAgent
    })

    const handleAssignAgent = (inquiryId: number, agentId: string) => {
        setInquiries(prev => prev.map(inquiry =>
            inquiry.id === inquiryId
                ? { ...inquiry, assignedAgent: agentId, status: "assigned" }
                : inquiry
        ))
        setOpenAssignDialog(false)
    }

    const handleStatusChange = (inquiryId: number, newStatus: string) => {
        setInquiries(prev => prev.map(inquiry =>
            inquiry.id === inquiryId
                ? { ...inquiry, status: newStatus }
                : inquiry
        ))
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            new: { color: "bg-blue-100 text-blue-800", icon: AlertCircle },
            assigned: { color: "bg-yellow-100 text-yellow-800", icon: UserCheck },
            contacted: { color: "bg-green-100 text-green-800", icon: CheckCircle }
        }
        const config = statusConfig[status as keyof typeof statusConfig]
        const Icon = config.icon
        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Contact Inquiries</h2>
                    <p className="text-muted-foreground">Manage and assign customer inquiries to agents</p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalInquiries}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{newInquiries}</div>
                        <p className="text-xs text-muted-foreground">Require attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Assigned</CardTitle>
                        <UserCheck className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{assignedInquiries}</div>
                        <p className="text-xs text-muted-foreground">In progress</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                        <ClockIcon className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{avgResponseTime}</div>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search inquiries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="assigned">Assigned</option>
                    <option value="contacted">Contacted</option>
                </Select>
                <Select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
                    <option value="all">All Agents</option>
                    {agents?.map((agent: any) => (
                        <option key={agent.id} value={agent.id}>{agent.first_name} {agent.last_name}</option>
                    ))}
                </Select>
            </div>

            {/* Inquiries List */}
            <div className="space-y-4">
                {filteredInquiries.map((inquiry) => (
                    <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h3 className="font-semibold text-foreground">{inquiry.name}</h3>
                                            <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                                        </div>
                                        {getStatusBadge(inquiry.status)}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span>{inquiry.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                            <span className="truncate">{inquiry.itemInterested}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{formatDate(inquiry.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {inquiry.assignedAgent
                                                    ? mockAgents.find(a => a.id === inquiry.assignedAgent)?.name || "Unknown"
                                                    : "Unassigned"
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground line-clamp-2">{inquiry.comments}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedInquiry(inquiry)
                                            setOpenDetailDialog(true)
                                        }}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedInquiry(inquiry)
                                            setOpenAssignDialog(true)
                                        }}
                                    >
                                        <UserCheck className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Detail Dialog */}
            <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
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
                                    <label className="text-sm font-medium">Assigned Agent</label>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedInquiry.assignedAgent
                                            ? mockAgents.find(a => a.id === selectedInquiry.assignedAgent)?.name || "Unknown"
                                            : "Unassigned"
                                        }
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Page Source</label>
                                <p className="text-sm text-muted-foreground">{selectedInquiry.pageSource}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Assign Agent Dialog */}
            <Dialog open={openAssignDialog} onOpenChange={setOpenAssignDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Agent</DialogTitle>
                        <DialogDescription>
                            Assign this inquiry to an available agent
                        </DialogDescription>
                    </DialogHeader>
                    {selectedInquiry && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Customer</label>
                                <p className="text-sm text-muted-foreground">{selectedInquiry.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Inquiry</label>
                                <p className="text-sm text-muted-foreground">{selectedInquiry.itemInterested}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Select Agent</label>
                                <Select
                                    value={selectedInquiry.assignedAgent || ""}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            handleAssignAgent(selectedInquiry.id, e.target.value)
                                        }
                                    }}
                                >
                                    <option value="">Select an agent...</option>
                                    {agents?.map((agent: any) => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.first_name} {agent.last_name} ({agent.agent_tiers.name})
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
