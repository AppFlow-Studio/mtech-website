import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import DualPricingHero from "../components/DualPricingHero";
import { client } from "@/sanity/lib/client";

// --- Data for the feature list ---
const difference = [
  "BBB A+ Rating",
  "Next Day Funding",
  "Preferred American Express Pricing",
  "24/7 In-House Customer Service",
  "High-Risk Processing Options",
];

const productAndServices = [
  "Credit Card Terminals",
  "Credit Card Processing",
  "Point of Sale Systems",
  "ATM Machines",
  "Sell & Buy ATM Routes",
  "ATM Solution for Distributors",
  "ATMs for Large Businesses",
  "ATMs for Small and Midsize Businesses",
  "ATM Placement Programs",
  "ATM Cash Management",
  "Mobile & Wireless",
];

async function MerchantServices() {
  const merchantServices = await client.fetch(
    `*[_type == "DualPricing" && DualPricing_Link == "/merchant-services"]`
  );
  return (
    <>
      <DualPricingHero
        title="Merchant Services"
        description={merchantServices[0]?.DualPricing_Description}
        image={merchantServices[0]?.DualPricing_Image}
        useSanityImage={true}
        usePortableText={true}
        badge={merchantServices[0]?.DualPricing_Badge}
        rightFeatures={merchantServices[0]?.DualPricing_Second_Section_Description}
      />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default MerchantServices;
