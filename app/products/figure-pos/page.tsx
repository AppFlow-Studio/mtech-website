import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import { Product } from "@/lib/types";
import Image from "next/image";

const figurePosProducts: Product[] = [
  {
    name: "Figure Pos",
    description:
      "Best for Bar, Coffee Shop, Quick service, Pizzeria, Restaurant",
    imageSrc: "/products/product-23.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Kitchen Display (KDS)",
    description:
      "Our Kitchen Display System (KDS) replaces traditional paper tickets with a digital scre...",
    imageSrc: "/products/product-24.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Star Kitchen Printer SP700",
    description:
      "The Star SP700 is a high-speed, impact kitchen printer built to handle the heat an...",
    imageSrc: "/products/product-25.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Star Printer TSP100 Ethernet",
    description:
      "The Star TSP100 Ethernet is a high-performance thermal receipt printer desi...",
    imageSrc: "/products/product-26.png",
    link: "#",
    inStock: true,
  },
  {
    name: "INGENICO MOBY 5500 CARD READER",
    description:
      "The Ingenico Moby 5500 is a compact, versatile card reader designed for secure...",
    imageSrc: "/products/product-27.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo Z6",
    description:
      "The Dejavoo Z6 is a sleek, countertop payment terminal designed for secure an...",
    imageSrc: "/products/product-28.png",
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
                Figure Pos
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                Figure Pos helps you track and improve your posture with ease.
                Designed for comfort and efficiency, it offers real-time
                feedback to encourage healthy posture habits throughout your
                day.
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
                src="/figure-pos-collage.png"
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
        title="Figure POS"
        totalProducts={figurePosProducts.length}
        products={figurePosProducts}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}

export default page;
