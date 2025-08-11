'use server'

import { addShippingAuditLog } from "@/app/(master-admin)/master-admin/actions/shipping/shipping-audit-logs";
import { OrderShipmentConfirmationEmail } from "./OrderShipmentConfirmationEmail";
import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";
import { OrderItem } from "@/lib/types";

const resend = new Resend(process.env.RESEND_KEY);

export async function sendOrderEmail({
    order_id,
    orderNumber,
    trackingNumber,
    shippingService,
    items,
    additionalFees,
    customerEmail,
}: {
    order_id: string;
    orderNumber: string;
    trackingNumber: string;
    shippingService: string;
    items: {
        name: string;
        quantity: number;
        imageUrl?: string;
    }[];
    additionalFees: number;
    customerEmail: string;
}) {
    try {
        const supabase = await createClient();
        const { data, error } = await resend.emails.send({
            from: 'MTech Distributors <support@mtechdistributor.com>',
            to: customerEmail,
            subject: 'Your order is on the way',
            react: OrderShipmentConfirmationEmail({
                order_id,
                orderNumber,
                trackingNumber,
                shippingService,
                items,
                additionalFees,
            })
        });


        // Audit log
        const { data: AuditLogEntry, error: AuditLogError } = await supabase.from('order_audit_log').insert({
            order_id: order_id,
            message: `Shipment confirmation email sent to ${customerEmail}`,
            event_type: 'EMAIL_SENT',
            user_name: 'MTech Distributors',
            details: { "EMAIL_SENT": { "sent_email_id": data?.id, "recipient_email": customerEmail } }
        })
        return data;
    } catch (error) {
        console.error(error);
        return new Error(error instanceof Error ? error.message : "Failed to send order email");
    }
}