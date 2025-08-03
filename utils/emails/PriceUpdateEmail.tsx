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

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

interface PriceUpdateItem {
    id: string | undefined;
    product_name: string;
    product?: {
        id: string;
        name: string;
        description: string;
        default_price: number;
        imageSrc?: string;
    };
    quantity: number;
    quoted_price?: number;
    oldPrice: number;
    newPrice: number;
}

interface PriceUpdateEmailProps {
    customerName?: string;
    order_confirmation_number?: string;
    changedItems?: PriceUpdateItem[] | undefined;
    totalAmount?: number;
}

export const PriceUpdateEmail = ({
    customerName = 'Valued Customer',
    order_confirmation_number = 'N/A',
    changedItems = [],
    totalAmount = 0,
}: PriceUpdateEmailProps) => {

    return (
        <Html>
            <Head />
            <Preview>Price Update for Order #{order_confirmation_number}</Preview>
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

                        <Text style={heading}>📋 Price Update Notification</Text>

                        <Text style={paragraph}>
                            Dear {customerName},
                        </Text>

                        <Text style={paragraph}>
                            We wanted to inform you that there have been price updates to your order.
                            Below are the details of the changes:
                        </Text>

                        <div style={orderInfoBox}>
                            <Text style={orderInfoTitle}>Order Information</Text>
                            <Text style={orderInfoText}>
                                <strong>Order Confirmation Number:</strong> <span style={highlight}>{order_confirmation_number}</span><br />
                                <strong>Items Updated:</strong> <span style={highlight}>{changedItems.length}</span><br />
                                <strong>New Order Total:</strong> <span style={highlight}>${totalAmount.toFixed(2)}</span>
                            </Text>
                        </div>

                        <Text style={sectionTitle}>Updated Items</Text>

                        {changedItems.map((item, index) => {
                            const priceDiff = item.newPrice - item.oldPrice;
                            const priceDiffText = priceDiff > 0 ? `+$${priceDiff.toFixed(2)}` : `-$${Math.abs(priceDiff).toFixed(2)}`;
                            const itemTotal = item.newPrice * item.quantity;

                            return (
                                <div key={item.id} style={itemCard}>
                                    <div style={itemHeader}>
                                        <Text style={itemName}>{item.product?.name || item.product_name} </Text>
                                        <Text style={itemQuantity}>Quantity: {item.quantity}</Text>
                                    </div>

                                    <div style={priceRow}>
                                        <Text style={oldPriceLabel}>Old Price: </Text>
                                        <Text style={oldPrice}>${item.oldPrice.toFixed(2)}</Text>
                                    </div>

                                    <div style={priceRow}>
                                        <Text style={newPriceLabel}>New Price: </Text>
                                        <Text style={newPrice}>${item.newPrice.toFixed(2)}</Text>
                                    </div>

                                    <div style={priceRow}>
                                        <Text style={changeLabel}>Change: </Text>
                                        <Text style={priceChange}>{priceDiffText}</Text>
                                    </div>

                                    <div style={priceRow}>
                                        <Text style={totalLabel}>Item Total: </Text>
                                        <Text style={itemTotalStyle}>${itemTotal.toFixed(2)}</Text>
                                    </div>
                                </div>
                            );
                        })}

                        <div style={totalSection}>
                            <div style={totalRow}>
                                <Text style={totalLabel}>New Order Total: </Text>
                                <Text style={totalAmountStyle}>${totalAmount.toFixed(2)}</Text>
                            </div>
                        </div>

                        <Hr style={hr} />

                        <Text style={paragraph}>
                            If you have any questions about these price changes, please don't hesitate to contact us.
                        </Text>

                        <div style={buttonContainer}>
                            <Button style={button} href={'https://mtechdistributor.com/review-quote'}>
                                View Your Updated Order
                            </Button>
                        </div>

                        <Hr style={hr} />

                        <Text style={footer}>
                            Thank you for choosing MTech Distributors
                        </Text>
                        <Text style={footer}>
                            If you have any questions, please contact us at (347) 659-1866
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
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    width: '100%',
    maxWidth: '800px',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const box = {
    padding: '0 48px',
};

const logo = {
    margin: '0 auto',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const heading = {
    fontSize: '24px',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    fontWeight: '400',
    color: '#484848',
    padding: '17px 0 0',
    textAlign: 'center' as const,
};

const paragraph = {
    margin: '0 0 15px',
    fontSize: '15px',
    lineHeight: '24px',
    color: '#3c4149',
};

const orderInfoBox = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px 0',
};

const orderInfoTitle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 10px 0',
};

const orderInfoText = {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#666',
    margin: '0',
};

const highlight = {
    color: '#667eea',
    fontWeight: '600',
};

const sectionTitle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '25px 0 15px 0',
};

const itemCard = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    backgroundColor: '#ffffff',
};

const itemHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
};

const itemName = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0',
    flex: '1',
};

const itemQuantity = {
    fontSize: '14px',
    color: '#666',
    margin: '0',
    textAlign: 'right' as const,
};

const priceRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    gap: '10px',
};

const oldPriceLabel = {
    fontSize: '14px',
    color: '#666',
    margin: '0',
};

const oldPrice = {
    fontSize: '14px',
    color: '#999',
    textDecoration: 'line-through',
    margin: '0',
};

const newPriceLabel = {
    fontSize: '14px',
    color: '#666',
    margin: '0',
};

const newPrice = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#28a745',
    margin: '0',
};

const changeLabel = {
    fontSize: '14px',
    color: '#666',
    margin: '0',
};

const priceChange = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#28a745',
    margin: '0',
};

const totalLabel = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    margin: '0',
};

const itemTotalStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    margin: '0',
};

const totalSection = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px 0',
};

const totalRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
};

const totalAmountStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#667eea',
    margin: '0',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '30px 0',
};

const button = {
    backgroundColor: '#667eea',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
    textAlign: 'center' as const,
    margin: '5px 0',
};

export default PriceUpdateEmail; 