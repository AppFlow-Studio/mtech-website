import { useAgents } from "../actions/AgentStore"
import { useTiers } from "../actions/TeirsStores"
import { useAddAgent, useDeleteAgent, useUpdateAgent } from "../actions/AgentStore"
import { useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

export default function AgentManagement() {
    const { data: agents, refetch } = useAgents()
    const { data: tiers } = useTiers()
    const { mutate: addAgent } = useAddAgent()
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
                    <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-7xl max-h-[90vh]">
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
                                                    <AgentEditForm agent={agent} tiers={tiers} refetch={refetch} />
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
        password: '' || undefined, // New field for password
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