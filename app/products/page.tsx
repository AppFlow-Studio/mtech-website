import ProductGridLayout from "@/components/ProductGridLayout";
import HardwareSection from "@/components/HardwareSection";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import { mockProducts } from "@/lib/mockdata";
const totalProducts = 123;

export default function Products() {
  return (
    <>
      <ProductGridLayout
        title="Our Products"
        totalProducts={totalProducts}
        products={mockProducts}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}
