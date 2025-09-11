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

interface WarrantyRequestSubmissionEmailProps {
    firstName: string;
    lastName: string;
    email: string;
    businessName: string;
    customerPO: string;
    phoneCode: string;
    phoneNumber: string;
    hasWarranty: string;
    manufacturer: string;
    repairTypes: string[];
    partsSerialNumber: string;
    atmSerialNumber: string;
    message: string;
    issueDescription: string;
    submittedAt: string;
    submissionId?: string;
    files?: string[];
}

export const WarrantyRequestSubmissionEmail = ({
    firstName,
    lastName,
    email,
    businessName,
    customerPO,
    phoneCode,
    phoneNumber,
    hasWarranty,
    manufacturer,
    repairTypes,
    partsSerialNumber,
    atmSerialNumber,
    message,
    issueDescription,
    submittedAt,
    submissionId,
    files,
}: WarrantyRequestSubmissionEmailProps) => {
    const fullName = `${firstName} ${lastName}`;
    const fullPhone = `${phoneCode} ${phoneNumber}`;
    const submissionDate = new Date(submittedAt).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    });

    return (
        <Html>
            <Head />
            <Preview>New Warranty Request from {fullName} - {businessName}</Preview>
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
                        <Heading style={h1}>New Warranty Request</Heading>
                        <Text style={headerSubtext}>
                            A warranty request has been submitted through the website
                        </Text>
                    </Section>

                    {/* Main Content */}
                    <Section style={box}>
                        <Section style={cardBody}>
                            {/* Submission Details */}
                            <Section style={detailsCard}>
                                <Text style={sectionTitle}>Request Details</Text>

                                <div style={detailRow}>
                                    <Text style={detailLabel}>Request ID:</Text>
                                    <Text style={detailValue}>
                                        {submissionId || `WR-${Date.now()}`}
                                    </Text>
                                </div>

                                <div style={detailRow}>
                                    <Text style={detailLabel}>Submitted:</Text>
                                    <Text style={detailValue}>{submissionDate}</Text>
                                </div>

                                <div style={detailRow}>
                                    <Text style={detailLabel}>Source:</Text>
                                    <Text style={detailValue}>Website Warranty Request Form</Text>
                                </div>
                            </Section>

                            {/* Customer Information */}
                            <Section style={customerCard}>
                                <Text style={sectionTitle}>Customer Information</Text>

                                <div style={infoGrid}>
                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Full Name</Text>
                                        <Text style={infoValue}>{fullName}</Text>
                                    </div>

                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Business Name</Text>
                                        <Text style={infoValue}>{businessName}</Text>
                                    </div>

                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Email Address</Text>
                                        <Text style={infoValue}>
                                            <Link href={`mailto:${email}`} style={emailLink}>
                                                {email}
                                            </Link>
                                        </Text>
                                    </div>

                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Phone Number</Text>
                                        <Text style={infoValue}>
                                            <Link href={`tel:${fullPhone}`} style={phoneLink}>
                                                {fullPhone}
                                            </Link>
                                        </Text>
                                    </div>

                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Customer PO</Text>
                                        <Text style={infoValue}>{customerPO}</Text>
                                    </div>

                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Warranty Status</Text>
                                        <Text style={infoValue}>
                                            <span style={hasWarranty === 'yes' ? warrantyYes : warrantyNo}>
                                                {hasWarranty === 'yes' ? 'Yes' : 'No'}
                                            </span>
                                        </Text>
                                    </div>
                                </div>
                            </Section>

                            {/* Equipment Information */}
                            <Section style={equipmentCard}>
                                <Text style={sectionTitle}>Equipment Information</Text>

                                <div style={infoGrid}>
                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Manufacturer</Text>
                                        <Text style={infoValue}>{manufacturer}</Text>
                                    </div>

                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Parts Serial Number</Text>
                                        <Text style={infoValue}>{partsSerialNumber}</Text>
                                    </div>

                                    <div style={infoItem}>
                                        <Text style={infoLabel}>ATM Serial Number</Text>
                                        <Text style={infoValue}>{atmSerialNumber}</Text>
                                    </div>

                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Repair Types</Text>
                                        <Text style={infoValue}>
                                            {repairTypes.map((type, index) => (
                                                <span key={type}>
                                                    {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    {index < repairTypes.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </Text>
                                    </div>
                                </div>
                            </Section>

                            {/* Message Content */}
                            <Section style={messageCard}>
                                <Text style={sectionTitle}>Customer Message</Text>
                                <div style={messageContainer}>
                                    <Text style={messageText}>{message}</Text>
                                </div>
                            </Section>

                            {/* Issue Description */}
                            <Section style={issueCard}>
                                <Text style={sectionTitle}>Issue Description</Text>
                                <div style={messageContainer}>
                                    <Text style={messageText}>{issueDescription}</Text>
                                </div>
                            </Section>

                            {/* Uploaded Files */}
                            {files && files.length > 0 && (
                                <Section style={filesCard}>
                                    <Text style={sectionTitle}>Uploaded Files</Text>
                                    <div style={fileList}>
                                        {files.map((fileName, index) => (
                                            <div key={index} style={fileItem}>
                                                <div style={fileIcon}>📎</div>
                                                <div style={fileInfo}>
                                                    <Text style={fileNameStyle}>{fileName}</Text>
                                                    <Text style={fileStatus}>Attached to email</Text>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            )}

                            {/* Quick Actions */}
                            <Section style={actionsCard}>
                                <Text style={sectionTitle}>Quick Actions</Text>

                                <div style={buttonContainer}>
                                    <Button style={primaryButton} href={`mailto:${email}?subject=Re: Your warranty request - ${customerPO}`}>
                                        Reply via Email
                                    </Button>
                                    <Button style={secondaryButton} href={`tel:${fullPhone}`}>
                                        Call Customer
                                    </Button>
                                </div>

                                <div style={buttonContainer}>
                                    <Button style={tertiaryButton} href="https://mtechdistributor.com/admin">
                                        View Admin Panel
                                    </Button>
                                </div>
                            </Section>

                            {/* Priority Indicators */}
                            <Section style={priorityCard}>
                                <Text style={sectionTitle}>Processing Priority</Text>

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
                                        <strong>Follow-up Required:</strong> Yes - Customer expects warranty processing
                                    </Text>
                                </div>

                                <div style={priorityItem}>
                                    <div style={priorityIndicator}></div>
                                    <Text style={priorityText}>
                                        <strong>Warranty Status:</strong> {hasWarranty === 'yes' ? 'Under Warranty' : 'Out of Warranty'}
                                    </Text>
                                </div>
                            </Section>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            This warranty request was automatically generated by the MTech Distributors website.
                        </Text>
                        <Text style={footerText}>
                            Please process this warranty request promptly to maintain our high service standards.
                        </Text>
                        <Hr style={divider} />
                        <Text style={footerText}>
                            <Link href="https://mtechdistributor.com" style={link}>
                                MTech Distributors
                            </Link>
                            {' • '}
                            <Link href="https://mtechdistributor.com/admin" style={link}>
                                Admin Panel
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
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '16px 0 8px 0',
    textAlign: 'center' as const,
};

const headerSubtext = {
    color: '#e9d5ff',
    fontSize: '16px',
    margin: '0',
    textAlign: 'center' as const,
};

const box = {
    padding: '0 60px',
};

const cardBody = {
    padding: '0',
};

const detailsCard = {
    backgroundColor: '#faf5ff',
    border: '1px solid #e9d5ff',
    borderRadius: '8px',
    padding: '24px',
    margin: '20px 0',
};

const customerCard = {
    backgroundColor: '#f3e8ff',
    border: '1px solid #d8b4fe',
    borderRadius: '8px',
    padding: '24px',
    margin: '20px 0',
};

const equipmentCard = {
    backgroundColor: '#fefcff',
    border: '1px solid #f3e8ff',
    borderRadius: '8px',
    padding: '24px',
    margin: '20px 0',
};

const messageCard = {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '24px',
    margin: '20px 0',
};

const issueCard = {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '24px',
    margin: '20px 0',
};

const filesCard = {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '24px',
    margin: '20px 0',
};

const actionsCard = {
    backgroundColor: '#f5f3ff',
    border: '1px solid #ddd6fe',
    borderRadius: '8px',
    padding: '24px',
    margin: '20px 0',
};

const priorityCard = {
    backgroundColor: '#fef7ff',
    border: '1px solid #f3e8ff',
    borderRadius: '8px',
    padding: '24px',
    margin: '20px 0',
};

const sectionTitle = {
    color: '#7c3aed',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 16px 0',
};

const detailRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e9d5ff',
};

const detailLabel = {
    color: '#7c3aed',
    fontSize: '14px',
    fontWeight: '600',
    margin: '0',
    flex: '1',
};

const detailValue = {
    color: '#1e293b',
    fontSize: '14px',
    margin: '0',
    flex: '2',
    textAlign: 'right' as const,
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

const emailLink = {
    color: '#7c3aed',
    textDecoration: 'none',
};

const phoneLink = {
    color: '#7c3aed',
    textDecoration: 'none',
};

const warrantyYes = {
    color: '#059669',
    fontWeight: '600',
};

const warrantyNo = {
    color: '#dc2626',
    fontWeight: '600',
};

const messageContainer = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '16px',
    marginTop: '8px',
};

const messageText = {
    color: '#1e293b',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0',
    whiteSpace: 'pre-wrap' as const,
};

const fileList = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
};

const fileItem = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
};

const fileIcon = {
    fontSize: '20px',
    marginRight: '12px',
};

const fileInfo = {
    flex: '1',
};

const fileNameStyle = {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
};

const fileStatus = {
    color: '#059669',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '16px 0',
};

const primaryButton = {
    backgroundColor: '#8b5cf6',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 20px',
    margin: '4px',
    border: 'none',
};

const secondaryButton = {
    backgroundColor: '#7c3aed',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 20px',
    margin: '4px',
    border: 'none',
};

const tertiaryButton = {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    color: '#8b5cf6',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 20px',
    margin: '4px',
    border: '2px solid #8b5cf6',
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

const divider = {
    borderColor: '#e2e8f0',
    margin: '20px 0',
};

const link = {
    color: '#8b5cf6',
    textDecoration: 'none',
};

export default WarrantyRequestSubmissionEmail;
