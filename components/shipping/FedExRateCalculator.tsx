'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    // Removed SelectItem, SelectTrigger, SelectValue as they are not exported from "@/components/ui/select"
} from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
    Loader2,
    Package,
    Truck,
    MapPin,
    Calculator,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    Info
} from 'lucide-react';
import { toast } from 'sonner';
import { GetFedExRates } from '@/app/(master-admin)/master-admin/actions/shipping/get-fedex-rates';

// Import the type from the server action
type FedExRateResponse = Awaited<ReturnType<typeof GetFedExRates>>;



interface Product {
    id: string;
    name: string;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
}

interface OrderItem {
    id: string;
    quantity: number;
    products: Product;
    price_at_order: number;
}

interface PackageLineItem {
    id: string;
    weight: number;
    quantity: number;
    productName: string;
}

interface FedExRateRequest {
    accountNumber: {
        value: string;
    };
    rateRequestControlParameters: {
        returnTransitTimes: boolean;
    };
    requestedShipment: {
        shipper: {
            address: {
                postalCode: string;
                countryCode: string;
            };
        };
        recipient: {
            address: {
                postalCode: string;
                countryCode: string;
            };
        };
        pickupType: string;
        rateRequestType: string[];
        shippingChargesPayment: {
            paymentType: string;
            payor: Record<string, any>;
        };
        requestedPackageLineItems: Array<{
            weight: {
                units: string;
                value: string;
            };
        }>;
    };
}




interface FedExRateCalculatorProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItems: OrderItem[];
    onRateSelected?: (rate: any) => void;
}

const PICKUP_TYPES = [
    { value: 'CONTACT_FEDEX_TO_SCHEDULE', label: 'Contact FedEx to Schedule' },
    { value: 'DROPOFF_AT_FEDEX_LOCATION', label: 'Drop off at FedEx Location' },
    { value: 'USE_SCHEDULED_PICKUP', label: 'Use Scheduled Pickup' }
];

const PAYMENT_TYPES = [
    { value: 'SENDER', label: 'Sender' },
    { value: 'RECIPIENT', label: 'Recipient' },
    { value: 'THIRD_PARTY', label: 'Third Party' }
];

