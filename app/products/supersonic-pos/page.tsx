import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import { Product } from "@/lib/types";
import Image from "next/image";

const supersonicProducts: Product[] = [
  {
    name: "SuperSonic POS",
    description:
      "Best for Grocery Deli, Supermarkets, Convenience Stores, Smoke Shops, Cloth...",
    imageSrc: "/products/product-14.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Mach X",
    description:
      "The Mach X Kiosk is a sleek and powerful 16-inch touchscreen self-service solution,...",
    imageSrc: "/products/product-15.png",
    link: "#",
    inStock: true,
  },
  {
    name: "SuperSonic Kiosk",
    description:
      "Best for Grocery Deli, Supermarkets, Convenience Stores, Smoke Shops, Cloth...",
    imageSrc: "/products/product-16.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Mach Flex",
    description:
      "The Mach Flex option is perfect for merchants who need a versatile and adap...",
    imageSrc: "/products/product-17.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Mach Mini Bundle",
    description:
      "The Mach Mini Bundle is an all-in-one, portable point-of-sale solution designed f...",
    imageSrc: "/products/product-18.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Touch Screen",
    description:
      "Best for Grocery Deli, Supermarkets, Convenience Stores, Smoke Shops, Cloth...",
    imageSrc: "/products/product-19.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Printer",
    description:
      "SuperSonic POS Highspeed Thermal TCP/IP Printer-v2 in POS bundle.",
    imageSrc: "/products/product-20.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Barcode Scanner",
    description:
      "Best for Grocery Deli, Supermarkets, Convenience Stores, Smoke Shops, Cloth...",
    imageSrc: "/products/product-21.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Connect Box (Mini Pc)",
    description:
      "Best for Grocery Deli, Supermarkets, Convenience Stores, Smoke Shops, Cloth...",
    imageSrc: "/products/product-22.png",
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
                Supersonic POS
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                Supersonic POS" is a fast, user-friendly point-of-sale system
                that simplifies your business operations. From secure
                transactions to real-time analytics, it helps you manage
                inventory, track sales, and boost efficiency—all in one place.
                Perfect for businesses of all sizes, Supersonic POS makes
                running your store smarter and easier.
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
                src="/supersonic-pos-collage.png"
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
        title="Supersonic POS"
        totalProducts={supersonicProducts.length}
        products={supersonicProducts}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}

export default page;
