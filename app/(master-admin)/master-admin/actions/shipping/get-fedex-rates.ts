'use server';
import { getFedExToken } from "@/lib/fedex-auth"; // Adjust the import path as needed

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

interface FedExRateResponse {
    quoteDate?: string;
    errors?: Array<{
        code: string;
        message: string;
    }>;
    rateReplyDetails: Array<{
        serviceType: string;
        serviceName: string;
        packagingType: string;
        commit?: {
            daysInTransit?: string;
            guaranteedType?: string;
            smartPostCommitTime?: string;
            dateDetail?: {
                dayOfWeek?: string;
                dayFormat?: string;
                commitTimestamp?: string;
            };
            delayDetails?: {
                delayType?: string;
                delayLevel?: string;
                delayDescription?: string;
            };
            saturdayDelivery?: boolean;
            alternativeCommodityNames?: string[];
            transitDays?: {
                minimumTransitTime?: string;
                description?: string;
            };
            label?: string;
            commitMessageDetails?: string;
            commodityName?: string;
            derivedOriginDetail?: {
                countryCode?: string;
                stateOrProvinceCode?: string;
                postalCode?: string;
                locationNumber?: number;
            };
            derivedDestinationDetail?: {
                countryCode?: string;
                stateOrProvinceCode?: string;
                postalCode?: string;
                locationNumber?: number;
                airportId?: string;
            };
        };
        customerMessages?: Array<{
            code: string;
            message: string;
        }>;
        ratedShipmentDetails: Array<{
            rateType: string;
            ratedWeightMethod: string;
            totalDiscounts: number;
            totalBaseCharge: number;
            totalNetCharge: number;
            totalNetFedExCharge: number;
            shipmentRateDetail: {
                rateZone: string;
                dimDivisor: number;
                fuelSurchargePercent: number;
                totalSurcharges: number;
                totalFreightDiscount: number;
                surCharges: Array<{
                    type: string;
                    description: string;
                    level: string;
                    amount: number;
                }>;
                totalBillingWeight: {
                    units: string;
                    value: number;
                };
                dimDivisorType: string;
                currency: string;
                totalRateScaleWeight: {
                    units: string;
                    value: number;
                };
            };
            ratedPackages: Array<{
                groupNumber: number;
                effectiveNetDiscount: number;
                packageRateDetail: {
                    rateType: string;
                    ratedWeightMethod: string;
                    baseCharge: number;
                    netFreight: number;
                    totalSurcharges: number;
                    netFedExCharge: number;
                    totalTaxes: number;
                    netCharge: number;
                    totalRebates: number;
                    billingWeight: {
                        units: string;
                        value: number;
                    };
                    totalFreightDiscounts: number;
                    surcharges: Array<{
                        type: string;
                        description: string;
                        level: string;
                        amount: number;
                    }>;
                    currency: string;
                };
                sequenceNumber: number;
            }>;
            currency: string;
        }>;
    }>;
}

export async function GetFedExRates(requestBody: FedExRateRequest): Promise<FedExRateResponse> {
    try {
        const token = await getFedExToken();
        if (!token) {
            throw new Error('Failed to get FedEx access token');
        }
        const FedExQuoteApiRequest = await fetch(`${process.env.NEXT_PUBLIC_FEDEX_API_URL}/rate/v1/rates/quotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (FedExQuoteApiRequest.ok) {
            const response = await FedExQuoteApiRequest.json();
            return response.output;
        } else {
            throw new Error('Failed to get FedEx rates');
        }


    } catch (error) {
        console.error('Error getting FedEx rates:', error);
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
}

// Example of how to implement actual FedEx API call:
/*
export async function GetFedExRates(requestBody: FedExRateRequest): Promise<FedExRateResponse> {
    const FEDEX_API_URL = process.env.FEDEX_API_URL;
    const FEDEX_CLIENT_ID = process.env.FEDEX_CLIENT_ID;
    const FEDEX_CLIENT_SECRET = process.env.FEDEX_CLIENT_SECRET;
    
    if (!FEDEX_API_URL || !FEDEX_CLIENT_ID || !FEDEX_CLIENT_SECRET) {
        throw new Error('FedEx API credentials not configured');
    }
    
    try {
        // Get OAuth token
        const tokenResponse = await fetch(`${FEDEX_API_URL}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: FEDEX_CLIENT_ID,
                client_secret: FEDEX_CLIENT_SECRET,
            }),
        });
        
        const tokenData = await tokenResponse.json();
        
        if (!tokenData.access_token) {
            throw new Error('Failed to get FedEx access token');
        }
        
        // Make rate request
        const rateResponse = await fetch(`${FEDEX_API_URL}/rate/v1/rates/quotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenData.access_token}`,
            },
            body: JSON.stringify(requestBody),
        });
        
        if (!rateResponse.ok) {
            throw new Error(`FedEx API error: ${rateResponse.statusText}`);
        }
        
        const rateData = await rateResponse.json();
        return rateData;
        
    } catch (error) {
        console.error('Error getting FedEx rates:', error);
        throw new Error('Failed to get shipping rates from FedEx');
    }
}
*/ 