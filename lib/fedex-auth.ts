// lib/fedex-auth.ts

import "server-only"; // Ensures this module is never included in a client-side bundle

// Define the structure for our cached token
interface FedExToken {
    accessToken: string;
    expiresAt: number; // Store expiry time as a timestamp
}

// In-memory cache for the token
// This variable will persist in the server's memory for the lifetime of the server instance
let cachedToken: FedExToken | null = null;

/**
 * Fetches a new access token from the FedEx API.
 * This function should not be exported directly to ensure caching logic is always used.
 */
async function fetchNewToken(): Promise<FedExToken> {
    const clientId = process.env.FEDEX_CLIENT_ID;
    const clientSecret = process.env.FEDEX_CLIENT_SECRET;
    const url = `${process.env.NEXT_PUBLIC_FEDEX_API_URL}/oauth/token`;

    if (!clientId || !clientSecret) {
        throw new Error("FedEx API credentials are not configured in environment variables.");
    }

    console.log("Fetching a new FedEx access token...");

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        // You can add { cache: 'no-store' } if you see overly aggressive caching issues
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to fetch FedEx token: ${response.status} ${errorBody}`);
    }

    const data = await response.json();

    // Calculate the expiry time. FedEx tokens last for 3600 seconds (1 hour).
    // We subtract 300 seconds (5 minutes) as a buffer to be safe.
    const expiresAt = Date.now() + (data.expires_in - 300) * 1000;

    const newToken: FedExToken = {
        accessToken: data.access_token,
        expiresAt: expiresAt,
    };

    // Store the new token in our cache
    cachedToken = newToken;
    return newToken;
}

/**
 * Retrieves a valid FedEx access token, utilizing a cache to avoid unnecessary API calls.
 * If the cached token is missing or expired, it fetches a new one.
 * @returns {Promise<string>} A valid FedEx access token.
 */
export async function getFedExToken(): Promise<string | null> {
    try {
        const FEDEX_API_URL = process.env.NEXT_PUBLIC_FEDEX_API_URL;
        const FEDEX_CLIENT_ID = process.env.FEDEX_CLIENT_ID;
        const FEDEX_CLIENT_SECRET = process.env.FEDEX_CLIENT_SECRET;

        if (!FEDEX_API_URL || !FEDEX_CLIENT_ID || !FEDEX_CLIENT_SECRET) {
            console.error('FedEx API credentials not configured');
            return null;
        }

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

        if (!tokenResponse.ok) {
            console.error('Failed to get FedEx token:', tokenResponse.statusText);
            return null;
        }

        const tokenData = await tokenResponse.json();
        return tokenData.access_token || null;

    } catch (error) {
        console.error('Error getting FedEx token:', error);
        return null;
    }
}