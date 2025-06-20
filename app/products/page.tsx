import ProductGridLayout from "@/components/ProductGridLayout";
import HardwareSection from "@/components/HardwareSection";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import type { Product } from "@/lib/types";

const mockProducts: Product[] = [
  {
    name: "1K HYOSUNG CASSETTE NEEDS...",
    description: "1K HYOSUNG CASSETTE NEEDS TO BE REPAIRED, SOLD AS IS...",
    imageSrc: "/products/product-1.png",
    link: "#",
    inStock: true,
  },
  {
    name: "2K HYOSUNG CASSETTE NEEDS...",
    description: "2K HYOSUNG CASSETTE NEEDS TO BE REPAIRED, SOLD AS IS...",
    imageSrc: "/products/product-2.png",
    link: "#",
    inStock: true,
  },
  {
    name: "A SERIES 6128 ELECTRONIC LO...",
    description:
      "THE SERIES 6128 ELECTRONIC LOCK IS A HIGH-SECURITY, USER-FRIENDLY SOLU...",
    imageSrc: "/products/product-3.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ANTENNA FOR WIRELESS UNITS",
    description:
      "THE ANTENNA FOR WIRELESS UNITS IS DESIGNED TO ENHANCE SIGNAL STRE...",
    imageSrc: "/products/product-4.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ATM LED SIGN",
    description:
      "AN LED SIGN THAT ENSURES YOUR CUSTOMER WILL FIND YOUR MACHINE...",
    imageSrc: "/products/product-5.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ATM RECEIPT PAPER (8 Rolls)",
    description: "8 ROLL CASE OF HYOSUNG RECEIPT PAPER",
    imageSrc: "/products/product-6.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ATM AVAILABLE INSIDE SIGN",
    description: "ATM AVAILABLE INSIDE COROPLAST SIGN",
    imageSrc: "/products/product-7.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ATM SIGN",
    description:
      "ATM $10 BILLS COROPLAST SIGN. THE ATM SIGN IS DESIGNED TO CLEARLY IN...",
    imageSrc: "/products/product-8.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ATM Sign",
    description:
      "ATM $10 & $20 BILLS COROPLAST SIGN. SUITABLE FOR INDOOR OR OUTDOOR U...",
    imageSrc: "/products/product-9.png",
    link: "#",
    inStock: true,
  },
];

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
