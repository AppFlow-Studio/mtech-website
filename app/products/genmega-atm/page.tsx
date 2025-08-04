import ProductGridLayout from "@/components/ProductGridLayout";
import ProductHeroSection from "@/components/ProductHeroSection";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const options = { next: { revalidate: 30 } };


async function page() {
  const genmegaAtmProducts = await sanityFetch({
    query: defineQuery(`*[_type == "PRODUCTS_PAGES" && POS_System_Link == "/genmega-atm"]`),
    ...options,
  });
  return (
    <>
      <ProductHeroSection
        title={genmegaAtmProducts.data[0]?.POS_System_Header}
        description={genmegaAtmProducts.data[0]?.POS_System_Description}
        image={genmegaAtmProducts.data[0]?.POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="Genmega ATM"
        totalInitialProducts={genmegaAtmProducts.data[0]?.POS_System_Items?.length || 0}
        initialProducts={genmegaAtmProducts.data[0]?.POS_System_Items as Product[] || []}
      />
    </>
  );
}

export default page;
