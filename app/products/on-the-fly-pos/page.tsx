import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import { Product } from "@/lib/types";

const onTheFlyPosProducts: Product[] = [
  {
    name: "On The Fly POS",
    description:
      "Best for Bar, Coffee Shop, Quick service, Pizzeria, Restaurant",
    imageSrc: "/products/product-29.png",
    link: "#",
    inStock: true,
  },
];

function page() {
  return (
    <>
      <ProductGridLayout
        title="On the Fly POS"
        totalProducts={onTheFlyPosProducts.length}
        products={onTheFlyPosProducts}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}

export default page;
