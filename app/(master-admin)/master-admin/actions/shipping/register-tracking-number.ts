'use server'
import { Shippo } from "shippo";

const shippo = new Shippo({
  apiKeyHeader: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
  shippoApiVersion: "2018-02-08",
});

async function RegisterTrackingNumber({ carrier, tracking_number, metadata } : { carrier : string, tracking_number : string, metadata : string }) {
  const result = await shippo.trackingStatus.create({
    carrier: 'shippo',
    metadata: metadata,
    trackingNumber: 'SHIPPO_TRANSIT',
  });

  if( result instanceof Error){
    return new Error(result.message)
  }

  // Handle the result
  console.log(result);
  return result
}

export default RegisterTrackingNumber
