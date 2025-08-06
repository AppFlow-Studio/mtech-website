'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { createShipmentLabel, CreateShipmentLabelRequest } from '@/app/(master-admin)/master-admin/actions/shipping/create-shipment-label';

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
    order_shipping_address: any;
    onShipmentCreated?: (shipmentData: any) => void;
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

const LABEL_FORMATS = [
    { value: 'COMMON2D', label: 'Common 2D' },
    { value: 'LABEL_DATA_ONLY', label: 'Label Data Only' }
];

const IMAGE_TYPE = [
    { value: 'PDF', label: 'PDF' },
    { value: 'ZPLII', label: 'ZPLII' },
    { value: 'EPL2', label: 'EPL2' },
    { value: 'PNG', label: 'PNG' }
]

const LABEL_STOCK_TYPES = [
    { value: 'PAPER_4X6', label: '4x6 inch Label' },
    { value: 'PAPER_4X6.75', label: '4x6.75 inch Label' },
    { value: 'PAPER_4X8', label: '4x8 inch Label' },
    { value: 'PAPER_4X9', label: '4x9 inch Label' },
    { value: 'PAPER_8.5X11_TOP_HALF_LABEL', label: '8.5x11 inch (Top Half)' },
    { value: 'PAPER_8.5X11_BOTTOM_HALF_LABEL', label: '8.5x11 inch (Bottom Half)' },
    { value: 'PAPER_8.5X11_FULL_LABEL', label: '8.5x11 inch (Full Page)' }
];

