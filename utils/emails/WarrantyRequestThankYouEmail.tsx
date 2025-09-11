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
} from '@react-email/components';

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

interface WarrantyRequestThankYouEmailProps {
    firstName: string;
    lastName: string;
    email: string;
    businessName: string;
    customerPO: string;
    manufacturer: string;
    submittedAt: string;
}

export const WarrantyRequestThankYouEmail = ({
    firstName,
    lastName,
    email,
    businessName,
    customerPO,
    manufacturer,
    submittedAt,
}: WarrantyRequestThankYouEmailProps) => {
    const fullName = `${firstName} ${lastName}`;

    return (
        <Html>
            <Head />
            <Preview>Thank you for your warranty request - MTech Distributors</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Img
                            src={`https://mtechdistributor.com/MtechDistributorsLogo.png`}
                            width="180"
                            height="60"
                            alt="MTech Distributors"
                            style={logo}
                        />
                        <Heading style={h1}>Warranty Request Received!</Heading>
                    </Section>

                    {/* Main Content */}
                    <Section style={box}>
                        <Section style={cardBody} className='mt-6'>
                            <Text style={greeting}>
                                Hello {firstName} {lastName},
                            </Text>

                            <Text style={paragraph}>
                                Thank you for submitting your warranty request to MTech Distributors! We've received your request and truly appreciate you taking the time to provide us with all the necessary information.
                            </Text>

                            <Text style={paragraph}>
                                Our warranty team is committed to providing exceptional service and support. We'll review your request carefully and process it according to the manufacturer's warranty policies.
                            </Text>

                            {/* Request Summary */}
                            <Section style={requestSummaryCard}>
                                <Text style={sectionTitle}>Your Request Summary</Text>

                                <div style={infoGrid}>
                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Business Name</Text>
                                        <Text style={infoValue}>{businessName}</Text>
                                    </div>
                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Customer PO</Text>
                                        <Text style={infoValue}>{customerPO}</Text>
                                    </div>
                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Manufacturer</Text>
                                        <Text style={infoValue}>{manufacturer}</Text>
                                    </div>
                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Submitted</Text>
                                        <Text style={infoValue}>{new Date(submittedAt).toLocaleDateString()}</Text>
                                    </div>
                                </div>
                            </Section>

                            {/* What's Next Section */}
                            <Section style={nextStepsCard}>
                                <Text style={sectionTitle}>What happens next?</Text>

                                <div style={stepContainer}>
                                    <div style={stepNumber}>1</div>
                                    <div style={stepContent}>
                                        <Text style={stepTitle}>Request Review</Text>
                                        <Text style={stepDescription}>
                                            Our warranty team will carefully review your request and verify all information provided.
                                        </Text>
                                    </div>
                                </div>

                                <div style={stepContainer}>
                                    <div style={stepNumber}>2</div>
                                    <div style={stepContent}>
                                        <Text style={stepTitle}>Manufacturer Verification</Text>
                                        <Text style={stepDescription}>
                                            We'll verify the warranty status with the manufacturer and check all serial numbers.
                                        </Text>
                                    </div>
                                </div>

                                <div style={stepContainer}>
                                    <div style={stepNumber}>3</div>
                                    <div style={stepContent}>
                                        <Text style={stepTitle}>Processing & Response</Text>
                                        <Text style={stepDescription}>
                                            You'll receive a detailed response with next steps within 24 hours during business days.
                                        </Text>
                                    </div>
                                </div>
                            </Section>

                            <Text style={paragraph}>
                                In the meantime, feel free to explore our website to learn more about our products and services, or check out our FAQ section for quick answers to common warranty questions.
                            </Text>

                            <Section style={buttonContainer}>
                                <Button style={button} href="https://mtechdistributor.com">
                                    Visit Our Website
                                </Button>
                                <Button style={secondaryButton} href="https://mtechdistributor.com/faq">
                                    View FAQ
                                </Button>
                            </Section>

                            {/* Warranty Information */}
                            <Section style={warrantyInfoCard}>
                                <Text style={sectionTitle}>Important Warranty Information</Text>

                                <div style={priorityItem}>
                                    <div style={priorityIndicator}></div>
                                    <Text style={priorityText}>
                                        <strong>Processing Time:</strong> Within 24 hours during business days
                                    </Text>
                                </div>

                                <div style={priorityItem}>
                                    <div style={priorityIndicator}></div>
                                    <Text style={priorityText}>
                                        <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST
                                    </Text>
                                </div>

                                <div style={priorityItem}>
                                    <div style={priorityIndicator}></div>
                                    <Text style={priorityText}>
                                        <strong>Defective Parts:</strong> Must be returned within 20 days of receiving replacement
                                    </Text>
                                </div>

                                <div style={priorityItem}>
                                    <div style={priorityIndicator}></div>
                                    <Text style={priorityText}>
                                        <strong>Processing Fee:</strong> $50 fee applies if warranty claim is not accepted
                                    </Text>
                                </div>
                            </Section>
                        </Section>
                    </Section>

                    {/* Contact Information */}
                    <Section style={card}>
                        <Section style={cardBody}>
                            <Text style={contactTitle}>Need Immediate Assistance?</Text>
                            <Text style={contactText}>
                                If you have urgent questions about your warranty request, you can reach us directly:
                            </Text>
                            <Text style={contactText}>
                                <strong>Phone:</strong> 888-411-7583
                            </Text>
                            <Text style={contactText}>
                                <strong>Email:</strong> support@mtechdistributor.com
                            </Text>
                            <Text style={contactText}>
                                <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST
                            </Text>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Thank you for choosing MTech Distributors for your warranty needs!
                        </Text>
                        <Text style={footerText}>
                            This email was sent to {email} on {new Date(submittedAt).toLocaleDateString()}
                        </Text>
                        <Text style={footerText}>
                            <Link href="https://mtechdistributor.com" style={link}>
                                MTech Distributors
                            </Link>
                            {' • '}
                            <Link href="https://mtechdistributor.com/privacy" style={link}>
                                Privacy Policy
                            </Link>
                            {' • '}
                            <Link href="https://mtechdistributor.com/terms" style={link}>
                                Terms of Service
                            </Link>
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
    maxWidth: '800px',
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

const box = {
    padding: '0 60px',
};

const card = {
    backgroundColor: '#f3e8ff',
    border: '1px solid #d8b4fe',
    borderRadius: '8px',
    margin: '20px 0',
    padding: '24px',
};

const cardBody = {
    padding: '0',
};

const greeting = {
    color: '#1e293b',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 16px 0',
};

const paragraph = {
    color: '#64748b',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0 0 16px 0',
};

const requestSummaryCard = {
    backgroundColor: '#fefcff',
    border: '1px solid #f3e8ff',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
};

const nextStepsCard = {
    backgroundColor: '#faf5ff',
    border: '1px solid #e9d5ff',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
};

const warrantyInfoCard = {
    backgroundColor: '#fef7ff',
    border: '1px solid #f3e8ff',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
};

const sectionTitle = {
    color: '#7c3aed',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 16px 0',
};

const infoGrid = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
};

const infoItem = {
    marginBottom: '16px',
};

const infoLabel = {
    color: '#7c3aed',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '0 0 4px 0',
};

const infoValue = {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: '500',
    margin: '0',
};

const stepContainer = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '20px',
};

const stepNumber = {
    color: '#8b5cf6',
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

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const button = {
    backgroundColor: '#8b5cf6',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
    margin: '8px',
    border: 'none',
};

const secondaryButton = {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    color: '#8b5cf6',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
    margin: '8px',
    border: '2px solid #8b5cf6',
};

const contactTitle = {
    color: '#7c3aed',
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

const priorityItem = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
};

const priorityIndicator = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#8b5cf6',
    marginRight: '12px',
    flexShrink: 0,
};

const priorityText = {
    color: '#7c3aed',
    fontSize: '14px',
    margin: '0',
};

const footer = {
    padding: '32px 60px',
    textAlign: 'center' as const,
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
};

const footerText = {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 8px 0',
};

const link = {
    color: '#8b5cf6',
    textDecoration: 'none',
};

export default WarrantyRequestThankYouEmail;
