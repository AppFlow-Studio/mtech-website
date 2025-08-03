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
} from '@react-email/components';
import { ProductCardInfo } from './components/ProductCardInfo';
import { QuoteCartItem } from '@/lib/quote-cart-store';

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

interface QuoteSubmissionEmailProps {
    customerName?: string;
    notes?: string;
    items?: QuoteCartItem[];
}

export const QuoteSubmissionEmail = ({ customerName = 'Valued Customer', notes = '', items = [] }: QuoteSubmissionEmailProps) => (
    <Html className='w-full'>
        <Head />
        <Preview>Thank you for your quote request - We'll review and get back to you soon!</Preview>
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

                    <Text style={heading}>Thank You for Your Quote Request!</Text>

                    <Text style={paragraph}>
                        Dear {customerName},
                    </Text>

                    <Text style={paragraph}>
                        We've successfully received your quote request and our team is excited to review your requirements.
                        We understand the importance of getting you the right equipment and pricing for your business needs.
                    </Text>

                    <Text style={paragraph}>
                        <strong>What happens next?</strong>
                    </Text>

                    <Text style={paragraph}>
                        Our experienced team will carefully review your quote request and prepare a detailed proposal
                        with competitive pricing. We typically respond within 24-48 hours during business days.
                    </Text>

                    <Text style={paragraph}>
                        <strong>If your quote is approved:</strong>
                    </Text>

                    <Text style={paragraph}>
                        • You'll receive a follow-up email with your order confirmation Number<br />
                        • A secure login link will be provided for easy checkout<br />
                        • We'll keep you updated on the status of your order throughout the process<br />
                        • Our team will be available to answer any questions you may have
                    </Text>

                    <Text className='w-full space-y-4'>
                        <strong>Your Quote Request Details:</strong><br />
                        {
                            items.map((item) => (
                                <ProductCardInfo key={item.product.id} product={item.product} notes={item.notes} quantity={item.quantity} />
                            ))
                        }
                        {notes && (
                            <Text style={paragraph}>
                                <strong>Notes:</strong> {notes}
                            </Text>
                        )}
                        Submission Date: {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>

                    <Button style={button} href="https://mtechdistributor.com">
                        Visit Our Website
                    </Button>

                    <Hr style={hr} />

                    <Text style={paragraph}>
                        <strong>Need immediate assistance?</strong><br />
                        Our customer support team is here to help:
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
                        This email was sent to you because you submitted a quote request on our website.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default QuoteSubmissionEmail;

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
