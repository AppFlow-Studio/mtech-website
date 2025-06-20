import ProductGridLayout from "@/components/ProductGridLayout";
import HardwareSection from "@/components/HardwareSection";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import type { Product } from "@/lib/types";

const wirelessProducts: Product[] = [
  {
    name: "1K HYOSUNG CASSETTE NEEDS REPAIR",
    description: "1K HYOSUNG CASSETTE NEEDS TO BE REPAIRED, SOLD AS IS...",
    imageSrc: "/products/product-10.png",
    link: "#",
    inStock: true,
  },
  {
    name: "2K HYOSUNG CASSETTE NEEDS REPAIR",
    description: "2K HYOSUNG CASSETTE NEEDS TO BE REPAIRED, SOLD AS IS...",
    imageSrc: "/products/product-11.png",
    link: "#",
    inStock: true,
  },
  {
    name: "A SERIES 6128 ELECTRONIC LOCK",
    description:
      "THE SERIES 6128 ELECTRONIC LOCK IS A HIGH-SECURITY, USER-FRIENDLY SOLU...",
    imageSrc: "/products/product-12.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ANTENNA FOR WIRELESS UNITS",
    description:
      "THE ANTENNA FOR WIRELESS UNITS IS DESIGNED TO ENHANCE SIGNAL STRE...",
    imageSrc: "/products/product-13.png",
    link: "#",
    inStock: true,
  },
];

const totalProducts = 4;

export default function Products() {
  return (
    <>
      <ProductGridLayout
        title="Our Products"
        totalProducts={totalProducts}
        products={wirelessProducts}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}
