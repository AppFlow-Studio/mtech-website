'use client'
import {
    CreditCard,
    CreditCardBack,
    CreditCardChip,
    CreditCardCvv,
    CreditCardExpiry,
    CreditCardFlipper,
    CreditCardFront,
    CreditCardLogo,
    CreditCardMagStripe,
    CreditCardName,
    CreditCardNumber,
    CreditCardServiceProvider,
} from "@/components/ui/kibo-ui/credit-card";
import { CardPaymentInfo } from "@/lib/hooks/useProfile";

export default function CreditCardShower({ card }: { card: CardPaymentInfo }) {
    return (
        <CreditCard>
            <CreditCardFlipper>
                <CreditCardFront className="bg-[#063573]">
                    {/* <ChaseLogo className="absolute top-0 left-0 h-1/12" />
                    <CreditCardLogo>
                        <ChaseMark className="text-[#0e72d1]" />
                    </CreditCardLogo> */}
                    <CreditCardChip />
                    <CreditCardServiceProvider
                        className="brightness-0 invert"
                        format="logo"
                        type={card?.label ? card.label.toLowerCase().charAt(0).toUpperCase() + card.label.toLowerCase().slice(1) : undefined}
                    />
                    <CreditCardName className="absolute bottom-0 left-0">
                        {card?.label}
                    </CreditCardName>
                </CreditCardFront>
                <CreditCardBack className="bg-[#063573]">
                    <CreditCardMagStripe />
                    <CreditCardNumber className="absolute bottom-0 left-0">
                        {card?.masked_pan.slice(0, 6) + '*********'  + card?.masked_pan.slice(4, 8)}
                    </CreditCardNumber>
                    <div className="-translate-y-1/2 absolute top-1/2 flex gap-4">
                        {/* <CreditCardExpiry>{card?.expiry_date}</CreditCardExpiry>
                        <CreditCardCvv>123</CreditCardCvv> */}
                    </div>
                </CreditCardBack>
            </CreditCardFlipper>
        </CreditCard>
    )
}