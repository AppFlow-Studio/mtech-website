import { Product } from '@/lib/types';
import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Heading,
    Row,
    Column,
} from '@react-email/components';

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

export interface OrderItem {
    id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    price_at_order: number;
    notes?: string;
    product?: Product;
}

interface OrderSubmissionEmailProps {
    customerName: string;
    customerEmail: string;
    orderConfirmationNumber: string;
    orderItems: OrderItem[];
    orderNotes?: string;
    agentName: string;
    agentEmail: string;
    totalAmount: number;
    submittedAt: string;
}

export const OrderSubmissionEmail = ({
    customerName,
    customerEmail,
    orderConfirmationNumber,
    orderItems,
    orderNotes,
    agentName,
    agentEmail,
    totalAmount,
    submittedAt,
}: OrderSubmissionEmailProps) => {
    const formattedDate = new Date(submittedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Html>
            <Head />
            <Preview>Your order has been submitted successfully - Order #{orderConfirmationNumber}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Img
                            src={`${baseUrl}/logo.png`}
                            width="180"
                            height="60"
                            alt="MTech Distributors"
                            style={logo}
                        />
                        <Heading style={h1}>Order Submitted Successfully!</Heading>
                        <Text style={subtitle}>
                            Thank you for choosing MTech Distributors. Your order has been submitted and is now under review.
                        </Text>
                    </Section>

                    {/* Order Confirmation */}
                    <Section style={card}>
                        <Section style={cardHeader}>
                            <Heading style={h2}>Order Confirmation</Heading>
                        </Section>
                        <Section style={cardBody}>
                            <Row>
                                <Column style={column}>
                                    <Text style={label}>Order Number:</Text>
                                    <Text style={value}>{orderConfirmationNumber}</Text>
                                </Column>
                                <Column style={column}>
                                    <Text style={label}>Submitted:</Text>
                                    <Text style={value}>{formattedDate}</Text>
                                </Column>
                            </Row>
                            <Row>
                                <Column style={column}>
                                    <Text style={label}>Customer:</Text>
                                    <Text style={value}>{customerName}</Text>
                                </Column>
                                <Column style={column}>
                                    <Text style={label}>Agent:</Text>
                                    <Text style={value}>{agentName}</Text>
                                </Column>
                            </Row>
                            <Row>
                                {/* <Column style={column}>
                                    <Text style={label}>Fulfillment:</Text>
                                    <Text style={value}>
                                        {fulfillmentType === 'delivery' ? 'Delivery' : 'Pickup'}
                                    </Text>
                                </Column> */}
                                <Column style={column}>
                                    <Text style={label}>Total Amount:</Text>
                                    <Text style={totalAmountStyle}>${totalAmount.toFixed(2)}</Text>
                                </Column>
                            </Row>
                        </Section>
                    </Section>

                    {/* Order Items */}
                    <Section style={card}>
                        <Section style={cardHeader}>
                            <Heading style={h2}>Order Items</Heading>
                        </Section>
                        <Section style={cardBody}>
                            {orderItems.map((item, index) => (
                                <div key={item.id} style={itemContainer}>
                                    <div style={itemImageContainer}>
                                        {item.product?.imageSrc ? (
                                            <Img
                                                src={item.product.imageSrc}
                                                width="60"
                                                height="60"
                                                alt={item.product_name}
                                                style={itemImage}
                                            />
                                        ) : (
                                            <div style={itemImagePlaceholder}>
                                                <Text style={itemImageText}>
                                                    {item.product_name.charAt(0)}
                                                </Text>
                                            </div>
                                        )}
                                    </div>
                                    <div style={itemDetails}>
                                        <Text style={itemName}>{item.product_name}</Text>
                                        <Text style={itemQuantity}>Quantity: {item.quantity}</Text>
                                        <Text style={itemPrice}>
                                            ${item.price_at_order.toFixed(2)} each
                                        </Text>
                                        {item.notes && (
                                            <Text style={itemNotes}>Notes: {item.notes}</Text>
                                        )}
                                    </div>
                                    <div style={itemTotal}>
                                        <Text style={itemTotalText}>
                                            ${(item.price_at_order * item.quantity).toFixed(2)}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        </Section>
                    </Section>

                    {/* Order Notes */}
                    {orderNotes && (
                        <Section style={card}>
                            <Section style={cardHeader}>
                                <Heading style={h2}>Order Notes</Heading>
                            </Section>
                            <Section style={cardBody}>
                                <Text style={notesText}>{orderNotes}</Text>
                            </Section>
                        </Section>
                    )}



                    {/* Next Steps */}
                    <Section style={card}>
                        <Section style={cardHeader}>
                            <Heading style={h2}>What Happens Next?</Heading>
                        </Section>
                        <Section style={cardBody}>
                            <div style={stepContainer}>
                                <div style={stepNumber}>1</div>
                                <div style={stepContent}>
                                    <Text style={stepTitle}>Order Review</Text>
                                    <Text style={stepDescription}>
                                        Our admin team will review your order and verify all details.
                                    </Text>
                                </div>
                            </div>

                            <div style={stepContainer}>
                                <div style={stepNumber}>2</div>
                                <div style={stepContent}>
                                    <Text style={stepTitle}>Status Updates</Text>
                                    <Text style={stepDescription}>
                                        You'll receive email updates as your order progresses through our system.
                                    </Text>
                                </div>
                            </div>

                            <div style={stepContainer}>
                                <div style={stepNumber}>3</div>
                                <div style={stepContent}>
                                    <Text style={stepTitle}>Approval & Checkout</Text>
                                    <Text style={stepDescription}>
                                        Once approved, you'll receive a secure checkout link to complete your payment.
                                    </Text>
                                </div>
                            </div>

                            {/* <div style={stepContainer}>
                                <div style={stepNumber}>4</div>
                                <div style={stepContent}>
                                    <Text style={stepTitle}>Fulfillment</Text>
                                    <Text style={stepDescription}>
                                        After payment, we'll process your order and arrange .
                                    </Text>
                                </div>
                            </div> */}
                        </Section>
                    </Section>

                    {/* Contact Information */}
                    <Section style={card}>
                        <Section style={cardBody}>
                            <Text style={contactTitle}>Need Help?</Text>
                            <Text style={contactText}>
                                If you have any questions about your order, please contact:
                            </Text>
                            <Text style={contactText}>
                                <strong>Agent:</strong> {agentName} ({agentEmail})
                            </Text>
                            <Text style={contactText}>
                                <strong>MTech Support:</strong> support@mtechdistributor.com
                            </Text>
                            <Text style={contactText}>
                                <strong>Phone:</strong> (555) 123-4567
                            </Text>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Thank you for choosing MTech Distributors!
                        </Text>
                        <Text style={footerText}>
                            This email was sent to {customerEmail}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const header = {
    padding: '40px 0',
    textAlign: 'center' as const,
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
};

const logo = {
    margin: '0 auto',
    marginBottom: '20px',
};

const h1 = {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '16px 0',
    textAlign: 'center' as const,
};

const subtitle = {
    color: '#ffffff',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0',
    textAlign: 'center' as const,
};

const card = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    margin: '20px 0',
    overflow: 'hidden',
};

const cardHeader = {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderBottom: '1px solid #e2e8f0',
};

const cardBody = {
    padding: '20px',
};

const h2 = {
    color: '#1e293b',
    fontSize: '20px',
    fontWeight: '600',
    margin: '0',
};

const column = {
    width: '50%',
    padding: '8px 0',
};

const label = {
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 0 4px 0',
};

const value = {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0',
};

const totalAmountStyle = {
    color: '#8b5cf6',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0',
};

const itemContainer = {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid #f1f5f9',
};

const itemImageContainer = {
    marginRight: '16px',
};

const itemImage = {
    borderRadius: '8px',
    objectFit: 'cover' as const,
};

const itemImagePlaceholder = {
    width: '60px',
    height: '60px',
    backgroundColor: '#8b5cf6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const itemImageText = {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
};

const itemDetails = {
    flex: '1',
};

const itemName = {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
};

const itemQuantity = {
    color: '#64748b',
    fontSize: '14px',
    margin: '0 0 4px 0',
};

const itemPrice = {
    color: '#64748b',
    fontSize: '14px',
    margin: '0 0 4px 0',
};

const itemNotes = {
    color: '#8b5cf6',
    fontSize: '14px',
    fontStyle: 'italic',
    margin: '0',
};

const itemTotal = {
    textAlign: 'right' as const,
};

const itemTotalText = {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0',
};

const notesText = {
    color: '#1e293b',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0',
    fontStyle: 'italic',
};

const sectionTitle = {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 8px 0',
};

const addressText = {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 4px 0',
};

const divider = {
    borderColor: '#e2e8f0',
    margin: '20px 0',
};

const stepContainer = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '20px',
};

const stepNumber = {
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    marginRight: '16px',
    flexShrink: 0,
};

const stepContent = {
    flex: '1',
};

const stepTitle = {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
};

const stepDescription = {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0',
};

const contactTitle = {
    color: '#1e293b',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 12px 0',
};

const contactText = {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 8px 0',
};

const footer = {
    textAlign: 'center' as const,
    padding: '40px 0',
    backgroundColor: '#f8fafc',
    marginTop: '40px',
};

const footerText = {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 8px 0',
};

export default OrderSubmissionEmail;

