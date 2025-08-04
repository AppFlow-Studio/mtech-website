"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import { client } from "@/sanity/lib/client";
import DualPricingHero from "../components/DualPricingHero";

// --- Data for the feature list ---
const featureList = [
  "Take advantage of MTech's top-tier hardware purchase rate to get the greatest deal on your ATM equipment.",
  "Reliable service at a reasonable price",
  "Personalized ATM merchandising arrangements",
  "Customized ATM showcasing arrangements.",
  "Collaborates with all major processors and manufacturers.",
  "Increased profit.",
  "Nationwide ATM services.",
];

async function EMVPage() {
  const emv = await client.fetch(
    `*[_type == "DualPricing" && DualPricing_Link == "/emv"]`
  );
  return (
    <>
      <DualPricingHero
        title="EMV"
        description={emv[0]?.DualPricing_Description}
        image={emv[0]?.DualPricing_Image}
        useSanityImage={true}
        usePortableText={true}
        badge={emv[0]?.DualPricing_Badge}
        rightFeatures={emv[0]?.DualPricing_Second_Section_Description}
      />
    
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default EMVPage;
