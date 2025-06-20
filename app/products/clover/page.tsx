import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import { Product } from "@/lib/types";
import Image from "next/image";

const cloverProducts: Product[] = [
  {
    name: "Clover Go Reader and Dock Bundle",
    description:
      "Pair this portable credit card reader with your phone to take payments wherever yo...",
    imageSrc: "/products/product-30.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Clover Station DUO",
    description:
      "The Clover Station Duo is a powerful, dual-screen point-of-sale system designed for...",
    imageSrc: "/products/product-31.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Clover Station DUO WIFI Bundle...",
    description:
      "The Clover Station Duo WIFI Bundle – No Cash Drawer offers a complete, modern P...",
    imageSrc: "/products/product-32.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Clover Station Solo",
    description:
      "The Clover Station Solo is a powerful all-in-one POS system designed for businesses...",
    imageSrc: "/products/product-33.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Clover Station Solo Bundle- No...",
    description:
      "The Clover Station Solo Bundle – No Cash Drawer is a sleek, all-in-one POS solution...",
    imageSrc: "/products/product-34.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Clover Mini",
    description:
      "The Clover Mini is a compact, powerful POS device that offers full functionality in...",
    imageSrc: "/products/product-35.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Clover Flex WiFi",
    description:
      "The Clover Flex WiFi is a portable, all-in-one POS device designed for mobility and con...",
    imageSrc: "/products/product-36.png",
    link: "#",
    inStock: true,
  },
];

function page() {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Column 1: Text Content */}
            <div className="text-center lg:text-left">
              <h1
                className="
                text-3xl md:text-4xl font-medium leading-tight
                text-gray-900 dark:text-white
              "
              >
                Clover
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                Clover is a powerful, all-in-one point-of-sale (POS) solution
                designed to help businesses manage payments, operations, and
                customer engagement with ease. From sleek hardware options to
                customizable software, Clover offers flexibility for retail,
                restaurants, and service-based businesses.
              </p>
              <div className="mt-8">
                <button
                  className="
                  inline-flex items-center justify-center 
                  px-4 py-2 rounded-full font-semibold text-white
                  bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600
                  hover:opacity-90 transition-opacity duration-300 shadow-lg
                "
                >
                  Buy Our Products
                </button>
              </div>
            </div>
            <div>
              <Image
                src="/clover-collage.png"
                alt="A collage of modern payment processing images"
                width={800} // Defines the aspect ratio
                height={550} // Defines the aspect ratio
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      <ProductGridLayout
        title="Clover"
        totalProducts={cloverProducts.length}
        products={cloverProducts}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}

export default page;
