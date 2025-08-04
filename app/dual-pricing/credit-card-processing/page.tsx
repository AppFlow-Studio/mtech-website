import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import { client } from "@/sanity/lib/client";
import DualPricingHero from "../components/DualPricingHero";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const options = { next: { revalidate: 30 } };

async function CreditCardProcessing() {
  const creditCardProcessing = await sanityFetch({
    query: defineQuery(`*[_type == "DualPricing" && DualPricing_Link == "/credit-card-processing"]`),
    ...options,
  });
  return (
    <>
      <DualPricingHero
        title="Credit Card Processing"
        description={creditCardProcessing.data[0]?.DualPricing_Description}
        image={creditCardProcessing.data[0]?.DualPricing_Image}
        useSanityImage={true}
        usePortableText={true}
        badge={creditCardProcessing.data[0]?.DualPricing_Badge}
        rightFeatures={creditCardProcessing.data[0]?.DualPricing_Second_Section_Description}
      />
      <DualPricingKit
        title="Credit Card Processing"
        description="Credit Card Processing is a complete setup designed to help merchants offer both cash and card pricing at the point of sale"
      />
      <Contact />
    </>
  );
};

export default CreditCardProcessing;
