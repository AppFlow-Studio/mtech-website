import ProductGridLayout from "@/components/ProductGridLayout";
import ProductHeroSection from "@/components/ProductHeroSection";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";


async function page() {
  const genmegaAtmProducts = await client.fetch(
    `*[_type == "PRODUCTS_PAGES" && POS_System_Link == "/genmega-atm"]`
  );
  return (
    <>
      <ProductHeroSection
        title={genmegaAtmProducts[0]?.POS_System_Header}
        description={genmegaAtmProducts[0]?.POS_System_Description}
        image={genmegaAtmProducts[0]?.POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="Genmega ATM"
        totalInitialProducts={genmegaAtmProducts[0]?.POS_System_Items?.length || 0}
        initialProducts={genmegaAtmProducts[0]?.POS_System_Items as Product[] || []}
      />
    </>
  );
}

export default page;
