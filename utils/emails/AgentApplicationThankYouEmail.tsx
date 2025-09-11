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

interface AgentApplicationThankYouEmailProps {
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    submittedAt: string;
}

export const AgentApplicationThankYouEmail = ({
    firstName,
    lastName,
    email,
    companyName,
    submittedAt,
}: AgentApplicationThankYouEmailProps) => {
    const fullName = `${firstName} ${lastName}`;

    return (
        <Html>
            <Head />
            <Preview>Thank you for your agent application - MTech Distributors</Preview>
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
                        <Heading style={h1}>Agent Application Received!</Heading>
                    </Section>

                    {/* Main Content */}
                    <Section style={box}>
                        <Section style={cardBody}>
                            <Text style={greeting}>
                                Hello {firstName} {lastName},
                            </Text>

                            <Text style={paragraph}>
                                Thank you for your interest in becoming an MTech Distributors agent! We've received your application and are excited about the possibility of partnering with {companyName}.
                            </Text>

                            <Text style={paragraph}>
                                Our team is committed to building strong partnerships with qualified agents who share our vision of providing exceptional ATM and payment processing solutions. We'll carefully review your application and supporting documents.
                            </Text>

                            {/* Application Summary */}
                            <Section style={applicationSummaryCard}>
                                <Text style={sectionTitle}>Your Application Summary</Text>

                                <div style={infoGrid}>
                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Company Name</Text>
                                        <Text style={infoValue}>{companyName}</Text>
                                    </div>
                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Contact Person</Text>
                                        <Text style={infoValue}>{fullName}</Text>
                                    </div>
                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Email Address</Text>
                                        <Text style={infoValue}>{email}</Text>
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
                                        <Text style={stepTitle}>Application Review</Text>
                                        <Text style={stepDescription}>
                                            Our partnership team will review your application and verify all submitted documents.
                                        </Text>
                                    </div>
                                </div>

                                <div style={stepContainer}>
                                    <div style={stepNumber}>2</div>
                                    <div style={stepContent}>
                                        <Text style={stepTitle}>Background Verification</Text>
                                        <Text style={stepDescription}>
                                            We'll verify your business credentials, financial standing, and market presence.
                                        </Text>
                                    </div>
                                </div>

                                <div style={stepContainer}>
                                    <div style={stepNumber}>3</div>
                                    <div style={stepContent}>
                                        <Text style={stepTitle}>Partnership Decision</Text>
                                        <Text style={stepDescription}>
                                            You'll receive a detailed response with our decision and next steps within 2-3 business days.
                                        </Text>
                                    </div>
                                </div>
                            </Section>

                            <Text style={paragraph}>
                                In the meantime, feel free to explore our website to learn more about our products, services, and the benefits of partnering with MTech Distributors.
                            </Text>

                            <Section style={buttonContainer}>
                                <Button style={button} href="https://mtechdistributor.com">
                                    Visit Our Website
                                </Button>
                                <Button style={secondaryButton} href="https://mtechdistributor.com/partnership">
                                    Learn About Partnerships
                                </Button>
                            </Section>

                            {/* Partnership Benefits */}
                            <Section style={benefitsCard}>
                                <Text style={sectionTitle}>Why Partner with MTech Distributors?</Text>

                                <div style={benefitList}>
                                    <div style={benefitItem}>
                                        <div style={benefitIcon}>💰</div>
                                        <div style={benefitContent}>
                                            <Text style={benefitTitle}>Competitive Commissions</Text>
                                            <Text style={benefitDescription}>
                                                Earn attractive commissions on every successful sale
                                            </Text>
                                        </div>
                                    </div>

                                    <div style={benefitItem}>
                                        <div style={benefitIcon}>🛠️</div>
                                        <div style={benefitContent}>
                                            <Text style={benefitTitle}>Technical Support</Text>
                                            <Text style={benefitDescription}>
                                                Comprehensive training and ongoing technical support
                                            </Text>
                                        </div>
                                    </div>

                                    <div style={benefitItem}>
                                        <div style={benefitIcon}>📈</div>
                                        <div style={benefitContent}>
                                            <Text style={benefitTitle}>Growth Opportunities</Text>
                                            <Text style={benefitDescription}>
                                                Access to exclusive products and market expansion opportunities
                                            </Text>
                                        </div>
                                    </div>

                                    <div style={benefitItem}>
                                        <div style={benefitIcon}>🤝</div>
                                        <div style={benefitContent}>
                                            <Text style={benefitTitle}>Partnership Support</Text>
                                            <Text style={benefitDescription}>
                                                Dedicated account management and marketing support
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            {/* Review Timeline */}
                            <Section style={timelineCard}>
                                <Text style={sectionTitle}>Review Timeline</Text>

                                <div style={priorityItem}>
                                    <div style={priorityIndicator}></div>
                                    <Text style={priorityText}>
                                        <strong>Review Time:</strong> 2-3 business days
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
                                        <strong>Response Method:</strong> Email with detailed feedback
                                    </Text>
                                </div>

                                <div style={priorityItem}>
                                    <div style={priorityIndicator}></div>
                                    <Text style={priorityText}>
                                        <strong>Next Steps:</strong> Partnership agreement and onboarding process
                                    </Text>
                                </div>
                            </Section>
                        </Section>
                    </Section>

                    {/* Contact Information */}
                    <Section style={card}>
                        <Section style={cardBody}>
                            <Text style={contactTitle}>Questions About Your Application?</Text>
                            <Text style={contactText}>
                                If you have any questions about your agent application or our partnership program, please don't hesitate to contact us:
                            </Text>
                            <Text style={contactText}>
                                <strong>Phone:</strong> 888-411-7583
                            </Text>
                            <Text style={contactText}>
                                <strong>Email:</strong> partnerships@mtechdistributor.com
                            </Text>
                            <Text style={contactText}>
                                <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST
                            </Text>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Thank you for considering MTech Distributors as your business partner!
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

const applicationSummaryCard = {
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

const benefitsCard = {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
};

const timelineCard = {
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

const benefitList = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
};

const benefitItem = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
};

const benefitIcon = {
    fontSize: '24px',
    flexShrink: 0,
};

const benefitContent = {
    flex: '1',
};

const benefitTitle = {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
};

const benefitDescription = {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0',
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

export default AgentApplicationThankYouEmail;
