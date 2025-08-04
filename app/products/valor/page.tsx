import ProductGridLayout from "@/components/ProductGridLayout";
import ProductHeroSection from "@/components/ProductHeroSection";
import PricingSection from "@/components/products/PricingSection";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";


async function page() {
  const Valor = await client.fetch(
    `*[_type == "POS_SYSTEM_TYPES" && POS_System_Link == "/valor"]`
  );
  console.log(Valor);
  return (
    <>
      <ProductHeroSection
        title={Valor[0]?.POS_System_Header}
        description={Valor[0]?.POS_System_Description}
        image={Valor[0]?.POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="Valor"
        totalInitialProducts={Valor[0]?.POS_System_Items?.length || 0}
        initialProducts={Valor[0]?.POS_System_Items as Product[] || []}
      />
      <PricingSection pricingPlans={Valor[0]?.POS_System_Pricing_Plans} header={Valor[0]?.POS_System_Pricing_Header} description={Valor[0]?.POS_System_Pricing_Description} />
    </>
  );
}

export default page;
