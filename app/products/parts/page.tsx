import ProductHeroSection from "@/components/ProductHeroSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import Image from "next/image";


async function page() {
  const partsProducts = await client.fetch(
    `*[_type == "PRODUCTS_PAGES" && POS_System_Link == "/parts"]`
  );
  return (
    <>
      <ProductHeroSection
        title={partsProducts[0]?.POS_System_Header}
        description={partsProducts[0]?.POS_System_Description}
        image={partsProducts[0]?.POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="Parts"
        totalInitialProducts={partsProducts[0]?.POS_System_Items?.length || 0}
        initialProducts={partsProducts[0]?.POS_System_Items as Product[] || []}
      />
    </>
  );
}

export default page;
