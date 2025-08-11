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

interface OrderShipmentConfirmationEmailProps {
    order_id: string;
    orderNumber: string;
    trackingNumber: string;
    shippingService: string;
    items: Array<{
        name: string;
        quantity: number;
        imageUrl?: string;
    }>;
    additionalFees: number
    customerEmail?: string;
}

export const OrderShipmentConfirmationEmail = ({
    order_id = "1079",
    orderNumber = "1079",
    trackingNumber = "1ZA63C580307362570",
    shippingService = "UPS®",
    items = [
        {
            name: "HYOSUNG NEW REVISION MAIN BOARD",
            quantity: 3,
            imageUrl: "/products/hyosung-main-board.png"
        }
    ],
    additionalFees = 0,
    customerEmail = "support@mtechdistributors.com"
}: OrderShipmentConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your order ({orderNumber}) is on the way</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Row>
                            <Column style={logoColumn}>
                                <Img
                                    src="https://mtechdistributor.com/MtechDistributorsLogo.png"
                                    width="100%"
                                    height="120"
                                    alt="MTech"
                                    style={logo}
                                />
                            </Column>
                            <Column style={orderNumberColumn}>
                                <Text style={orderNumberText}>ORDER ID: {orderNumber}</Text>
                            </Column>
                        </Row>
                    </Section>

                    {/* Main Message */}
                    <Section style={mainMessage}>
                        <Heading style={mainHeading}>Your order is on the way</Heading>
                        <Text style={subText}>
                            Your order is on the way. Track your shipment to see the delivery status.
                        </Text>
                    </Section>

                    {/* Action Links */}
                    <Section style={actionSection}>
                        <Link href={`https://mtechdistributor.com/agent/order/${order_id}`} style={viewOrderLink}>View your order</Link>
                        <Text style={orText}> or </Text>
                        <Link href="https://mtechdistributor.com" style={storeLink}>Visit our store</Link>
                    </Section>

                    {/* Tracking Information */}
                    <Section style={trackingSection}>
                        <Text style={trackingLabel}>
                            {shippingService} tracking number:
                        </Text>
                        <Link href={`https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`} style={{
                            color: '#8B5CF6',
                            textDecoration: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                        }}>
                            {trackingNumber}
                        </Link>
                    </Section>

                    {/* Items in Shipment */}
                    <Section style={itemsSection}>
                        <Heading style={itemsHeading}>Items in this shipment</Heading>
                        {items.map((item, index) => (
                            <Row key={index} style={itemRow}>
                                <Column style={itemImageColumn}>
                                    {item.imageUrl && (
                                        <Img
                                            src={item.imageUrl && item.imageUrl[0] == "/" ? `https://mtechdistributor.com${item.imageUrl}` : item.imageUrl}
                                            width="60"
                                            height="60"
                                            alt={item.name}
                                            style={itemImage}
                                        />
                                    )}
                                </Column>
                                <Column style={itemDetailsColumn}>
                                    <Text style={itemName}>{item.name}</Text>
                                    <Text style={itemQuantity}>× {item.quantity}</Text>
                                </Column>
                            </Row>
                        ))}
                    </Section>

                    {/* Additional Fees */}
                    <Section style={feesSection}>
                        <Heading style={feesHeading}>Additional ShippingFees</Heading>
                        <Row style={feeRow}>
                            <Column style={feeNameColumn}>
                                <Text style={feeName}>Shipping Fee</Text>
                            </Column>
                            <Column style={feeAmountColumn}>
                                <Text style={feeAmount}>${additionalFees.toFixed(2)}</Text>
                            </Column>
                        </Row>
                    </Section>


                    {/* Footer */}
                    <Hr style={footerDivider} />
                    <Section style={footer}>
                        <Text style={footerText}>
                            If you have any questions, reply to this email or contact us at{' '}
                            <Link href={`mailto:${customerEmail}`} style={footerEmail}>
                                {customerEmail}
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
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
    margin: 0,
    padding: 0,
};

const container = {
    margin: '0 auto',
    padding: '20px 0',
    maxWidth: '600px',
};

const header = {
    marginBottom: '30px',
};

const logoColumn = {
    width: '70%',
    verticalAlign: 'top' as const,
};

const orderNumberColumn = {
    width: '30%',
    verticalAlign: 'top' as const,
    textAlign: 'right' as const,
};

const logo = {
    display: 'inline-block',
    verticalAlign: 'middle' as const,
    marginRight: '10px',
};

const companyName = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000000',
    margin: 0,
    display: 'inline-block',
    verticalAlign: 'middle',
};

const companyNamePurple = {
    color: '#8B5CF6',
};

const orderNumberText = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#000000',
    margin: 0,
};

const mainMessage = {
    marginBottom: '30px',
    textAlign: 'center' as const,
};

const mainHeading = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#000000',
    margin: '0 0 10px 0',
};

const subText = {
    fontSize: '16px',
    color: '#000000',
    margin: 0,
    lineHeight: '1.5',
};

const actionSection = {
    marginBottom: '30px',
    textAlign: 'center' as const,
};

const viewOrderLink = {
    color: '#6B7280',
    textDecoration: 'none',
    fontSize: '16px',
};

const orText = {
    color: '#000000',
    fontSize: '16px',
    margin: '0 10px',
    display: 'inline-block',
};

const storeLink = {
    color: '#8B5CF6',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
};

const trackingSection = {
    marginBottom: '30px',
    textAlign: 'center' as const,
};

const trackingLabel = {
    fontSize: '16px',
    color: '#000000',
    margin: '0 0 5px 0',
};

const trackingNumber = {
    fontSize: '16px',
    color: '#8B5CF6',
    textDecoration: 'none',
    fontWeight: 'bold',
};

const itemsSection = {
    marginBottom: '30px',
};

const itemsHeading = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000000',
    margin: '0 0 20px 0',
};

const itemRow = {
    marginBottom: '15px',
};

const itemImageColumn = {
    width: '80px',
    verticalAlign: 'top',
};

const itemDetailsColumn = {
    width: 'calc(100% - 80px)',
    verticalAlign: 'top',
    paddingLeft: '15px',
};

const itemImage = {
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
};

const itemName = {
    fontSize: '16px',
    color: '#000000',
    margin: '0 0 5px 0',
    fontWeight: '500',
};

const itemQuantity = {
    fontSize: '14px',
    color: '#000000',
    margin: 0,
};

const feesSection = {
    marginBottom: '30px',
    backgroundColor: '#F3F4F6',
    border: '2px solid #8B5CF6',
    borderRadius: '12px',
    padding: '20px',
};

const feesHeading = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#8B5CF6',
    margin: '0 0 15px 0',
};

const feeRow = {
    marginBottom: '10px',
};

const feeNameColumn = {
    width: '70%',
    verticalAlign: 'top',
};

const feeAmountColumn = {
    width: '30%',
    verticalAlign: 'top' as const,
    textAlign: 'right' as const,
};

const feeName = {
    fontSize: '14px',
    color: '#000000',
    margin: 0,
};

const feeAmount = {
    fontSize: '14px',
    color: '#000000',
    margin: 0,
    fontWeight: 'bold',
};

const footerDivider = {
    borderColor: '#E5E7EB',
    margin: '30px 0',
};

const footer = {
    textAlign: 'left' as const,
};

const footerText = {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0,
    lineHeight: '1.5',
};

const footerEmail = {
    color: '#8B5CF6',
    textDecoration: 'none',
};