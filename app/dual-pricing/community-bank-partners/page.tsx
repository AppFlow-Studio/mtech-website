import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import DualPricingHero from "../components/DualPricingHero";
import { client } from "@/sanity/lib/client";

// --- Data for the feature list ---
const feature = [
  "Non-interest income.",
  "Increase deposits with our next – day funding",
  "Protect and leverage your brand through co-branded materials.",
  "Create more loyalty – stop the Nationals from soliciting your customers.",
  "Increase customer retention through a comprehensive suite of solutions – make your customer “sticky”.",
  "Add clients with our special program.",
];

const benefits = [
  "A-to-Z Sales support.",
  "Complete support, including marketing, for bank branches and branch managers.",
  "Quarterly payments with online reporting access.",
  "NEW! Customized online referral system & tracking",
  "24/7 Toll-Free Customer Service.",
  "Flexible equipment payments and training for client.",
  "Automatic deposit options within one business day – including American Express.",
  "Easy-to-Read Merchant Statements – paper or online.",
  "Support for all major credit cards.",
];

async function communityBankPartners() {
  const communityBankPartners = await client.fetch(
    `*[_type == "DualPricing" && DualPricing_Link == "/community-bank-partners"]`
  );
  return (
    <>
      <DualPricingHero
        title="Partnering with Community Banks"
        description={communityBankPartners[0]?.DualPricing_Description}
        image={communityBankPartners[0]?.DualPricing_Image}
        useSanityImage={true}
        usePortableText={true}
        badge={communityBankPartners[0]?.DualPricing_Badge}
        rightFeatures={communityBankPartners[0]?.DualPricing_Second_Section_Description}
      />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default communityBankPartners;
