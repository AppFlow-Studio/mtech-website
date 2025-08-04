"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import { client } from "@/sanity/lib/client";
import DualPricingHero from "../components/DualPricingHero";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const options = { next: { revalidate: 30 } };


async function AtmForLargeBusiness() {
  const largeBusiness = await sanityFetch({
    query: defineQuery(`*[_type == "DualPricing" && DualPricing_Link == "/large-business"]`),
    ...options,
  });
  return (
    <>
      <DualPricingHero
        title="Large Business"
        description={largeBusiness.data[0]?.DualPricing_Description}
        image={largeBusiness.data[0]?.DualPricing_Image}
        useSanityImage={true}
        usePortableText={true}
        badge={largeBusiness.data[0]?.DualPricing_Badge}
        rightFeatures={largeBusiness.data[0]?.DualPricing_Second_Section_Description}
      />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default AtmForLargeBusiness;
