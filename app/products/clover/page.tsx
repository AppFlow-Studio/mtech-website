import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import RatesComparison from "@/components/products/RatesComparison";
import { Product } from "@/lib/types";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import SanityImage from "@/components/SanityImage";
import { PortableText } from "@portabletext/react";
import PricingSection from "@/components/products/PricingSection";
import ProductHeroSection from "@/components/ProductHeroSection";


async function page() {
  const Clover = await client.fetch(
    `*[_type == "POS_SYSTEM_TYPES" && POS_System_Link == "/clover"]`
  );
  return (
    <>
      <ProductHeroSection
        title={Clover[0].POS_System_Header}
        description={Clover[0].POS_System_Description}
        image={Clover[0].POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="Clover"
        totalInitialProducts={Clover[0].POS_System_Items?.length || 0}
        initialProducts={Clover[0].POS_System_Items as Product[]}
      />
      <PricingSection pricingPlans={Clover[0].POS_System_Pricing_Plans} header={Clover[0].POS_System_Pricing_Header} description={Clover[0].POS_System_Pricing_Description} />
    </>
  );
}

export default page;
