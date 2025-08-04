import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import ProductHeroSection from "@/components/ProductHeroSection";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import SanityImage from "@/components/SanityImage";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const options = { next: { revalidate: 30 } };


async function page() {
  const FigurePos = await sanityFetch({
    query: defineQuery(`*[_type == "POS_SYSTEM_TYPES" && POS_System_Link == "/figure-pos"]`),
    ...options,
  });
  console.log(FigurePos);
  return (
    <>
      <ProductHeroSection
        title={FigurePos.data[0].POS_System_Header}
        description={FigurePos.data[0].POS_System_Description}
        image={FigurePos.data[0].POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="Figure POS"
        totalInitialProducts={FigurePos.data[0]?.POS_System_Items?.length || 0}
        initialProducts={FigurePos.data[0]?.POS_System_Items as Product[]}
      />
      <PricingSection pricingPlans={FigurePos.data[0].POS_System_Pricing_Plans} header={FigurePos.data[0].POS_System_Pricing_Header} description={FigurePos.data[0].POS_System_Pricing_Description} />
    </>
  );
}

export default page;