export default function FedExRateCalculator({
    isOpen,
    onClose,
    selectedItems,
    onRateSelected
}: FedExRateCalculatorProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [rates, setRates] = useState<FedExRateResponse | null>(null);
    const [selectedRate, setSelectedRate] = useState<any>(null);

    // Form state
    const [accountNumber, setAccountNumber] = useState('740561073');
    const [returnTransitTimes, setReturnTransitTimes] = useState(true);
    const [shipperPostalCode, setShipperPostalCode] = useState('11209');
    const [shipperCountryCode, setShipperCountryCode] = useState('US');
    const [recipientPostalCode, setRecipientPostalCode] = useState('');
    const [recipientCountryCode, setRecipientCountryCode] = useState('US');
    const [pickupType, setPickupType] = useState('DROPOFF_AT_FEDEX_LOCATION');
    const [paymentType, setPaymentType] = useState('SENDER');

    // Package line items
    const [packageLineItems, setPackageLineItems] = useState<PackageLineItem[]>([]);

    // Initialize package line items from selected items
    useEffect(() => {
        if (selectedItems.length > 0) {
            const items = selectedItems.map(item => ({
                id: item.id,
                weight: item.products.weight || 1, // Default weight if not available
                quantity: item.quantity,
                productName: item.products.name
            }));
            setPackageLineItems(items);
        }
    }, [selectedItems]);

    const updatePackageWeight = (id: string, weight: number) => {
        setPackageLineItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, weight } : item
            )
        );
    };

    const getRateQuote = async () => {
        setIsLoading(true);
        try {
            const requestBody: FedExRateRequest = {
                accountNumber: {
                    value: accountNumber
                },
                rateRequestControlParameters: {
                    returnTransitTimes
                },
                requestedShipment: {
                    shipper: {
                        address: {
                            postalCode: shipperPostalCode,
                            countryCode: shipperCountryCode
                        }
                    },
                    recipient: {
                        address: {
                            postalCode: recipientPostalCode,
                            countryCode: recipientCountryCode
                        }
                    },
                    pickupType,
                    shippingChargesPayment: {
                        paymentType,
                        payor: {}
                    },
                    rateRequestType: [
                        "ACCOUNT",
                        "LIST"
                    ],
                    requestedPackageLineItems: packageLineItems.map(item => ({
                        weight: {
                            units: 'LB',
                            value: item.weight.toString()
                        }
                    }))
                }
            };
            console.log('requestBody', requestBody)

            // Call the server action to get FedEx rates
            const response = await GetFedExRates(requestBody);
            if (response.errors && response.errors.length > 0) {
                toast.error('Failed to get rate quote. Please try again.',
                    {
                        description: response.errors[0].message
                    }
                )
                return;
            }
            setRates(response);
            setCurrentStep(3);
            toast.success('Rate quote received successfully!');


        } catch (error) {
            console.error('Error getting rate quote:', error);
            toast.error('Failed to get rate quote. Please try again.',
                {
                    description: error instanceof Error ? error.message : 'An unknown error occurred'
                }
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleRateSelection = (rate: any) => {
        setSelectedRate(rate);
        onRateSelected?.(rate);
        toast.success(`Selected ${rate.serviceName}`);
    };

    console.log('rates', rates)
    const totalWeight = packageLineItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        FedEx Rate Calculator
                    </DialogTitle>
                    <DialogDescription>
                        Calculate shipping rates for your selected items
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center space-x-4">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${currentStep >= step
                                    ? 'bg-primary border-primary text-primary-foreground'
                                    : 'bg-muted border-muted-foreground text-muted-foreground'
                                    }`}>
                                    {currentStep > step ? (
                                        <CheckCircle className="h-4 w-4" />
                                    ) : (
                                        <span className="text-sm font-medium">{step}</span>
                                    )}
                                </div>
                                {step < 3 && (
                                    <div className={`w-16 h-0.5 mx-2 ${currentStep > step ? 'bg-primary' : 'bg-muted'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <Tabs value={currentStep.toString()} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="1" disabled={currentStep < 1}>
                            Package Details
                        </TabsTrigger>
                        <TabsTrigger value="2" disabled={currentStep < 2}>
                            Shipping Info
                        </TabsTrigger>
                        <TabsTrigger value="3" disabled={currentStep < 3}>
                            Rate Quotes
                        </TabsTrigger>
                    </TabsList>

                    {/* Step 1: Package Details */}
                    <TabsContent value="1" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Package Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Total Weight</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Input
                                                value={totalWeight.toFixed(2)}
                                                readOnly
                                                className="font-medium"
                                            />
                                            <Badge variant="secondary">lbs</Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Number of Packages</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Input
                                                value={packageLineItems.length}
                                                readOnly
                                                className="font-medium"
                                            />
                                            <Badge variant="secondary">packages</Badge>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <Label>Package Details</Label>
                                    {packageLineItems.map((item, index) => (
                                        <Card key={item.id} className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium">{item.productName}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Quantity: {item.quantity}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-sm">Weight (lbs):</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        min="0.1"
                                                        value={item.weight}
                                                        onChange={(e) => updatePackageWeight(item.id, parseFloat(e.target.value) || 0)}
                                                        className="w-20"
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => setCurrentStep(2)}
                                    className="w-full"
                                    disabled={packageLineItems.length === 0}
                                >
                                    Continue to Shipping Info
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Step 2: Shipping Information */}
                    <TabsContent value="2" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipper Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Shipper Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Account Number</Label>
                                        <Input
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            placeholder="Enter FedEx account number"
                                        />
                                    </div>
                                    <div>
                                        <Label>Postal Code</Label>
                                        <Input
                                            value={shipperPostalCode}
                                            onChange={(e) => setShipperPostalCode(e.target.value)}
                                            placeholder="Enter postal code"
                                        />
                                    </div>
                                    <div>
                                        <Label>Country Code</Label>
                                        <Select value={shipperCountryCode} onValueChange={setShipperCountryCode}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="US">United States (US)</SelectItem>
                                                <SelectItem value="CA">Canada (CA)</SelectItem>
                                                <SelectItem value="MX">Mexico (MX)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recipient Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Recipient Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Postal Code</Label>
                                        <Input
                                            value={recipientPostalCode}
                                            onChange={(e) => setRecipientPostalCode(e.target.value)}
                                            placeholder="Enter recipient postal code"
                                        />
                                    </div>
                                    <div>
                                        <Label>Country Code</Label>
                                        <Select value={recipientCountryCode} onValueChange={setRecipientCountryCode}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="US">United States (US)</SelectItem>
                                                <SelectItem value="CA">Canada (CA)</SelectItem>
                                                <SelectItem value="MX">Mexico (MX)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Shipping Options */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5" />
                                    Shipping Options
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className='space-y-2'>
                                        <Label className=''>Pickup Type</Label>
                                        <Select value={pickupType} onValueChange={setPickupType}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PICKUP_TYPES.map(type => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className=' space-y-2'>
                                        <Label>Payment Type</Label>
                                        <Select value={paymentType} onValueChange={setPaymentType}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PAYMENT_TYPES.map(type => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="returnTransitTimes"
                                        checked={returnTransitTimes}
                                        onCheckedChange={(checked) => setReturnTransitTimes(checked as boolean)}
                                    />
                                    <Label htmlFor="returnTransitTimes">
                                        Include transit times in response
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(1)}
                                className="flex-1"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={getRateQuote}
                                className="flex-1"
                                disabled={isLoading || !recipientPostalCode}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Getting Rates...
                                    </>
                                ) : (
                                    <>
                                        <Calculator className="h-4 w-4 mr-2" />
                                        Get Rate Quote
                                    </>
                                )}
                            </Button>
                        </div>
                    </TabsContent>

                    {/* Step 3: Rate Quotes */}
                    <TabsContent value="3" className="space-y-6">
                        {rates ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Available Rates
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Quote Date */}
                                    {rates.quoteDate && (
                                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-blue-800">
                                                <Info className="h-4 w-4" />
                                                <span className="text-sm font-medium">Quote Date: {new Date(rates.quoteDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {rates.rateReplyDetails.map((rate, index) => {
                                            const rateDetail = rate.ratedShipmentDetails[0];
                                            const isSelected = selectedRate?.serviceType === rate.serviceType;

                                            return (
                                                <Card
                                                    key={rate.serviceType}
                                                    className={`p-6 cursor-pointer transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                                                        }`}
                                                    onClick={() => handleRateSelection(rate)}
                                                >
                                                    <div className="space-y-4">
                                                        {/* Header */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="text-lg font-semibold text-foreground">{rate.serviceName}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {rate.packagingType.replace(/_/g, ' ')}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-3xl font-bold text-primary">
                                                                    ${rateDetail.totalNetCharge.toFixed(2)}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {rateDetail.currency}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Commit Information */}
                                                        {rate.commit && (
                                                            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                                                                {/* Delivery Commitment Header */}
                                                                <div className="flex items-center justify-between">
                                                                    <div className="text-sm font-medium text-foreground">Delivery Commitment</div>
                                                                    {rate.commit.guaranteedType && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            {rate.commit.guaranteedType.replace(/_/g, ' ')}
                                                                        </Badge>
                                                                    )}
                                                                </div>

                                                                {/* Transit Information */}
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        {/* Days in Transit */}
                                                                        {rate.commit.daysInTransit && (
                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                                                <span className="font-medium">
                                                                                    {rate.commit.daysInTransit.replace(/_/g, ' ').toLowerCase()}
                                                                                </span>
                                                                            </div>
                                                                        )}

                                                                        {/* Transit Days Description */}
                                                                        {rate.commit.transitDays?.description && (
                                                                            <div className="text-sm text-muted-foreground">
                                                                                {rate.commit.transitDays.description}
                                                                            </div>
                                                                        )}

                                                                        {/* Date Details */}
                                                                        {rate.commit.dateDetail && (
                                                                            <div className="space-y-1">
                                                                                {rate.commit.dateDetail.dayOfWeek && rate.commit.dateDetail.dayFormat && (
                                                                                    <div className="text-sm text-muted-foreground">
                                                                                        {rate.commit.dateDetail.dayOfWeek}, {new Date(rate.commit.dateDetail.dayFormat).toLocaleDateString()}
                                                                                    </div>
                                                                                )}
                                                                                {rate.commit.dateDetail.commitTimestamp && (
                                                                                    <div className="text-xs text-muted-foreground">
                                                                                        Commit: {new Date(rate.commit.dateDetail.commitTimestamp).toLocaleString()}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                        {/* SmartPost Commit Time */}
                                                                        {rate.commit.smartPostCommitTime && (
                                                                            <div className="text-sm text-muted-foreground">
                                                                                SmartPost: {rate.commit.smartPostCommitTime}
                                                                            </div>
                                                                        )}

                                                                        {/* Saturday Delivery */}
                                                                        {rate.commit.saturdayDelivery && (
                                                                            <Badge variant="secondary" className="text-xs">Saturday Delivery Available</Badge>
                                                                        )}
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        {/* Route Details */}
                                                                        {(rate.commit.derivedOriginDetail || rate.commit.derivedDestinationDetail) && (
                                                                            <div>
                                                                                <div className="text-sm font-medium text-foreground mb-1">Route Details</div>
                                                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                                                    {rate.commit.derivedOriginDetail?.postalCode && (
                                                                                        <div>From: {rate.commit.derivedOriginDetail.postalCode}</div>
                                                                                    )}
                                                                                    {rate.commit.derivedDestinationDetail?.postalCode && (
                                                                                        <div>To: {rate.commit.derivedDestinationDetail.postalCode}</div>
                                                                                    )}
                                                                                    {/* {rate.commit.derivedDestinationDetail?.airportId && (
                                                                                        <div>Airport: {rate.commit.derivedDestinationDetail.airportId}</div>
                                                                                    )} */}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Commodity Information */}
                                                                        {rate.commit.commodityName && (
                                                                            <div>
                                                                                <div className="text-sm font-medium text-foreground mb-1">Commodity</div>
                                                                                <div className="text-sm text-muted-foreground">{rate.commit.commodityName}</div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Additional Information */}
                                                                <div className="space-y-2">
                                                                    {/* Alternative Commodity Names */}
                                                                    {rate.commit.alternativeCommodityNames && rate.commit.alternativeCommodityNames.length > 0 && (
                                                                        <div>
                                                                            <div className="text-sm font-medium text-foreground mb-1">Alternative Names</div>
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {rate.commit.alternativeCommodityNames.map((name, idx) => (
                                                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                                                        {name}
                                                                                    </Badge>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Delay Details */}
                                                                    {rate.commit.delayDetails && (
                                                                        <div className="p-2 bg-amber-50 border border-amber-200 rounded">
                                                                            <div className="text-sm font-medium text-amber-800 mb-1">Delay Information</div>
                                                                            <div className="text-xs text-amber-700 space-y-1">
                                                                                {rate.commit.delayDetails.delayType && (
                                                                                    <div>Type: {rate.commit.delayDetails.delayType}</div>
                                                                                )}
                                                                                {rate.commit.delayDetails.delayLevel && (
                                                                                    <div>Level: {rate.commit.delayDetails.delayLevel}</div>
                                                                                )}
                                                                                {rate.commit.delayDetails.delayDescription && (
                                                                                    <div>Description: {rate.commit.delayDetails.delayDescription}</div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Labels and Messages */}
                                                                    {(rate.commit.label || rate.commit.commitMessageDetails) && (
                                                                        <div className="space-y-1">
                                                                            {rate.commit.label && (
                                                                                <div className="text-sm text-muted-foreground italic">
                                                                                    {rate.commit.label}
                                                                                </div>
                                                                            )}
                                                                            {rate.commit.commitMessageDetails && (
                                                                                <div className="text-sm text-muted-foreground">
                                                                                    {rate.commit.commitMessageDetails}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Rate Details */}
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                            <div>
                                                                <div className="text-muted-foreground">Base Charge</div>
                                                                <div className="font-medium">${rateDetail.totalBaseCharge.toFixed(2)}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-muted-foreground">Surcharges</div>
                                                                <div className="font-medium">${rateDetail.shipmentRateDetail.totalSurcharges.toFixed(2)}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-muted-foreground">Weight</div>
                                                                <div className="font-medium">{rateDetail.shipmentRateDetail.totalBillingWeight.value} {rateDetail.shipmentRateDetail.totalBillingWeight.units}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-muted-foreground">Rate Zone</div>
                                                                <div className="font-medium">{rateDetail.shipmentRateDetail.rateZone}</div>
                                                            </div>
                                                        </div>

                                                        {/* Surcharges */}
                                                        {rateDetail.shipmentRateDetail.surCharges.length > 0 && (
                                                            <div className="space-y-2">
                                                                <div className="text-sm font-medium text-foreground">Surcharges</div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {rateDetail.shipmentRateDetail.surCharges.map((surcharge, idx) => (
                                                                        <Badge key={idx} variant="outline" className="text-xs">
                                                                            {surcharge.description}: ${surcharge.amount.toFixed(2)}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Customer Messages */}
                                                        {rate.customerMessages && rate.customerMessages.length > 0 && (
                                                            <div className="space-y-2">
                                                                <div className="text-sm font-medium text-foreground">Notes</div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {rate.customerMessages.map((message, idx) => (
                                                                        <Badge key={idx} variant="secondary" className="text-xs">
                                                                            {message.message}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>

                                    {selectedRate && (
                                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-green-800">
                                                <CheckCircle className="h-5 w-5" />
                                                <span className="font-medium">Rate Selected</span>
                                            </div>
                                            <div className="mt-2 space-y-1 text-sm text-green-700">
                                                <div className="font-medium">{selectedRate.serviceName}</div>
                                                <div>Total: ${selectedRate.ratedShipmentDetails[0].totalNetCharge.toFixed(2)}</div>
                                                {selectedRate.commit && (
                                                    <div className="text-xs space-y-1">
                                                        {selectedRate.commit.daysInTransit && (
                                                            <div>
                                                                {selectedRate.commit.daysInTransit.replace(/_/g, ' ').toLowerCase()}
                                                            </div>
                                                        )}
                                                        {selectedRate.commit.dateDetail?.dayOfWeek && selectedRate.commit.dateDetail?.dayFormat && (
                                                            <div>
                                                                {selectedRate.commit.dateDetail.dayOfWeek}, {new Date(selectedRate.commit.dateDetail.dayFormat).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                        {selectedRate.commit.guaranteedType && (
                                                            <div className="text-green-600">
                                                                {selectedRate.commit.guaranteedType.replace(/_/g, ' ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="text-center py-8">
                                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No rates available</p>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(2)}
                                className="flex-1"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={onClose}
                                className="flex-1"
                            >
                                Close
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
} 