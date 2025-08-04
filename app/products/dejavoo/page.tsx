import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import ProductHeroSection from "@/components/ProductHeroSection";
import PricingSection from "@/components/products/PricingSection";


async function page() {
  const Dejavoo = await client.fetch(
    `*[_type == "POS_SYSTEM_TYPES" && POS_System_Link == "/dejavoo"]`
  );
  return (
    <>
      <ProductHeroSection
        title={Dejavoo[0].POS_System_Header}
        description={Dejavoo[0].POS_System_Description}
        image={Dejavoo[0].POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="Dejavoo"
        totalInitialProducts={Dejavoo[0].POS_System_Items?.length || 0}
        initialProducts={Dejavoo[0].POS_System_Items as Product[]}
      />
      <PricingSection pricingPlans={Dejavoo[0].POS_System_Pricing_Plans} header={Dejavoo[0].POS_System_Pricing_Header} description={Dejavoo[0].POS_System_Pricing_Description} />
    </>
  );
}

export default page;
