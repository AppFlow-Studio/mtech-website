import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import ProductHeroSection from "@/components/ProductHeroSection";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";

async function page() {
  const OnTheFlyPos = await client.fetch(
    `*[_type == "POS_SYSTEM_TYPES" && POS_System_Link == "/on-the-fly-pos"]`
  );
  console.log(OnTheFlyPos);
  return (
    <>
      <ProductHeroSection
        title={OnTheFlyPos[0]?.POS_System_Header}
        description={OnTheFlyPos[0]?.POS_System_Description}
        image={OnTheFlyPos[0]?.POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="On the Fly POS"
        totalInitialProducts={OnTheFlyPos[0]?.POS_System_Items?.length || 0}
        initialProducts={OnTheFlyPos[0]?.POS_System_Items as Product[] || []}
      />
      <PricingSection pricingPlans={OnTheFlyPos[0]?.POS_System_Pricing_Plans} header={OnTheFlyPos[0]?.POS_System_Pricing_Header} description={OnTheFlyPos[0]?.POS_System_Pricing_Description} />
    </>
  );
}

export default page;
