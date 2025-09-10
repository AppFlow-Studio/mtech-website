'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
    User,
    Mail,
    Phone,
    Shield,
    CreditCard,
    Save
} from 'lucide-react'
import { toast } from 'sonner'
import { updateAgentProfile, UpdateAgentProfileData } from '../actions/update-agent-profile'
import { useProfile } from '@/lib/hooks/useProfile'
import AddPaymentMethodDialog from '../components/AddPaymentMethodDialog'

interface ProfileProps {
    agent: any
    onProfileUpdated?: () => void
}

export default function Profile({ }: ProfileProps) {
    const { profile: agent } = useProfile()
    const [isLoading, setIsLoading] = useState(false)
    const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false)

    // Form state
    const [formData, setFormData] = useState<UpdateAgentProfileData>({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        password: ''
    })

    // Initialize form data when agent data is available
    useEffect(() => {
        if (agent) {
            setFormData({
                email: agent.email || '',
                first_name: agent.first_name || '',
                last_name: agent.last_name || '',
                phone_number: agent.phone_number || '',
                password: ''
            })
        }
    }, [agent])

    const handleInputChange = (field: keyof UpdateAgentProfileData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        if (!agent?.id) {
            toast.error('Agent information not available')
            return
        }

        setIsLoading(true)

        try {
            // Only include fields that have been changed
            const updates: UpdateAgentProfileData = {}

            if (formData.email !== agent.email) updates.email = formData.email
            if (formData.first_name !== agent.first_name) updates.first_name = formData.first_name
            if (formData.last_name !== agent.last_name) updates.last_name = formData.last_name
            if (formData.phone_number !== agent.phone_number) updates.phone_number = formData.phone_number

            // Check if there are any changes
            if (Object.keys(updates).length === 0) {
                toast.info('No changes to save')
                return
            }

            const result = await updateAgentProfile(agent.id, updates)

            if (result.success) {
                toast.success('Profile updated successfully!')

            } else {
                toast.error(result.error || 'Failed to update profile')
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('An error occurred while updating your profile')
        } finally {
            setIsLoading(false)
        }
    }

    const hasChanges = () => {
        if (!agent) return false
        return (
            formData.email !== agent.email ||
            formData.first_name !== agent.first_name ||
            formData.last_name !== agent.last_name ||
            formData.phone_number !== agent.phone_number
        )
    }

    return (
        <div className="space-y-6">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Personal Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>
                            Update your personal details and contact information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                                    placeholder="Enter your first name"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                                    placeholder="Enter your last name"
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter your email address"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <div className="relative mt-1">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone_number"
                                    type="tel"
                                    value={formData.phone_number}
                                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                    placeholder="Enter your phone number"
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Agent Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Agent Information
                        </CardTitle>
                        <CardDescription>
                            Your agent account details and permissions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Agent ID</Label>
                                <div className="mt-1 font-mono text-sm bg-muted/30 p-2 rounded">
                                    {agent?.id || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Agent Tier</Label>
                                <div className="mt-1">
                                    <Badge variant="secondary">
                                        {agent?.agent_tiers?.name || 'Standard'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Information
                    </CardTitle>
                    <CardDescription>
                        Manage your payment methods for faster checkout.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-6">
                        <span className="text-muted-foreground mb-2">No payment method added.</span>
                        <Button
                            variant="outline"
                            onClick={() => setShowAddPaymentDialog(true)}
                        >
                            Add a Payment Option
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isLoading || !hasChanges()}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            {/* Add Payment Method Dialog */}
            <AddPaymentMethodDialog
                agent={agent}
                open={showAddPaymentDialog}
                onOpenChange={setShowAddPaymentDialog}
                onPaymentMethodAdded={() => {
                    // Handle payment method added
                    toast.success('Payment method added successfully!')
                }}
            />
        </div>
    )
}