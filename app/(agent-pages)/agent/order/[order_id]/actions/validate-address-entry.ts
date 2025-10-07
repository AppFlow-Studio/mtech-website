'use server'

import { getFedExToken } from '@/lib/fedex-auth';
import { createClient } from '@/utils/supabase/server'

export async function validateAddressEntry({
    addressToValidate
}: {
    addressToValidate: {
        country: string,
        first_name: string,
        last_name: string,
        company: string,
        formatted_address: string,
        apartment_suite: string,
        city: string,
        state: string,
        zip_code: string,
        phone: string
    }
}) {
    try {
        const FEDEX_API_URL = process.env.NEXT_PUBLIC_FEDEX_API_URL;
        // FedEx Ship API endpoint for cancellation
        const fedexApiUrl = `${FEDEX_API_URL}/address/v1/addresses/resolve`;
        // Get FedEx access token
        const tokenResponse = await getFedExToken();

        if (!tokenResponse) {
            throw new Error('Failed to get FedEx access token')
        }

        const payload = {
            addressToValidate: {
                address: [{
                    postalCode: addressToValidate.zip_code,
                    countryCode: addressToValidate.country,
                    streetLines: [addressToValidate.formatted_address, addressToValidate.apartment_suite],
                    city: addressToValidate.city,
                    stateOrProvinceCode: addressToValidate.state,
                }]
            }
        }
        const response = await fetch(fedexApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenResponse}`,
            },
            body: JSON.stringify(payload),
        })

        if (response.ok) {
            const data = await response.json();
            return data;

        }
    } catch (error) {
        console.error('Error validating address entry:', error);
        return new Error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
}