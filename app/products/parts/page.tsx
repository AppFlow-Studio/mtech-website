import ProductHeroSection from "@/components/ProductHeroSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const options = { next: { revalidate: 30 } };


async function page() {
  const partsProducts = await sanityFetch({
    query: defineQuery(`*[_type == "PRODUCTS_PAGES" && POS_System_Link == "/parts"]`),
    ...options,
  });
  return (
    <>
      <ProductHeroSection
        title={partsProducts.data[0]?.POS_System_Header}
        description={partsProducts.data[0]?.POS_System_Description}
        image={partsProducts.data[0]?.POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="Parts"
        totalInitialProducts={partsProducts.data[0]?.POS_System_Items?.length || 0}
        initialProducts={partsProducts.data[0]?.POS_System_Items as Product[] || []}
      />
    </> 
  );
}

export default page;
