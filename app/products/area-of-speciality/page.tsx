import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import { mockProducts } from "@/lib/mockdata";

interface AreaOfSpecialityProps {
  searchParams: {
    data?: string;
  };
}

export default async function AreaOfSpeciality({
  searchParams,
}: AreaOfSpecialityProps) {
  // Decode and parse the tags from URL
  const decodedData = searchParams.data
    ? JSON.parse(decodeURIComponent(searchParams.data))
    : null;
  const filterTags = decodedData?.tags || [];

  // Filter products based on tags
  const filteredProducts =
    filterTags.length > 0
      ? mockProducts.filter((product) =>
          product.tags?.some((tag) => filterTags.includes(tag))
        )
      : mockProducts;

  return (
    <>
      <ProductGridLayout
        title="Area of Speciality"
        totalInitialProducts={filteredProducts.length}
        initialProducts={filteredProducts}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}
