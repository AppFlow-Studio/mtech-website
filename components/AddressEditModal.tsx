import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import Autocomplete from "react-google-autocomplete"
import { cn } from '@/lib/utils'
import { parseAddress } from '@/utils/parse-address'

interface Address {
    country?: string
    first_name?: string
    last_name?: string
    company?: string
    formatted_address?: string
    apartment_suite?: string
    city?: string
    state?: string
    zip_code?: string
    phone?: string
}

interface AddressEditModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    address: Address
    type: 'shipping' | 'billing'
    onSave: (address: Address) => Promise<void>
    isSaving: boolean
}

export default function AddressEditModal({
    open,
    onOpenChange,
    address,
    type,
    onSave,
    isSaving
}: AddressEditModalProps) {
    const [formData, setFormData] = useState<Address>()

    useEffect(() => {
        setFormData(address)
    }, [address])

    const handleInputChange = (field: keyof Address, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handlePlaceSelected = (place: any) => {
        const parsedAddress = parseAddress(place.address_components)
        setFormData(prev => ({
            ...prev,
            formatted_address: parsedAddress.formatted_address,
            apartment_suite: parsedAddress.apartment_suite || '',
            city: parsedAddress.city || '',
            state: parsedAddress.state || '',
            zip_code: parsedAddress.zip_code || ''
        }))
    }

    const handleSave = async () => {
        if (formData) {
            await onSave(formData)
        }
    }

    const isFormValid = formData?.first_name &&
        formData?.last_name &&
        formData?.formatted_address &&
        formData?.phone

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Edit {type} Address
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Country/Region */}
                    <div className="space-y-2">
                        <Label htmlFor="country">Country/region</Label>
                        <select
                            id="country"
                            value={formData?.country || 'United States'}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="Mexico">Mexico</option>
                        </select>
                    </div>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First name *</Label>
                            <Input
                                id="first_name"
                                value={formData?.first_name || ''}
                                onChange={(e) => handleInputChange('first_name', e.target.value)}
                                placeholder="Enter first name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last name *</Label>
                            <Input
                                id="last_name"
                                value={formData?.last_name || ''}
                                onChange={(e) => handleInputChange('last_name', e.target.value)}
                                placeholder="Enter last name"
                            />
                        </div>
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                        <Label htmlFor="company">Company (optional)</Label>
                        <Input
                            id="company"
                            value={formData?.company || ''}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="Enter company name"
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Autocomplete
                            id="address"
                            value={formData?.formatted_address || ''}
                            apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''}
                            onPlaceSelected={handlePlaceSelected}
                            onChange={(e: any) => handleInputChange('formatted_address', e.target.value)}
                            options={{
                                types: ["address"],
                                componentRestrictions: { country: "us" },
                            }}
                            placeholder="Start typing address..."
                            className={cn(
                                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                            )}
                        />
                    </div>

                    {/* Address Line 2 */}
                    <div className="space-y-2">
                        <Label htmlFor="apartment_suite">Apartment, suite, etc. (optional)</Label>
                        <Input
                            id="apartment_suite"
                            value={formData?.apartment_suite || ''}
                            onChange={(e) => handleInputChange('apartment_suite', e.target.value)}
                            placeholder="Enter apartment, suite, etc."
                        />
                    </div>

                    {/* City, State, ZIP */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={formData?.city || ''}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                placeholder="Enter city"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                                id="state"
                                value={formData?.state || ''}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                placeholder="Enter state"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zip_code">ZIP code</Label>
                            <Input
                                id="zip_code"
                                value={formData?.zip_code || ''}
                                onChange={(e) => handleInputChange('zip_code', e.target.value)}
                                placeholder="Enter ZIP code"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <div className="flex">
                            <select
                                value="+1"
                                disabled
                                className="w-24 h-9 rounded-l-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="+1">🇺🇸 +1</option>
                            </select>
                            <Input
                                id="phone"
                                value={formData?.phone || ''}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="Enter phone number"
                                className="ml-0 rounded-l-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !isFormValid}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Address'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
} 