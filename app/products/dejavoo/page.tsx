import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import ProductHeroSection from "@/components/ProductHeroSection";
import PricingSection from "@/components/products/PricingSection";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const options = { next: { revalidate: 30 } };


async function page() {
  const Dejavoo = await sanityFetch({
    query: defineQuery(`*[_type == "POS_SYSTEM_TYPES" && POS_System_Link == "/dejavoo"]`),
    ...options,
  });
  return (
    <>
      <ProductHeroSection
        title={Dejavoo.data[0].POS_System_Header}
        description={Dejavoo.data[0].POS_System_Description}
        image={Dejavoo.data[0].POS_System_Image}
        ctaText="Buy Our Product  s"
      />
      <ProductGridLayout
        title="Dejavoo"
        totalInitialProducts={Dejavoo.data[0].POS_System_Items?.length || 0}
        initialProducts={Dejavoo.data[0].POS_System_Items as Product[]}
      />
      <PricingSection pricingPlans={Dejavoo.data[0].POS_System_Pricing_Plans} header={Dejavoo.data[0].POS_System_Pricing_Header} description={Dejavoo.data[0].POS_System_Pricing_Description} />
    </>
  );
}

export default page;
