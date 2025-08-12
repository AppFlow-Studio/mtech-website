import ProductGridLayout from "@/components/ProductGridLayout";
import HardwareSection from "@/components/HardwareSection";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";


export default function Products() {
  
  return (
    <>
      <ProductGridLayout
        title="Our Products"
        // totalProducts={totalProducts}
        // products={products || []}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}
