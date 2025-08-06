# Shipping Rate Calculator Feature

## Overview

This feature provides a comprehensive shipping rate calculation system integrated with FedEx API. It allows administrators to select shipping items from orders and get real-time rate quotes from FedEx.

## Components

### 1. FedExRateCalculator (`components/shipping/FedExRateCalculator.tsx`)

A multi-step wizard component that handles:
- **Step 1**: Package details and weight configuration
- **Step 2**: Shipping information (shipper/recipient details, pickup type, payment type)
- **Step 3**: Rate quotes display and selection

#### Features:
- Beautiful 3-step progress indicator
- Pre-populated package weights from product data
- Editable weight fields for each package
- Comprehensive shipping options
- Real-time rate comparison
- Visual feedback for rate selection

### 2. ShippingItemSelector (`components/shipping/ShippingItemSelector.tsx`)

A selection interface that:
- Filters order items marked for shipping (`fulfillment_type === 'SHIPPING'`)
- Allows bulk selection of items
- Shows summary information (total weight, value, package count)
- Integrates with FedExRateCalculator

### 3. Server Action (`app/(master-admin)/master-admin/actions/shipping/get-fedex-rates.ts`)

Handles the FedEx API integration:
- Currently returns mock data for development
- Includes commented example of actual FedEx API implementation
- Proper error handling and type safety

## Integration

### Order Management Pages

The shipping functionality is integrated into both:
- **Master Admin**: `app/(master-admin)/master-admin/orders/[order_id]/page.tsx`
- **Admin**: `app/(admin)/admin/orders/[order_id]/page.tsx`

### Usage Flow

1. **Access**: Click "Get Shipping Rates" button in order management
2. **Selection**: Choose items marked for shipping
3. **Configuration**: Set package details and shipping information
4. **Rate Quote**: Get real-time rates from FedEx
5. **Selection**: Choose preferred shipping option

## FedEx API Integration

### Required Environment Variables

```env
FEDEX_API_URL=https://apis-sandbox.fedex.com  # or production URL
FEDEX_CLIENT_ID=your_client_id
FEDEX_CLIENT_SECRET=your_client_secret
```

### API Request Structure

The system sends requests in the FedEx Rate API format:

```json
{
  "accountNumber": {
    "value": "613787354"
  },
  "rateRequestControlParameters": {
    "returnTransitTimes": true
  },
  "requestedShipment": {
    "shipper": {
      "address": {
        "postalCode": "65247",
        "countryCode": "US"
      }
    },
    "recipient": {
      "address": {
        "postalCode": "72348",
        "countryCode": "US"
      }
    },
    "pickupType": "DROPOFF_AT_FEDEX_LOCATION",
    "shippingChargesPayment": {
      "paymentType": "SENDER",
      "payor": {}
    },
    "requestedPackageLineItems": [
      {
        "weight": {
          "units": "LB",
          "value": "10"
        }
      }
    ]
  }
}
```

### Supported Pickup Types

- `CONTACT_FEDEX_TO_SCHEDULE`: FedEx will be contacted to request a pickup
- `DROPOFF_AT_FEDEX_LOCATION`: Shipment will be dropped off
- `USE_SCHEDULED_PICKUP`: Shipment will be picked up as part of a regular scheduled pickup

### Supported Payment Types

- `SENDER`: Sender pays shipping
- `RECIPIENT`: Recipient pays shipping
- `THIRD_PARTY`: Third party pays shipping

## Product Data Requirements

For optimal functionality, products should include:
- `weight` (number): Package weight in pounds
- `dimensions` (object): Package dimensions (optional)
  - `length` (number)
  - `width` (number)
  - `height` (number)

## Future Enhancements

1. **Real FedEx API Integration**: Replace mock data with actual API calls
2. **Rate Caching**: Cache rates to reduce API calls
3. **Label Generation**: Generate shipping labels after rate selection
4. **Tracking Integration**: Track shipments after creation
5. **Multiple Carriers**: Support for UPS, USPS, etc.
6. **Bulk Operations**: Process multiple orders simultaneously
7. **Rate History**: Store and display historical rate data

## Error Handling

The system includes comprehensive error handling:
- Network failures
- Invalid API responses
- Missing product data
- Invalid shipping addresses
- Rate calculation failures

## Styling

The components use the existing design system:
- Consistent with the application's UI/UX
- Responsive design for mobile and desktop
- Accessible with proper ARIA labels
- Loading states and progress indicators
- Toast notifications for user feedback

## Testing

To test the feature:
1. Create an order with items marked for shipping
2. Navigate to the order management page
3. Click "Get Shipping Rates"
4. Select items and proceed through the wizard
5. Verify rate quotes are displayed correctly

## Dependencies

- React (with hooks)
- TypeScript for type safety
- Lucide React for icons
- Sonner for toast notifications
- Existing UI components from the design system 