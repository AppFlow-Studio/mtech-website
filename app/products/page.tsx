'use client'
import ProductGridLayout from "@/components/ProductGridLayout";
import HardwareSection from "@/components/HardwareSection";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import { mockProducts } from "@/lib/mockdata";
import { useProducts } from "@/components/actions/hooks/useProducts";
const totalProducts = 123;

export default function Products() {
  const { data: products,isLoading } = useProducts()
  console.log(products)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="text-lg font-medium text-gray-700 animate-pulse">
            Loading products...
          </span>
        </div>
      </div>
    );
  }
  return (
    <>
      <ProductGridLayout
        title="Our Products"
        totalProducts={totalProducts}
        products={products || []}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}
