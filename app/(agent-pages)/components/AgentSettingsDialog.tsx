'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    Save,
    Settings,
    Shield,
    AlertCircle,
    CheckCircle,
    CreditCard
} from 'lucide-react'
import { toast } from 'sonner'
import { updateAgentProfile, UpdateAgentProfileData } from '../actions/update-agent-profile'

interface AgentSettingsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    agent: any
    onProfileUpdated?: () => void
}

export default function AgentSettingsDialog({
    open,
    onOpenChange,
    agent,
    onProfileUpdated
}: AgentSettingsDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')

    // Form state
    const [formData, setFormData] = useState<UpdateAgentProfileData>({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        password: ''
    })

    const [confirmPassword, setConfirmPassword] = useState('')

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

        // Validate password if it's being changed
        if (formData.password && formData.password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (formData.password && formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long')
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
            if (formData.password) updates.password = formData.password

            // Check if there are any changes
            if (Object.keys(updates).length === 0) {
                toast.info('No changes to save')
                return
            }

            const result = await updateAgentProfile(agent.id, updates)

            if (result.success) {
                toast.success('Profile updated successfully!')
                onProfileUpdated?.()
                // Clear password fields
                setFormData(prev => ({ ...prev, password: '' }))
                setConfirmPassword('')
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
            formData.phone_number !== agent.phone_number ||
            formData.password !== ''
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Agent Settings
                    </DialogTitle>
                    <DialogDescription>
                        Update your profile information and account settings
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
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

                        {/* Agent Information */}
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

                                {/* <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
                                    <div className="mt-1">
                                        <Badge variant={agent?.active ? "default" : "secondary"}>
                                            {agent?.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div> */}
                            </CardContent>
                        </Card>

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
                                    <Button variant="outline" disabled>
                                        Add a Payment Option
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    Change Password
                                </CardTitle>
                                <CardDescription>
                                    Update your account password for enhanced security
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative mt-1">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            placeholder="Enter new password"
                                            className="pl-10 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Password must be at least 6 characters long
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                                    <div className="relative mt-1">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirm_password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            className="pl-10 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Password validation */}
                                {formData.password && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Password Requirements</Label>
                                        <div className="space-y-1">
                                            <div className={`flex items-center gap-2 text-sm ${formData.password.length >= 6 ? 'text-green-600' : 'text-red-600'}`}>
                                                {formData.password.length >= 6 ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    <AlertCircle className="h-4 w-4" />
                                                )}
                                                At least 6 characters
                                            </div>
                                            <div className={`flex items-center gap-2 text-sm ${formData.password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                                                {formData.password === confirmPassword ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    <AlertCircle className="h-4 w-4" />
                                                )}
                                                Passwords match
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading || !hasChanges()}
                        className="flex-1"
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
            </DialogContent>
        </Dialog>
    )
}
