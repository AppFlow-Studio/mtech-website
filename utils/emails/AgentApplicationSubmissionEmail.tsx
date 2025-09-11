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

interface AgentApplicationSubmissionEmailProps {
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    phoneCode: string;
    phoneNumber: string;
    submittedAt: string;
    submissionId?: string;
    voidCheck?: string[];
    photoId?: string[];
    ein?: string[];
}

export const AgentApplicationSubmissionEmail = ({
    firstName,
    lastName,
    email,
    companyName,
    phoneCode,
    phoneNumber,
    submittedAt,
    submissionId,
    voidCheck,
    photoId,
    ein,
}: AgentApplicationSubmissionEmailProps) => {
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
            <Preview>New Agent Application from {fullName} - {companyName}</Preview>
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
                        <Heading style={h1}>New Agent Application</Heading>
                        <Text style={headerSubtext}>
                            A new agent application has been submitted through the website
                        </Text>
                    </Section>

                    {/* Main Content */}
                    <Section style={box}>
                        <Section style={cardBody}>
                            {/* Submission Details */}
                            <Section style={detailsCard}>
                                <Text style={sectionTitle}>Application Details</Text>

                                <div style={detailRow}>
                                    <Text style={detailLabel}>Application ID:</Text>
                                    <Text style={detailValue}>
                                        {submissionId || `AA-${Date.now()}`}
                                    </Text>
                                </div>

                                <div style={detailRow}>
                                    <Text style={detailLabel}>Submitted:</Text>
                                    <Text style={detailValue}>{submissionDate}</Text>
                                </div>

                                <div style={detailRow}>
                                    <Text style={detailLabel}>Source:</Text>
                                    <Text style={detailValue}>Website Agent Application Form</Text>
                                </div>
                            </Section>

                            {/* Applicant Information */}
                            <Section style={applicantCard}>
                                <Text style={sectionTitle}>Applicant Information</Text>

                                <div style={infoGrid}>
                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Full Name</Text>
                                        <Text style={infoValue}>{fullName}</Text>
                                    </div>

                                    <div style={infoItem}>
                                        <Text style={infoLabel}>Company Name</Text>
                                        <Text style={infoValue}>{companyName}</Text>
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
                                </div>
                            </Section>

                            {/* Required Documents */}
                            <Section style={documentsCard}>
                                <Text style={sectionTitle}>Required Documents</Text>

                                <div style={documentList}>
                                    <div style={documentItem}>
                                        <div style={documentIcon}>📄</div>
                                        <div style={documentInfo}>
                                            <Text style={documentName}>Void Check</Text>
                                            <Text style={documentStatus}>
                                                {voidCheck && voidCheck.length > 0 ? 'Submitted' : 'Required'}
                                            </Text>
                                        </div>
                                    </div>

                                    <div style={documentItem}>
                                        <div style={documentIcon}>🆔</div>
                                        <div style={documentInfo}>
                                            <Text style={documentName}>Photo ID</Text>
                                            <Text style={documentStatus}>
                                                {photoId && photoId.length > 0 ? 'Submitted' : 'Required'}
                                            </Text>
                                        </div>
                                    </div>

                                    <div style={documentItem}>
                                        <div style={documentIcon}>🏢</div>
                                        <div style={documentInfo}>
                                            <Text style={documentName}>EIN (Tax ID)</Text>
                                            <Text style={documentStatus}>
                                                {ein && ein.length > 0 ? 'Submitted' : 'Required'}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            {/* Uploaded Files */}
                            {(voidCheck && voidCheck.length > 0) || (photoId && photoId.length > 0) || (ein && ein.length > 0) ? (
                                <Section style={filesCard}>
                                    <Text style={sectionTitle}>Uploaded Files</Text>
                                    <div style={fileList}>
                                        {voidCheck && voidCheck.map((fileName, index) => (
                                            <div key={`void-${index}`} style={fileItem}>
                                                <div style={fileIcon}>📄</div>
                                                <div style={fileInfo}>
                                                    <Text style={fileNameStyle}>{fileName}</Text>
                                                    <Text style={fileStatus}>Void Check - Attached to email</Text>
                                                </div>
                                            </div>
                                        ))}
                                        {photoId && photoId.map((fileName, index) => (
                                            <div key={`photo-${index}`} style={fileItem}>
                                                <div style={fileIcon}>🆔</div>
                                                <div style={fileInfo}>
                                                    <Text style={fileNameStyle}>{fileName}</Text>
                                                    <Text style={fileStatus}>Photo ID - Attached to email</Text>
                                                </div>
                                            </div>
                                        ))}
                                        {ein && ein.map((fileName, index) => (
                                            <div key={`ein-${index}`} style={fileItem}>
                                                <div style={fileIcon}>🏢</div>
                                                <div style={fileInfo}>
                                                    <Text style={fileNameStyle}>{fileName}</Text>
                                                    <Text style={fileStatus}>EIN - Attached to email</Text>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            ) : null}

                            {/* Quick Actions */}
                            <Section style={actionsCard}>
                                <Text style={sectionTitle}>Quick Actions</Text>

                                <div style={buttonContainer}>
                                    <Button style={primaryButton} href={`mailto:${email}?subject=Re: Your Agent Application - ${companyName}`}>
                                        Reply via Email
                                    </Button>
                                    <Button style={secondaryButton} href={`tel:${fullPhone}`}>
                                        Call Applicant
                                    </Button>
                                </div>

                                <div style={buttonContainer}>
                                    <Button style={tertiaryButton} href="https://mtechdistributor.com/admin">
                                        View Admin Panel
                                    </Button>
                                </div>
                            </Section>

                            {/* Review Process */}
                            <Section style={reviewCard}>
                                <Text style={sectionTitle}>Review Process</Text>

                                <div style={processSteps}>
                                    <div style={stepItem}>
                                        <div style={stepNumber}>1</div>
                                        <div style={stepContent}>
                                            <Text style={stepTitle}>Initial Review</Text>
                                            <Text style={stepDescription}>
                                                Review application completeness and document verification
                                            </Text>
                                        </div>
                                    </div>

                                    <div style={stepItem}>
                                        <div style={stepNumber}>2</div>
                                        <div style={stepContent}>
                                            <Text style={stepTitle}>Background Check</Text>
                                            <Text style={stepDescription}>
                                                Verify business credentials and financial standing
                                            </Text>
                                        </div>
                                    </div>

                                    <div style={stepItem}>
                                        <div style={stepNumber}>3</div>
                                        <div style={stepContent}>
                                            <Text style={stepTitle}>Final Decision</Text>
                                            <Text style={stepDescription}>
                                                Approve or decline application with detailed feedback
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            {/* Priority Indicators */}
                            <Section style={priorityCard}>
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
                                        <strong>Follow-up Required:</strong> Yes - Applicant expects response
                                    </Text>
                                </div>

                                <div style={priorityItem}>
                                    <div style={priorityIndicator}></div>
                                    <Text style={priorityText}>
                                        <strong>Priority Level:</strong> High - New business opportunity
                                    </Text>
                                </div>
                            </Section>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            This agent application was automatically generated by the MTech Distributors website.
                        </Text>
                        <Text style={footerText}>
                            Please review this application promptly to maintain our high service standards and capture new business opportunities.
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

const applicantCard = {
    backgroundColor: '#f3e8ff',
    border: '1px solid #d8b4fe',
    borderRadius: '8px',
    padding: '24px',
    margin: '20px 0',
};

const documentsCard = {
    backgroundColor: '#fefcff',
    border: '1px solid #f3e8ff',
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

const reviewCard = {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
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

const documentList = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
};

const documentItem = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
};

const documentIcon = {
    fontSize: '24px',
    marginRight: '12px',
};

const documentInfo = {
    flex: '1',
};

const documentName = {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
};

const documentStatus = {
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

const processSteps = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
};

const stepItem = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
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

const filesCard = {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '24px',
    margin: '20px 0',
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

export default AgentApplicationSubmissionEmail;
