import { useTiers } from "../actions/TeirsStores"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, DollarSign, Search, AlertTriangle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useProducts } from "../actions/ProductsServerState"
import SetProductPricesPopup from "../pricing-tier-actions/SetProductPrices"
import { addTier } from "../pricing-tier-actions/add-tier"
import { deleteTier } from "../pricing-tier-actions/delete-tier"
import { toast } from "sonner"
import { PostgrestError } from "@supabase/supabase-js"
import { updateTier } from "../pricing-tier-actions/update-tier"

export default function PricingTiers() {
    const { data: tiers, refetch } = useTiers()
    const [showForm, setShowForm] = useState(false)
    const [pricingSearchTerm, setPricingSearchTerm] = useState('')
    const [deleteTierId, setDeleteTierId] = useState<string | null>(null)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        discount: 0
    })
    const [editTierId, setEditTierId] = useState<string | null>(null)
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [editForm, setEditForm] = useState({ name: '', description: '', commission_rate: 0 })
    const [isEditing, setIsEditing] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const newTier = await addTier({
            name: formData.name,
            description: formData.description,
            commission_rate: formData.discount
        })
        if (typeof newTier == typeof PostgrestError) {
            toast.error('Failed to create tier')
        } else {
            toast.success('Tier created successfully')
        }
        setFormData({ name: '', description: '', discount: 0 })
        setShowForm(false)
        await refetch()
    }

    const handleDeleteTier = (tier: any) => {
        setDeleteTierId(tier.id)
        setOpenDeleteDialog(true)
    }

    const confirmDelete = async () => {
        if (deleteTierId) {
            setIsDeleting(true)
            const result = await deleteTier(deleteTierId)
            console.log('Result', result)
            if (typeof result == typeof PostgrestError) {
                toast.error('Failed to delete tier')
                setIsDeleting(false)
                setOpenDeleteDialog(false)
                setDeleteTierId(null)
            } else {
                toast.error('Failed to delete tier')
                toast.success('Tier deleted successfully')
                await refetch()
            }
            setIsDeleting(false)
        }
        setOpenDeleteDialog(false)
        setDeleteTierId(null)
    }

    const handleEditTier = (tier: any) => {
        setEditTierId(tier.id)
        setEditForm({
            name: tier.name,
            description: tier.description,
            commission_rate: tier.commission_rate,
        })
        setOpenEditDialog(true)
    }

    const confirmEdit = async () => {
        if (!editTierId) return
        setIsEditing(true)
        try {
            await updateTier(editTierId, editForm)
            toast.success('Tier updated successfully')
            await refetch()
            setOpenEditDialog(false)
            setEditTierId(null)
        } catch (error) {
            toast.error('Failed to update tier')
        } finally {
            setIsEditing(false)
        }
    }

    const tierToDelete = tiers?.find((tier: any) => tier.id === deleteTierId)

    return (
        <div className="space-y-6 w-full">
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
                    <div key={tier.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-foreground">{tier.name}</h3>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="hover:bg-accent transition-colors" onClick={() => handleEditTier(tier)}>
                                    <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-105"
                                    onClick={() => handleDeleteTier(tier)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 w-full">{tier.description}</p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">Products Priced:</span>
                                <span className="text-sm text-muted-foreground">
                                    {tier.agent_product_prices.length} products
                                </span>
                            </div>
                            <SetProductPricesPopup tier={tier} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <DialogContent className="sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="flex flex-col items-center text-center space-y-4 p-2">
                        {/* Animated Warning Icon */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-destructive/20 rounded-full animate-ping"></div>
                            <div className="relative bg-destructive/10 rounded-full p-4">
                                <AlertTriangle className="h-8 w-8 text-destructive animate-pulse" />
                            </div>
                        </div>

                        <DialogHeader className="space-y-2">
                            <DialogTitle className="text-xl font-semibold text-foreground">
                                Delete Pricing Tier
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Are you sure you want to delete <span className="font-semibold text-foreground">"{tierToDelete?.name}"</span>?
                            </DialogDescription>
                        </DialogHeader>

                        {/* Warning Details */}
                        <div className="w-full bg-destructive/5 border border-destructive/20 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="font-medium">This action cannot be undone</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                This will permanently remove the tier and all associated product pricing data.
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 w-full pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setOpenDeleteDialog(false)}
                                className="flex-1 hover:bg-accent transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={async () => await confirmDelete()}
                                disabled={isDeleting}
                                className="flex-1 hover:bg-destructive/90 transition-all duration-200 hover:scale-105"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Tier
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Tier Dialog */}
            <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <DialogContent className="sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="flex flex-col items-center text-center space-y-4 p-2 w-full">
                        <DialogHeader className="space-y-2 w-full">
                            <DialogTitle className="text-xl font-semibold text-foreground">
                                Edit Pricing Tier
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Update the tier's name, description, and commission rate below.
                            </DialogDescription>
                        </DialogHeader>
                        <form className="w-full space-y-4" onSubmit={e => { e.preventDefault(); confirmEdit(); }}>
                            <div className="text-left w-full">
                                <label className="block text-sm font-medium text-foreground mb-2">Tier Name</label>
                                <Input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    placeholder="e.g., Tier 1, Premium, etc."
                                    required
                                    disabled={isEditing}
                                />
                            </div>
                            <div className="text-left w-full">
                                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                                <Textarea
                                    value={editForm.description}
                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                    placeholder="Describe this tier's benefits and requirements"
                                    required
                                    disabled={isEditing}
                                />
                            </div>
                            <div className="text-left w-full">
                                <label className="block text-sm font-medium text-foreground mb-2">Commission Rate (%)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editForm.commission_rate}
                                    onChange={e => setEditForm({ ...editForm, commission_rate: parseInt(e.target.value) })}
                                    required
                                    disabled={isEditing}
                                />
                            </div>
                            <div className="flex gap-3 w-full pt-2">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setOpenEditDialog(false)}
                                    className="flex-1 hover:bg-accent transition-colors"
                                    disabled={isEditing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="default"
                                    type="submit"
                                    disabled={isEditing}
                                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                                >
                                    {isEditing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}