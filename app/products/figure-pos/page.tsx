import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import ProductHeroSection from "@/components/ProductHeroSection";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import SanityImage from "@/components/SanityImage";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import { PortableText } from "next-sanity";
import Image from "next/image";


async function page() {
  const FigurePos = await client.fetch(
    `*[_type == "POS_SYSTEM_TYPES" && POS_System_Link == "/figure-pos"]`
  );
  console.log(FigurePos);
  return (
    <>
       <ProductHeroSection
        title={FigurePos[0].POS_System_Header}
        description={FigurePos[0].POS_System_Description}
        image={FigurePos[0].POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="Figure POS"
        totalInitialProducts={FigurePos[0].POS_System_Items?.length || 0}
        initialProducts={FigurePos[0].POS_System_Items as Product[]}
      />
      <PricingSection pricingPlans={FigurePos[0].POS_System_Pricing_Plans} header={FigurePos[0].POS_System_Pricing_Header} description={FigurePos[0].POS_System_Pricing_Description} />
    </>
  );
}

export default page;
