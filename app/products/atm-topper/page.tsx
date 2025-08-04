import ProductGridLayout from "@/components/ProductGridLayout";
import ProductHeroSection from "@/components/ProductHeroSection";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import Image from "next/image";


async function page() {
  const atmTopperProducts = await client.fetch(
    `*[_type == "PRODUCTS_PAGES" && POS_System_Link == "/atm-topper"]`
  );
  return (
    <>
      <ProductHeroSection
        title={atmTopperProducts[0]?.POS_System_Header}
        description={atmTopperProducts[0]?.POS_System_Description}
        image={atmTopperProducts[0]?.POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="ATM TOPPER"
        totalInitialProducts={atmTopperProducts[0]?.POS_System_Items?.length || 0}
        initialProducts={atmTopperProducts[0]?.POS_System_Items as Product[] || []}
      />
    </>
  );
}

export default page;
