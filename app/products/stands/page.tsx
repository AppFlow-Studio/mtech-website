import ProductHeroSection from "@/components/ProductHeroSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import Image from "next/image";


async function page() {
  const standsProducts = await client.fetch(
    `*[_type == "PRODUCTS_PAGES" && POS_System_Link == "/stands"]`
  );
  return (
    <>
      <ProductHeroSection
        title={standsProducts[0]?.POS_System_Header}
        description={standsProducts[0]?.POS_System_Description}
        image={standsProducts[0]?.POS_System_Image}
        ctaText="Buy Our Products"
      />

      <ProductGridLayout
        title="Stands"
        totalInitialProducts={standsProducts[0]?.POS_System_Items?.length || 0}
        initialProducts={standsProducts[0]?.POS_System_Items as Product[] || []}
      />
    </>
  );
}

export default page;
