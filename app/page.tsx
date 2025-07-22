import Hero from "@/components/home/Hero";
import Partners from "@/components/Partners";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturesTabs from "@/components/home/FeaturesTabs";
import GrowthSection from "@/components/home/GrowthSection";
import ModernPaymentsIntro from "@/components/home/ModernPaymentsIntro";
import InsightsSection from "@/components/home/InsightsSection";
import PreferredChoice from "@/components/home/PreferredChoice";
import MerchantPortal from "@/components/home/MerchantPortal";
import Testimonials from "@/components/home/Testimonials";
import Collection from "@/components/home/Collection";
import PosSystems from "@/components/home/PosSystems";
import { FeatureItem } from "@/lib/types";

//Used for Feature tab components
const featureItems: FeatureItem[] = [
  {
    title: "Payment Processing & Management",
    description:
      "Efficiently manage transactions, track payments, and streamline your financial workflows with our secure payment processing solutions.",
    imageSrc: "/features/feature-1-payment.png",
  },
  {
    title: "100% Transparent Costs",
    description:
      "Enjoy clear, upfront pricing with no hidden fees. We believe in honesty and building trust through transparent cost structures.",
    imageSrc: "/features/feature-2-transparent.png",
  },
  {
    title: "Technical Support",
    description:
      "Our expert technical support team is available around the clock to assist you with any issues or questions you may have.",
    imageSrc: "/features/feature-3-techsupport.png",
  },
  {
    title: "Right Equipment & Software",
    description:
      "Get access to the latest, most secure POS terminals and software tailored to your specific business needs.",
    imageSrc: "/features/feature-4-equipment.jpg",
  },
  {
    title: "Full Data Security & Compliance",
    description:
      "Rest easy knowing your data is protected with top-tier security measures and full PCI compliance, safeguarding you and your customers.",
    imageSrc: "/features/feature-5-security.jpg",
  },
  {
    title: "User Friendly & reliable Options",
    description:
      "Choose from a range of reliable, easy-to-use payment options that provide a seamless experience for your customers.",
    imageSrc: "/features/feature-6-user.png",
  },
];

//Used for Feature tab components for payment solutions
const paymentSolutionsFeatures: FeatureItem[] = [
  {
    title: "Diverse Payment Options",
    description:
      "Offer your customers a variety of secure and convenient payment methods, ensuring a seamless transaction experience for everyone.",
    imageSrc: "/features/diverse-payment-options.png",
  },
  {
    title: "Optimized Cost Flow",
    description:
      "Streamline your transaction processes to reduce overhead and improve your bottom line with our efficient cost flow solutions.",
    imageSrc: "/features/optimize-cost-flow.jpg",
  },
  {
    title: "Cost Savings",
    description:
      "Identify and implement significant cost-saving strategies to lower your payment processing fees and operational expenses, maximizing your profits.",
    imageSrc: "/features/cost-savings.png",
  },
  {
    title: "Access Data-Driven Insights",
    description:
      "Leverage powerful analytics and reporting tools to understand customer behavior, track sales trends, and make informed business decisions.",
    imageSrc: "/features/data-driven-insights.png",
  },
  {
    title: "Seamless Growth Potential",
    description:
      "Our scalable solutions are designed to grow with your business, supporting your expansion from a small startup to a large enterprise without friction.",
    imageSrc: "/features/seamless-growth.png",
  },
  {
    title: "Optimized Payment Processing",
    description:
      "Benefit from fast, reliable, and secure payment processing that enhances customer satisfaction and boosts your day-to-day operational efficiency.",
    imageSrc: "/features/optimized-payment.png",
  },
];

//Used for Feature tab components for modern payment
const modernPaymentFeatures: FeatureItem[] = [
  {
    title: "Mobile Payments",
    description:
      "Simplify your payment processing with all the tools you need in one place. We offer cutting-edge payment terminals, POS systems, eCommerce capabilities, and value-added services to create a flexible and customized payment environment.",
    imageSrc: "/features/mobile-payment-pos.png",
  },
  {
    title: "Digital Wallets",
    description:
      "Accept payments from popular digital wallets like Apple Pay, Google Pay, and Samsung Pay, offering your customers speed and convenience.",
    imageSrc: "/features/wallet.png",
  },
  {
    title: "ACH Payments",
    description:
      "Process direct bank-to-bank payments securely and with lower transaction fees, ideal for recurring billing and large ticket items.",
    imageSrc: "/features/ach-payments.png",
  },
  {
    title: "Gift Cards",
    description:
      "Launch and manage your own branded gift card program to boost sales, attract new customers, and encourage repeat business.",
    imageSrc: "/features/giftcard.png",
  },
  {
    title: "NFC Payments",
    description:
      "Enable fast and secure contactless payments through Near Field Communication (NFC) technology for a modern checkout experience.",
    imageSrc: "/nfc-payments.png",
  },
  {
    title: "Dip / Tap / Swipe",
    description:
      "Our terminals support all standard card interactions, including traditional dip (EMV chip) and swipe, alongside modern tap-to-pay.",
    imageSrc: "/features/tap-dip-swipe.png",
  },
];

export default function Home() {
  return (
    <div>
      <Hero />
      <Partners />
      <WhyChooseUs />
      <FeaturesTabs features={featureItems} />
      <GrowthSection />
      <FeaturesTabs features={paymentSolutionsFeatures} />
      <ModernPaymentsIntro />
      <FeaturesTabs features={modernPaymentFeatures} />
      <InsightsSection />
      <PreferredChoice />
      <MerchantPortal />
      <Testimonials />
      <Collection />
      <PosSystems />
    </div>
  );
}
