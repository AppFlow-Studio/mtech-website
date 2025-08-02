import { QuoteCartItem } from '@/lib/quote-cart-store';
import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import { ProductCardWithPrice } from './components/ProductCardWithPrice';

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

interface QuoteApprovalEmailProps {
    customerName?: string;
    customerEmail?: string;
    order_confirmation_number?: string;
    items?: QuoteCartItem[];
    checkoutLink?: string;
}

export const QuoteApprovalEmail = ({
    customerName = 'Valued Customer',
    customerEmail = 'N/A',
    order_confirmation_number = 'N/A',
    items = [],
    checkoutLink = 'https://mtechdistributor.com/review-quote'
}: QuoteApprovalEmailProps) => {
    const totalAmount = items.reduce((sum, item) => {
        const price = item.price || item.product.default_price;
        return sum + (price * item.quantity);
    }, 0);

    return (
        <Html>
            <Head />
            <Preview>Your quote has been approved! - Order : {order_confirmation_number}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Img
                            src={`${baseUrl}/logo.png`}
                            width="180"
                            height="60"
                            alt="MTech Distributors"
                            style={logo}
                        />
                        <Hr style={hr} />

                        <Text style={heading}>🎉 Your Quote Has Been Approved!</Text>

                        <Text style={paragraph}>
                            Dear {customerName},
                        </Text>

                        <Text style={paragraph}>
                            Great news! Your quote request has been reviewed and approved by our team.
                            We're excited to help you get the equipment you need for your business.
                        </Text>

                        <div style={orderInfoBox}>
                            <Text style={orderInfoTitle}>Order Information</Text>
                            <Text style={orderInfoText}>
                                <strong>Order Confirmation Number:</strong> <span style={highlight}>{order_confirmation_number}</span><br />
                                <strong>Total Amount:</strong> <span style={highlight}>${totalAmount.toFixed(2)}</span><br />
                                <strong>Items:</strong> {items.length} product{items.length !== 1 ? 's' : ''}
                            </Text>
                        </div>

                        <Text style={sectionTitle}>Your Approved Products</Text>

                        {items.map((item, index) => (
                            <ProductCardWithPrice
                                key={item.product.id}
                                product={item.product}
                                quantity={item.quantity}
                                notes={item.notes}
                                price={item.price || item.product.default_price}
                            />
                        ))}

                        <div style={totalSection}>
                            <div style={totalRow}>
                                <Text style={totalLabel}>Total Order Value: </Text>
                                <Text style={totalAmountStyle}>${totalAmount.toFixed(2)}</Text>
                            </div>
                        </div>

                        <Hr style={hr} />

                        <Text style={sectionTitle}>Next Steps - Complete Your Order</Text>

                        <div style={stepsContainer}>
                            <div style={stepBox}>
                                <div style={stepNumber}>1</div>
                                <div style={stepContent}>
                                    <Text style={stepTitle}>Visit Your Order Page</Text>
                                    <Text style={stepDescription}>
                                        Click the button below to access your secure order page
                                    </Text>
                                </div>
                            </div>

                            <div style={stepBox}>
                                <div style={stepNumber}>2</div>
                                <div style={stepContent}>
                                    <Text style={stepTitle}>Login with Your Details</Text>
                                    <Text style={stepDescription}>
                                        Use your email address and order confirmation number: <strong>{order_confirmation_number}</strong>
                                    </Text>
                                </div>
                            </div>

                            <div style={stepBox}>
                                <div style={stepNumber}>3</div>
                                <div style={stepContent}>
                                    <Text style={stepTitle}>Review & Checkout</Text>
                                    <Text style={stepDescription}>
                                        Verify your order details and complete your purchase securely
                                    </Text>
                                </div>
                            </div>
                        </div>

                        <Button style={button} href={checkoutLink}>
                            🛒 Complete Your Order
                        </Button>

                        <Text style={paragraph}>
                            <strong>Order Status Tracking:</strong><br />
                            You can track your order status anytime by visiting our website and logging in with your email and order confirmation number.
                        </Text>

                        <Hr style={hr} />

                        <Text style={paragraph}>
                            <strong>Need assistance?</strong><br />
                            Our customer support team is here to help you complete your order:
                        </Text>

                        <Text style={contactInfo}>
                            📧 Email: support@mtechdistributor.com<br />
                            📞 Phone: (888) 411-7583<br />
                            🌐 Website: www.mtechdistributor.com
                        </Text>

                        <Text style={paragraph}>
                            Thank you for choosing MTech Distributors. We look forward to serving your business needs!
                        </Text>

                        <Text style={paragraph}>
                            Best regards,<br />
                            <strong>The MTech Distributors Team</strong>
                        </Text>

                        <Hr style={hr} />

                        <Text style={footer}>
                            MTech Distributors | Professional Payment Solutions & Equipment<br />
                            This email was sent to you because your quote request was approved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default QuoteApprovalEmail;

const main = {
    backgroundColor: '#f8fafc',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    width: '100%',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '800px',
};

const box = {
    padding: '0 48px',
};

const logo = {
    margin: '0 auto',
    display: 'block',
};

const heading = {
    color: '#7c3aed',
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '32px 0 24px',
};

const hr = {
    borderColor: '#e5e7eb',
    margin: '24px 0',
};

const paragraph = {
    color: '#374151',
    fontSize: '16px',
    lineHeight: '26px',
    textAlign: 'left' as const,
    margin: '16px 0',
};

const highlight = {
    color: '#7c3aed',
    fontWeight: 'bold',
};

const orderInfoBox = {
    backgroundColor: '#f0f9ff',
    border: '2px solid #0ea5e9',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
};

const orderInfoTitle = {
    color: '#0c4a6e',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
};

const orderInfoText = {
    color: '#0c4a6e',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0',
};

const sectionTitle = {
    color: '#111827',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '32px 0 16px 0',
};

const totalSection = {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    margin: '24px 0',
};

const totalRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const totalLabel = {
    fontSize: '18px',
    color: '#374151',
    fontWeight: '600',
    margin: '0',
};

const totalAmountStyle = {
    fontSize: '24px',
    color: '#7c3aed',
    fontWeight: 'bold',
    margin: '0',
};

const stepsContainer = {
    margin: '24px 0',
};

const stepBox = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
};

const stepNumber = {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    flexShrink: 0,
};

const stepContent = {
    flex: 1,
};

const stepTitle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0 0 4px 0',
};

const stepDescription = {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '20px',
    margin: '0',
};

const button = {
    backgroundColor: '#7c3aed',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '16px',
    margin: '32px 0',
    boxShadow: '0 4px 6px rgba(124, 58, 237, 0.25)',
};

const contactInfo = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '22px',
    backgroundColor: '#f9fafb',
    padding: '16px',
    borderRadius: '6px',
    margin: '16px 0',
};

const footer = {
    color: '#9ca3af',
    fontSize: '12px',
    lineHeight: '16px',
    textAlign: 'center' as const,
}; 