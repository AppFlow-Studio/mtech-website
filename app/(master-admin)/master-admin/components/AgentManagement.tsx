import { useAgents } from "../actions/AgentStore"
import { useTiers } from "../actions/TeirsStores"
import { useAddAgent, useDeleteAgent, useUpdateAgent } from "../actions/AgentStore"
import { useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, AlertTriangle, Loader2, Users, Shield, Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { GetAdminProfiles } from "../actions/order-actions/get-admin-profiles"
import { CreateAdmin } from "../actions/admin-actions/create-admin"
export default function AgentManagement() {
    const { data: agents, refetch } = useAgents()
    const { data: tiers } = useTiers()
    const { mutate: createUser } = useAddAgent()
    const { mutate: deleteAgent } = useDeleteAgent()
    const { mutate: updateAgent } = useUpdateAgent()
    const [open, setOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [agentToDelete, setAgentToDelete] = useState<any>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        tier: undefined
    })

    // Admin management state
    const [activeTab, setActiveTab] = useState<'agents' | 'admins'>('agents')
    const [adminOpen, setAdminOpen] = useState(false)
    const [adminDeleteConfirmOpen, setAdminDeleteConfirmOpen] = useState(false)
    const [adminToDelete, setAdminToDelete] = useState<any>(null)
    const [isDeletingAdmin, setIsDeletingAdmin] = useState(false)
    const [adminFormData, setAdminFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        tier: undefined,
        password: '',
        role: 'ADMIN' as 'ADMIN' | 'MASTER_ADMIN' 
    })

    // Fetch admin profiles
    const { data: adminProfiles, refetch: refetchAdmins } = useQuery({
        queryKey: ['admin-profiles'],
        queryFn: GetAdminProfiles,
    })

    const handleAgentCreate = (e: React.FormEvent) => {
        e.preventDefault()
        createUser({...formData, tier: formData.tier ? Number(formData.tier) : undefined}, {
            onSuccess: () => {
                toast.success('Agent added successfully')
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    tier: undefined
                })
                setOpen(false)
                refetch()
            },
            onError: () => {
                toast.error('Failed to add agent')
            }
        })
    }

    const handleDeleteClick = (agent: any) => {
        setAgentToDelete(agent)
        setDeleteConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!agentToDelete) return

        setIsDeleting(true)
        deleteAgent(agentToDelete.id, {
            onSuccess: () => {
                toast.success('Agent deleted successfully')
                setDeleteConfirmOpen(false)
                setAgentToDelete(null)
                setIsDeleting(false)
                refetch()
            },
            onError: () => {
                toast.error('Failed to delete agent')
                setIsDeleting(false)
            }
        })
    }

    // Admin management handlers
    const handleAdminSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await CreateAdmin(adminFormData)
            toast.success('Admin created successfully')
            setAdminFormData({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                tier: undefined,
                role: 'ADMIN'
            })
            setAdminOpen(false)
            refetchAdmins()
        } catch (error) {
            toast.error('Failed to create admin')
        }
    }

    const handleAdminDeleteClick = (admin: any) => {
        setAdminToDelete(admin)
        setAdminDeleteConfirmOpen(true)
    }

    const handleConfirmAdminDelete = async () => {
        if (!adminToDelete) return

        setIsDeletingAdmin(true)
        try {
            const { DeleteAdmin } = await import('../actions/admin-actions/delete-admin')
            await DeleteAdmin(adminToDelete.id)
            toast.success('Admin deleted successfully')
            setAdminDeleteConfirmOpen(false)
            setAdminToDelete(null)
            setIsDeletingAdmin(false)
            refetchAdmins()
        } catch (error) {
            toast.error('Failed to delete admin')
            setIsDeletingAdmin(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
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
                    onClick={() => setActiveTab('admins')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'admins'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Shield className="h-4 w-4" />
                    Admin Management
                </button>
            </div>

            {/* Agent Management Tab */}
            {activeTab === 'agents' && (
                <>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">Agent Management</h2>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Agent
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-7xl max-h-[90vh]">
                                <DialogHeader>
                                    <DialogTitle>Create New Agent</DialogTitle>
                                    <DialogDescription>
                                        Add a new agent to the system with their contact information and tier assignment.
                                    </DialogDescription>
                                </DialogHeader>
                                <AgentForm onSubmit={handleAgentCreate} formData={formData} setFormData={setFormData} tiers={tiers} />
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
                                                    {agent.agent_tiers ? agent.agent_tiers.name : 'unassigned'}
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
                                                        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-7xl max-h-[90vh]">
                                                            <DialogHeader>
                                                                <DialogTitle>Edit Agent: {agent.first_name} {agent.last_name}</DialogTitle>
                                                                <DialogDescription>
                                                                    Update agent information and tier assignment.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <AgentEditForm agent={agent} tiers={tiers} refetch={() => refetch()} />
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDeleteClick(agent)}
                                                    >
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
                </>
            )}

            {/* Admin Management Tab */}
            {activeTab === 'admins' && (
                <>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground">Admin Management</h2>
                        <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Admin
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Create New Admin</DialogTitle>
                                    <DialogDescription>
                                        Add a new admin to the system with appropriate role assignment.
                                    </DialogDescription>
                                </DialogHeader>
                                <AdminForm onSubmit={handleAdminSubmit} formData={adminFormData} setFormData={setAdminFormData} />
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Admins List */}
                    <div className="bg-card border border-border rounded-lg">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-lg font-medium text-foreground">Current Admins</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-medium text-foreground">Name</th>
                                        <th className="text-left p-4 text-sm font-medium text-foreground">Email</th>
                                        <th className="text-left p-4 text-sm font-medium text-foreground">Role</th>
                                        <th className="text-left p-4 text-sm font-medium text-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminProfiles?.map((admin: any) => (
                                        <tr key={admin.id} className="border-t border-border">
                                            <td className="p-4 text-sm text-foreground">
                                                {admin.first_name} {admin.last_name}
                                            </td>
                                            <td className="p-4 text-sm text-foreground">{admin.email}</td>
                                            <td className="p-4 text-sm text-foreground">
                                                <Badge variant={admin.role === 'MASTER_ADMIN' ? 'default' : 'secondary'}>
                                                    {admin.role === 'MASTER_ADMIN' ? (
                                                        <Crown className="h-3 w-3 mr-1" />
                                                    ) : (
                                                        <Shield className="h-3 w-3 mr-1" />
                                                    )}
                                                    {admin.role}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm text-foreground">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleAdminDeleteClick(admin)}
                                                    >
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
                </>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold">Delete Agent</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    This action cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="text-sm text-foreground">
                            Are you sure you want to delete <span className="font-semibold">{agentToDelete?.first_name} {agentToDelete?.last_name}</span>?
                            This will permanently remove their account and all associated data.
                        </p>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDeleteConfirmOpen(false)
                                setAgentToDelete(null)
                            }}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    Delete Agent
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Admin Delete Confirmation Dialog */}
            <Dialog open={adminDeleteConfirmOpen} onOpenChange={setAdminDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold">Delete Admin</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    This action cannot be undone.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="text-sm text-foreground">
                            Are you sure you want to delete <span className="font-semibold">{adminToDelete?.first_name} {adminToDelete?.last_name}</span>?
                            This will permanently remove their admin account and all associated data.
                        </p>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setAdminDeleteConfirmOpen(false)
                                setAdminToDelete(null)
                            }}
                            disabled={isDeletingAdmin}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmAdminDelete}
                            disabled={isDeletingAdmin}
                            className="gap-2"
                        >
                            {isDeletingAdmin ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    Delete Admin
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
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
                    <option value={undefined}>Unassigned</option>
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
function AgentEditForm({ agent, tiers, refetch }: { agent: any, tiers: any, refetch: () => Promise<void> }) {
    const { mutate: updateAgent } = useUpdateAgent()
    const [formData, setFormData] = useState({
        id: agent.id,
        first_name: agent.first_name || '',
        last_name: agent.last_name || '',
        email: agent.email || '',
        tier: agent.tier || undefined,
        password: '', // New field for password
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Only include password if it's not empty
        const updateData = { ...formData }
        if (!updateData.password) {
            delete updateData.password
        }
        updateAgent(updateData, {
            onSuccess: async () => {
                toast.success('Agent updated successfully')
                await refetch()
            },
            onError: () => {
                toast.error('Failed to update agent')
            }
        })
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Leave blank to keep current password"
                />
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

// Admin Form Component (for creating new admins)
function AdminForm({ onSubmit, formData, setFormData }: {
    onSubmit: (e: React.FormEvent) => void
    formData: any
    setFormData: (data: any) => void
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
                <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'MASTER_ADMIN' })}
                >
                    <option value="ADMIN">Admin</option>
                    <option value="MASTER_ADMIN">Master Admin</option>
                </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="submit">Create Admin</Button>
            </div>
        </form>
    )
}