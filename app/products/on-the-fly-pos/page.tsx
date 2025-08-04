import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import ProductHeroSection from "@/components/ProductHeroSection";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const options = { next: { revalidate: 30 } };

async function page() {
  const OnTheFlyPos = await sanityFetch({
    query: defineQuery(`*[_type == "POS_SYSTEM_TYPES" && POS_System_Link == "/on-the-fly-pos"]`),
    ...options,
  });
  console.log(OnTheFlyPos);
  return (
    <>
      <ProductHeroSection
        title={OnTheFlyPos.data[0]?.POS_System_Header}
        description={OnTheFlyPos.data[0]?.POS_System_Description}
        image={OnTheFlyPos.data[0]?.POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="On the Fly POS"
        totalInitialProducts={OnTheFlyPos.data[0]?.POS_System_Items?.length || 0}
        initialProducts={OnTheFlyPos.data[0]?.POS_System_Items as Product[] || []}
      />
      <PricingSection pricingPlans={OnTheFlyPos.data[0]?.POS_System_Pricing_Plans} header={OnTheFlyPos.data[0]?.POS_System_Pricing_Header} description={OnTheFlyPos.data[0]?.POS_System_Pricing_Description} />
    </>
  );
}

export default page;
