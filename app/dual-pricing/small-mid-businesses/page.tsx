"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import { client } from "@/sanity/lib/client";
import DualPricingHero from "../components/DualPricingHero";

// --- Data for the feature list ---
const featureList = [
  "MTech provides guidelines for profit maximization.",
  "MTech's account management is focused on the needs of the customer.",
  "ATMs are monitored around the clock and marketing options are tailored to customer requirements.",
  "North America's first Nautilus Hyosung ATM distributor.",
  "A nationwide network of technicians is available for proactive technical help.",
];

async function AtmForSmallMidBusiness() {
  const smallMidBusiness = await client.fetch(
    `*[_type == "DualPricing" && DualPricing_Link == "/small-mid-businesses"]`
  );
  return (
    <>
      <DualPricingHero
        title="Small and Mid-Sized Businesses"
        description={smallMidBusiness[0]?.DualPricing_Description}
        image={smallMidBusiness[0]?.DualPricing_Image}
        useSanityImage={true}
        usePortableText={true}
        badge={smallMidBusiness[0]?.DualPricing_Badge}
        rightFeatures={smallMidBusiness[0]?.DualPricing_Second_Section_Description}
      />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default AtmForSmallMidBusiness;
