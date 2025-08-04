import ProductGridLayout from "@/components/ProductGridLayout";
import ProductHeroSection from "@/components/ProductHeroSection";
import PricingSection from "@/components/products/PricingSection";
import { Product } from "@/lib/types";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const options = { next: { revalidate: 30 } };


async function page() {
  const Valor = await sanityFetch({
    query: defineQuery(`*[_type == "POS_SYSTEM_TYPES" && POS_System_Link == "/valor"]`),
    ...options,
  });
  console.log(Valor);
  return (
    <>
      <ProductHeroSection
        title={Valor.data[0]?.POS_System_Header}
        description={Valor.data[0]?.POS_System_Description}
        image={Valor.data[0]?.POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="Valor"
            totalInitialProducts={Valor.data[0]?.POS_System_Items?.length || 0}
        initialProducts={Valor.data[0]?.POS_System_Items as Product[] || []}
      />
      <PricingSection pricingPlans={Valor.data[0]?.POS_System_Pricing_Plans} header={Valor.data[0]?.POS_System_Pricing_Header} description={Valor.data[0]?.POS_System_Pricing_Description} />
    </>
  );
}

export default page;
