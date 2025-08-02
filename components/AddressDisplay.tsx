import { MapPin, Copy, Building, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Address {
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

interface AddressDisplayProps {
    address: Address
    type: 'shipping' | 'billing'
    onEdit: () => void
}

export default function AddressDisplay({ address, type, onEdit }: AddressDisplayProps) {
    const formatAddress = () => {
        const parts = []

        if (address.formatted_address) {
            parts.push(address.formatted_address)
        }

        if (address.apartment_suite) {
            parts.push(`Apt ${address.apartment_suite}`)
        }

        if (address.city && address.state) {
            parts.push(`${address.city}, ${address.state}`)
        } else if (address.city) {
            parts.push(address.city)
        } else if (address.state) {
            parts.push(address.state)
        }

        if (address.zip_code) {
            parts.push(address.zip_code)
        }

        return parts.join(', ')
    }

    const copyToClipboard = async () => {
        const fullAddress = formatAddress()
        try {
            await navigator.clipboard.writeText(fullAddress)
            toast.success('Address copied to clipboard')
        } catch (error) {
            toast.error('Failed to copy address')
        }
    }

    const hasAddress = address && (
        address.formatted_address ||
        address.city ||
        address.state ||
        address.zip_code
    )

    if (!hasAddress) {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground capitalize">
                        {type} Address
                    </h4>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="p-1 hover:bg-muted rounded transition-colors"
                    >
                        <span className="text-xs">Add Address</span>
                    </Button>
                </div>
                <div className="text-sm text-muted-foreground italic">
                    No {type} address provided
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground capitalize">
                    {type} Address
                </h4>
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        className="p-1 hover:bg-muted rounded transition-colors"
                        title="Copy address"
                    >
                        <Copy className="h-3 w-3 text-muted-foreground" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="p-1 hover:bg-muted rounded transition-colors"
                        title="Edit address"
                    >
                        <span className="text-xs">Edit</span>
                    </Button>
                </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                {/* Name and Company */}
                <div className="flex items-start space-x-3">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">
                            {address.first_name} {address.last_name}
                        </div>
                        {address.company && (
                            <div className="text-sm text-muted-foreground flex items-center space-x-1">
                                <Building className="h-3 w-3" />
                                <span>{address.company}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="text-sm text-foreground">
                            {formatAddress()}
                        </div>
                    </div>
                </div>

                {/* Phone */}
                {address.phone && (
                    <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="text-sm text-foreground">
                            {address.phone}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 