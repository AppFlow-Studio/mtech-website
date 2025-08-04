import ProductGridLayout from "@/components/ProductGridLayout";
import ProductHeroSection from "@/components/ProductHeroSection";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";

async function page() {
  const hyosungAtmProducts = await client.fetch(
    `*[_type == "PRODUCTS_PAGES" && POS_System_Link == "/hysoung"]`
  );
  return (
    <>
      <ProductHeroSection
        title={hyosungAtmProducts[0]?.POS_System_Header}
        description={hyosungAtmProducts[0]?.POS_System_Description}
        image={hyosungAtmProducts[0]?.POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="HYOSUNG"
        totalInitialProducts={hyosungAtmProducts[0]?.POS_System_Items?.length || 0}
        initialProducts={hyosungAtmProducts[0]?.POS_System_Items as Product[] || []}
      />
    </>
  );
}

export default page;
