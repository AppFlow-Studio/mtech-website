"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import { client } from "@/sanity/lib/client";
import DualPricingHero from "../components/DualPricingHero";


async function AtmForLargeBusiness() {
  const largeBusiness = await client.fetch(
    `*[_type == "DualPricing" && DualPricing_Link == "/large-business"]`
  );
  return (
    <>
     <DualPricingHero
        title="Large Business"
        description={largeBusiness[0]?.DualPricing_Description}
        image={largeBusiness[0]?.DualPricing_Image}
        useSanityImage={true}
        usePortableText={true}
        badge={largeBusiness[0]?.DualPricing_Badge}
        rightFeatures={largeBusiness[0]?.DualPricing_Second_Section_Description}
      />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default AtmForLargeBusiness;