export default function FedExRateCalculator({
    isOpen,
    onClose,
    selectedItems,
    onRateSelected,
    order_shipping_address,
    onShipmentCreated
}: FedExRateCalculatorProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingShipment, setIsCreatingShipment] = useState(false);
    const [rates, setRates] = useState<FedExRateResponse | null>(null);
    const [selectedRate, setSelectedRate] = useState<any>(null);
    const [shipmentResponse, setShipmentResponse] = useState<any>(null);

    // Fulfillment step state
    const [labelFormat, setLabelFormat] = useState('COMMON2D');
    const [imageType, setImageType] = useState('PDF');
    const [labelStockType, setLabelStockType] = useState('PAPER_4X6');
    const [isEditingShipper, setIsEditingShipper] = useState(false);
    const [isEditingRecipient, setIsEditingRecipient] = useState(false);

    // Form state
    const [accountNumber, setAccountNumber] = useState('740561073');
    const [returnTransitTimes, setReturnTransitTimes] = useState(true);

    // Mtech office default address
    const [shipperPostalCode, setShipperPostalCode] = useState('11209');
    const [shipperCountryCode, setShipperCountryCode] = useState('US');
    const [shipperAddress, setShipperAddress] = useState({
        streetAddress: '182 Bay Ridge Ave',
        city: 'Brooklyn',
        state: 'NY',
        postalCode: '11209',
        country: 'United States'
    });

    const [recipientPostalCode, setRecipientPostalCode] = useState(order_shipping_address.zip_code || '');
    const [recipientCountryCode, setRecipientCountryCode] = useState('US');
    const [pickupType, setPickupType] = useState('DROPOFF_AT_FEDEX_LOCATION');
    const [paymentType, setPaymentType] = useState('SENDER');

    // Package line items
    const [packageLineItems, setPackageLineItems] = useState<PackageLineItem[]>([]);

    // Initialize package line items from selected items - combine all into one package
    useEffect(() => {
        if (selectedItems.length > 0) {
            // Calculate total weight by summing up all items
            const totalWeight = selectedItems.reduce((sum, item) => {
                const itemWeight = item.products.weight || 1; // Default weight if not available
                return sum + (itemWeight * item.quantity);
            }, 0);

            // Create a single package with combined weight
            const combinedPackage = {
                id: 'combined-package',
                weight: totalWeight,
                quantity: 1,
                productName: `${selectedItems.length} item(s) - Combined Package`
            };

            setPackageLineItems([combinedPackage]);
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
        setCurrentStep(4); // Move to fulfillment step
        toast.success(`Selected ${rate.serviceName} - Proceeding to shipment creation`);
    };

    const createShipment = async () => {
        if (!selectedRate) {
            toast.error('No rate selected');
            return;
        }

        setIsCreatingShipment(true);
        try {
            // Prepare shipment data
            const shipmentData: CreateShipmentLabelRequest = {
                accountNumber: {
                    value: accountNumber
                },
                labelResponseOptions: "LABEL",
                requestedShipment: {
                    shipper: {
                        contact: {
                            personName: "Samir Kadi",
                            phoneNumber: "888-411-7583" // Default office phone
                        },
                        address: {
                            streetLines: [shipperAddress.streetAddress],
                            city: shipperAddress.city,
                            stateOrProvinceCode: shipperAddress.state,
                            postalCode: shipperAddress.postalCode,
                            countryCode: shipperCountryCode
                        }
                    },
                    recipients: [{
                        contact: {
                            personName: order_shipping_address.first_name + ' ' + order_shipping_address.last_name,
                            phoneNumber: order_shipping_address.phone || "555-000-0000"
                        },
                        address: {
                            streetLines: [order_shipping_address.formatted_address],
                            city: order_shipping_address.city,
                            stateOrProvinceCode: order_shipping_address.state,
                            postalCode: recipientPostalCode,
                            countryCode: recipientCountryCode
                        }
                    }],
                    serviceType: selectedRate.serviceType,
                    packagingType: selectedRate.packagingType,
                    pickupType: pickupType,
                    shippingChargesPayment: {
                        paymentType: paymentType,
                        payor: {
                            responsibleParty: {
                                accountNumber: {
                                    value: accountNumber,
                                    key: accountNumber
                                }
                            },
                            address: {
                                streetLines: [shipperAddress.streetAddress],
                                city: shipperAddress.city,
                                stateOrProvinceCode: shipperAddress.state,
                                postalCode: shipperAddress.postalCode,
                                countryCode: shipperCountryCode
                            }
                        }
                    },
                    labelSpecification: {
                        labelFormatType: labelFormat,
                        labelStockType: labelStockType
                    },
                    requestedPackageLineItems: [{
                        weight: {
                            units: 'LB',
                            value: packageLineItems[0].weight.toString()
                        }
                    }]
                }
            };
            console.log('shipmentData', shipmentData)
            // Call the callback to handle shipment creation
            const response = await createShipmentLabel(shipmentData);
            console.log('response', response)

            if (response instanceof Error) {
                toast.error('Failed to create shipment. Please try again.', {
                    description: response.message
                });
                return;
            } else {
                setShipmentResponse(response);
                setCurrentStep(5); // Move to confirmation step
                toast.success('Shipment created successfully!', {
                    description: `Tracking: ${response.output.transactionShipments[0].masterTrackingNumber}`
                });
            }
        } catch (error) {
            console.error('Error creating shipment:', error);
            toast.error('Failed to create shipment. Please try again.');
        } finally {
            setIsCreatingShipment(false);
        }
    };

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
                        {[1, 2, 3, 4, 5].map((step) => (
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
                                {step < 5 && (
                                    <div className={`w-12 h-0.5 mx-2 ${currentStep > step ? 'bg-primary' : 'bg-muted'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <Tabs value={currentStep.toString()} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="1" disabled={currentStep < 1}>
                            Package Details
                        </TabsTrigger>
                        <TabsTrigger value="2" disabled={currentStep < 2}>
                            Shipping Info
                        </TabsTrigger>
                        <TabsTrigger value="3" disabled={currentStep < 3}>
                            Rate Quotes
                        </TabsTrigger>
                        <TabsTrigger value="4" disabled={currentStep < 4}>
                            Create Shipment
                        </TabsTrigger>
                        <TabsTrigger value="5" disabled={currentStep < 5}>
                            Confirmation
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
                                                value="1"
                                                readOnly
                                                className="font-medium"
                                            />
                                            <Badge variant="secondary">package (combined)</Badge>
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
                                                        Combined package with {selectedItems.length} different item(s)
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        Items: {selectedItems.map(item => `${item.products.name} (${item.quantity})`).join(', ')}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-sm">Total Weight (lbs):</Label>
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
                                        Mtech Office (Shipper)
                                    </CardTitle>
                                    <CardDescription>
                                        Default shipping address for Mtech office
                                    </CardDescription>
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

                                    {/* Mtech Office Address */}
                                    <div className="space-y-3">
                                        <Label>Office Address</Label>
                                        <div className="p-3 bg-muted/30 rounded-lg space-y-2 text-sm">
                                            <div className="font-medium">182 Bay Ridge Ave</div>
                                            <div>Brooklyn, NY 11209</div>
                                            <div>United States</div>
                                        </div>
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

                        {/* Order Shipping Address - Read Only */}
                        {order_shipping_address && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                        Order Shipping Address
                                    </CardTitle>
                                    <CardDescription>
                                        Complete shipping address from the order
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            {/* Contact Information */}
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Contact Information</Label>
                                                <div className="mt-2 space-y-1">
                                                    {order_shipping_address.first_name && order_shipping_address.last_name && (
                                                        <p className="text-sm">
                                                            <span className="font-medium">Name:</span> {order_shipping_address.first_name} {order_shipping_address.last_name}
                                                        </p>
                                                    )}
                                                    {order_shipping_address.company && (
                                                        <p className="text-sm">
                                                            <span className="font-medium">Company:</span> {order_shipping_address.company}
                                                        </p>
                                                    )}
                                                    {order_shipping_address.phone && (
                                                        <p className="text-sm">
                                                            <span className="font-medium">Phone:</span> {order_shipping_address.phone}
                                                        </p>
                                                    )}
                                                    {order_shipping_address.email && (
                                                        <p className="text-sm">
                                                            <span className="font-medium">Email:</span> {order_shipping_address.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {/* Address Information */}
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                                                <div className="mt-2 space-y-1">
                                                    {order_shipping_address.formatted_address && (
                                                        <p className="text-sm">
                                                            <span className="font-medium">Street:</span> {order_shipping_address.formatted_address}
                                                        </p>
                                                    )}
                                                    {order_shipping_address.apartment_suite && (
                                                        <p className="text-sm">
                                                            <span className="font-medium">Apt/Suite:</span> {order_shipping_address.apartment_suite}
                                                        </p>
                                                    )}
                                                    {(order_shipping_address.city || order_shipping_address.state || order_shipping_address.zip_code) && (
                                                        <p className="text-sm">
                                                            <span className="font-medium">City, State, ZIP:</span> {[
                                                                order_shipping_address.city,
                                                                order_shipping_address.state,
                                                                order_shipping_address.zip_code
                                                            ].filter(Boolean).join(', ')}
                                                        </p>
                                                    )}
                                                    {order_shipping_address.country && (
                                                        <p className="text-sm">
                                                            <span className="font-medium">Country:</span> {order_shipping_address.country}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full Address Display */}
                                    <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                                        <Label className="text-sm font-medium text-muted-foreground">Complete Shipping Address</Label>
                                        <div className="mt-2 text-sm">
                                            {[
                                                order_shipping_address.first_name && order_shipping_address.last_name ?
                                                    `${order_shipping_address.first_name} ${order_shipping_address.last_name}` : null,
                                                order_shipping_address.company,
                                                order_shipping_address.formatted_address,
                                                order_shipping_address.apartment_suite,
                                                [
                                                    order_shipping_address.city,
                                                    order_shipping_address.state,
                                                    order_shipping_address.zip_code
                                                ].filter(Boolean).join(', '),
                                                order_shipping_address.country
                                            ].filter(Boolean).map((line, index) => (
                                                <div key={index} className={index === 0 ? 'font-medium' : ''}>
                                                    {line}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

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
                                                                                    {rate.commit.derivedDestinationDetail?.airportId && (
                                                                                        <div>Airport (if applicable): {rate.commit.derivedDestinationDetail.airportId}</div>
                                                                                    )}
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

                    {/* Step 4: Shipment Fulfillment */}
                    <TabsContent value="4" className="space-y-6">
                        {selectedRate ? (
                            <>
                                {/* Shipment Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5 text-green-600" />
                                            Shipment Summary
                                        </CardTitle>
                                        <CardDescription>
                                            Final confirmation before creating shipping label
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Selected Service */}
                                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-lg font-semibold text-primary">
                                                        {selectedRate.serviceName}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {selectedRate.packagingType.replace(/_/g, ' ')}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-primary">
                                                        ${selectedRate.ratedShipmentDetails[0].totalNetCharge.toFixed(2)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {selectedRate.commit?.daysInTransit?.replace(/_/g, ' ').toLowerCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Addresses */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Shipper Address */}
                                            <Card>
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="text-base flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-blue-600" />
                                                            Mtech Office (Ship From)
                                                        </CardTitle>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setIsEditingShipper(!isEditingShipper)}
                                                            className="text-xs"
                                                        >
                                                            {isEditingShipper ? 'Done' : 'Edit'}
                                                        </Button>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    {isEditingShipper ? (
                                                        <div className="space-y-3">
                                                            <div>
                                                                <Label>Street Address</Label>
                                                                <Input
                                                                    value={shipperAddress.streetAddress}
                                                                    onChange={(e) => setShipperAddress(prev => ({ ...prev, streetAddress: e.target.value }))}
                                                                    className="mt-1"
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <Label>City</Label>
                                                                    <Input
                                                                        value={shipperAddress.city}
                                                                        onChange={(e) => setShipperAddress(prev => ({ ...prev, city: e.target.value }))}
                                                                        className="mt-1"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>State</Label>
                                                                    <Input
                                                                        value={shipperAddress.state}
                                                                        onChange={(e) => setShipperAddress(prev => ({ ...prev, state: e.target.value }))}
                                                                        className="mt-1"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <Label>Postal Code</Label>
                                                                    <Input
                                                                        value={shipperAddress.postalCode}
                                                                        onChange={(e) => setShipperAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                                                                        className="mt-1"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>Country</Label>
                                                                    <Select value={shipperAddress.country} onValueChange={(value) => setShipperAddress(prev => ({ ...prev, country: value }))}>
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="United States">United States</SelectItem>
                                                                            <SelectItem value="Canada">Canada</SelectItem>
                                                                            <SelectItem value="Mexico">Mexico</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2 text-sm">
                                                            <div className="font-medium">Mtech Office</div>
                                                            <div className="text-muted-foreground">{shipperAddress.streetAddress}</div>
                                                            <div className="text-muted-foreground">
                                                                {shipperAddress.city}, {shipperAddress.state} {shipperAddress.postalCode}
                                                            </div>
                                                            <div className="text-muted-foreground">{shipperAddress.country}</div>
                                                            <div className="font-medium mt-3">FedEx Account</div>
                                                            <div className="text-muted-foreground">{accountNumber}</div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>

                                            {/* Recipient Address */}
                                            <Card>
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="text-base flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-green-600" />
                                                            Ship To
                                                        </CardTitle>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setIsEditingRecipient(!isEditingRecipient)}
                                                            className="text-xs"
                                                        >
                                                            {isEditingRecipient ? 'Done' : 'Edit'}
                                                        </Button>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    {isEditingRecipient ? (
                                                        <div className="space-y-3">
                                                            <div>
                                                                <Label>Postal Code</Label>
                                                                <Input
                                                                    value={recipientPostalCode}
                                                                    onChange={(e) => setRecipientPostalCode(e.target.value)}
                                                                    className="mt-1"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label>Country</Label>
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
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2 text-sm">
                                                            {order_shipping_address?.first_name && order_shipping_address?.last_name && (
                                                                <div className="font-medium">
                                                                    {order_shipping_address.first_name} {order_shipping_address.last_name}
                                                                </div>
                                                            )}
                                                            {order_shipping_address?.company && (
                                                                <div className="text-muted-foreground">{order_shipping_address.company}</div>
                                                            )}
                                                            {order_shipping_address?.formatted_address && (
                                                                <div className="text-muted-foreground">{order_shipping_address.formatted_address}</div>
                                                            )}
                                                            {order_shipping_address?.apartment_suite && (
                                                                <div className="text-muted-foreground">{order_shipping_address.apartment_suite}</div>
                                                            )}
                                                            <div className="text-muted-foreground">
                                                                {[
                                                                    order_shipping_address?.city,
                                                                    order_shipping_address?.state,
                                                                    order_shipping_address?.zip_code
                                                                ].filter(Boolean).join(', ')}
                                                            </div>
                                                            <div className="text-muted-foreground">
                                                                {order_shipping_address?.country}
                                                            </div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Package Details */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    Package Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <div className="text-muted-foreground">Total Weight</div>
                                                        <div className="font-medium">{totalWeight.toFixed(2)} lbs</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-muted-foreground">Package Count</div>
                                                        <div className="font-medium">1 (Combined)</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-muted-foreground">Items</div>
                                                        <div className="font-medium">{selectedItems.length} different</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-muted-foreground">Rate Zone</div>
                                                        <div className="font-medium">{selectedRate.ratedShipmentDetails[0].shipmentRateDetail.rateZone}</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CardContent>
                                </Card>

                                {/* Label Settings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Truck className="h-5 w-5" />
                                            Label & Printer Settings
                                        </CardTitle>
                                        <CardDescription>
                                            Configure label format and printer settings
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Label Format *</Label>
                                                <Select value={labelFormat} onValueChange={setLabelFormat}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {LABEL_FORMATS.map(format => (
                                                            <SelectItem key={format.value} value={format.value}>
                                                                {format.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Image Type *</Label>
                                                <Select value={imageType} onValueChange={setImageType}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {IMAGE_TYPE.map(type => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Label Stock Type *</Label>
                                                <Select value={labelStockType} onValueChange={setLabelStockType}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {LABEL_STOCK_TYPES.map(stock => (
                                                            <SelectItem key={stock.value} value={stock.value}>
                                                                {stock.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep(3)}
                                        className="flex-1"
                                    >
                                        Back to Rates
                                    </Button>
                                    <Button
                                        onClick={createShipment}
                                        disabled={isCreatingShipment}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        {isCreatingShipment ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Creating Shipment...
                                            </>
                                        ) : (
                                            <>
                                                <Package className="h-4 w-4 mr-2" />
                                                Create Shipping Label
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No rate selected</p>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep(3)}
                                    className="mt-4"
                                >
                                    Back to Rate Selection
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    {/* Step 5: Shipment Confirmation */}
                    <TabsContent value="5" className="space-y-6">
                        {shipmentResponse ? (
                            <>
                                {/* Success Header */}
                                <div className="text-center py-8">
                                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-800 mb-2">Shipment Created Successfully!</h2>
                                    <p className="text-muted-foreground">Your shipping label has been generated and is ready for use.</p>
                                </div>

                                {/* Tracking Information */}
                                <Card className="border-green-200 bg-green-50/30">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-green-800">
                                            <Truck className="h-5 w-5" />
                                            Tracking Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Master Tracking Number</Label>
                                                    <div className="mt-1 p-3 bg-white border border-green-200 rounded-lg">
                                                        <div className="text-xl font-mono font-bold text-green-800">
                                                            {shipmentResponse.output.transactionShipments[0].masterTrackingNumber}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Service Type</Label>
                                                    <div className="mt-1 text-lg font-semibold">
                                                        {shipmentResponse.output.transactionShipments[0].serviceName}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Ship Date</Label>
                                                    <div className="mt-1 text-lg">
                                                        {new Date(shipmentResponse.output.transactionShipments[0].shipDatestamp).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Transaction ID</Label>
                                                    <div className="mt-1 text-sm font-mono text-muted-foreground">
                                                        {shipmentResponse.transactionId}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Service Category</Label>
                                                    <div className="mt-1">
                                                        <Badge variant="secondary">
                                                            {shipmentResponse.output.transactionShipments[0].serviceCategory}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-muted-foreground">Carrier Code</Label>
                                                    <div className="mt-1">
                                                        <Badge variant="outline">
                                                            {shipmentResponse.output.transactionShipments[0].completedShipmentDetail.carrierCode}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Shipping Rating Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5" />
                                            Shipping Cost Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {shipmentResponse.output.transactionShipments[0].completedShipmentDetail.shipmentRating && (
                                            <div className="space-y-6">
                                                {shipmentResponse.output.transactionShipments[0].completedShipmentDetail.shipmentRating.shipmentRateDetails.map((rateDetail: any, index: number) => (
                                                    <div key={index} className="space-y-4">
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">Total Net Charge</Label>
                                                                <div className="mt-1 text-2xl font-bold text-primary">
                                                                    ${rateDetail.totalNetCharge.toFixed(2)}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">{rateDetail.currency}</div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">Base Charge</Label>
                                                                <div className="mt-1 text-lg font-semibold">
                                                                    ${rateDetail.totalBaseCharge.toFixed(2)}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">Surcharges</Label>
                                                                <div className="mt-1 text-lg font-semibold">
                                                                    ${rateDetail.totalSurcharges.toFixed(2)}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">Billing Weight</Label>
                                                                <div className="mt-1 text-lg font-semibold">
                                                                    {rateDetail.totalBillingWeight.value} {rateDetail.totalBillingWeight.units}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Rate Zone and Details */}
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">Rate Zone</Label>
                                                                <div className="mt-1">
                                                                    <Badge variant="outline">{rateDetail.rateZone}</Badge>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">Rate Type</Label>
                                                                <div className="mt-1">
                                                                    <Badge variant="secondary">{rateDetail.rateType}</Badge>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">Pricing Code</Label>
                                                                <div className="mt-1">
                                                                    <Badge variant="outline">{rateDetail.pricingCode}</Badge>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Surcharges Breakdown */}
                                                        {rateDetail.surcharges && rateDetail.surcharges.length > 0 && (
                                                            <div className="space-y-3">
                                                                <Label className="text-sm font-medium">Surcharges Breakdown</Label>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    {rateDetail.surcharges.map((surcharge: any, idx: number) => (
                                                                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                                                            <div>
                                                                                <div className="font-medium text-sm">{surcharge.description}</div>
                                                                                <div className="text-xs text-muted-foreground">{surcharge.surchargeType}</div>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <div className="font-semibold">${parseFloat(surcharge.amount).toFixed(2)}</div>
                                                                                <div className="text-xs text-muted-foreground">{surcharge.level}</div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Label Download Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            Shipping Label
                                        </CardTitle>
                                        <CardDescription>
                                            Download or print your shipping label
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {shipmentResponse.output.transactionShipments[0].pieceResponses &&
                                            shipmentResponse.output.transactionShipments[0].pieceResponses.length > 0 && shipmentResponse.output.transactionShipments[0].pieceResponses[0].packageDocuments && shipmentResponse.output.transactionShipments[0].pieceResponses[0].packageDocuments.length > 0 ? (
                                            <div className="space-y-4">
                                                {shipmentResponse.output.transactionShipments[0].pieceResponses[0].packageDocuments.map((doc: any, index: number) => (
                                                    <div key={index} className="p-4 border border-muted rounded-lg">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div>
                                                                <div className="font-semibold">{doc.docType}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Content Type: {doc.contentType}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm text-muted-foreground">
                                                                    Copies: {doc.copiesToPrint}
                                                                </div>
                                                                {doc.trackingNumber && (
                                                                    <div className="text-xs text-muted-foreground">
                                                                        Track: {doc.trackingNumber}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            {doc.url && (
                                                                <Button
                                                                    onClick={() => window.open(doc.url, '_blank')}
                                                                    className="flex-1"
                                                                >
                                                                    <Package className="h-4 w-4 mr-2" />
                                                                    Download Label
                                                                </Button>
                                                            )}
                                                            {doc.encodedLabel && (
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        const link = document.createElement('a');
                                                                        link.href = `data:application/pdf;base64,${doc.encodedLabel}`;
                                                                        link.download = `shipping-label-${doc.trackingNumber || 'label'}.pdf`;
                                                                        link.click();
                                                                    }}
                                                                    className="flex-1"
                                                                >
                                                                    <Truck className="h-4 w-4 mr-2" />
                                                                    Download PDF
                                                                </Button>
                                                            )}
                                                        </div>

                                                        {/* Alerts */}
                                                        {doc.alerts && doc.alerts.length > 0 && (
                                                            <div className="mt-3 space-y-2">
                                                                {doc.alerts.map((alert: any, alertIndex: number) => (
                                                                    <div key={alertIndex} className="p-2 bg-amber-50 border border-amber-200 rounded text-sm">
                                                                        <div className="font-medium text-amber-800">{alert.alertType}</div>
                                                                        <div className="text-amber-700">{alert.message}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                <p className="text-muted-foreground">No shipping documents available</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Package Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            Package Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {shipmentResponse.output.transactionShipments[0].pieceResponses &&
                                            shipmentResponse.output.transactionShipments[0].pieceResponses.length > 0 ? (
                                            <div className="space-y-4">
                                                {shipmentResponse.output.transactionShipments[0].pieceResponses.map((piece: any, index: number) => (
                                                    <div key={index} className="p-4 border border-muted rounded-lg">
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">Tracking Number</Label>
                                                                <div className="mt-1 font-mono font-semibold">
                                                                    {piece.trackingNumber}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">Net Charge</Label>
                                                                <div className="mt-1 text-lg font-semibold">
                                                                    ${piece.netChargeAmount.toFixed(2)}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">Service Category</Label>
                                                                <div className="mt-1">
                                                                    <Badge variant="secondary">{piece.serviceCategory}</Badge>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm font-medium text-muted-foreground">Acceptance Type</Label>
                                                                <div className="mt-1">
                                                                    <Badge variant="outline">{piece.acceptanceType}</Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-muted-foreground">No package details available</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep(4)}
                                        className="flex-1"
                                    >
                                        Back to Shipment
                                    </Button>
                                    <Button
                                        onClick={onClose}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Complete
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No shipment data available</p>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep(4)}
                                    className="mt-4"
                                >
                                    Back to Shipment Creation
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
} 