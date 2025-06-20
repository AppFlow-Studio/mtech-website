import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const atmTopperProducts: Product[] = [
  {
    name: "High Bright Topper w/ Blue Grap...",
    description:
      "Includes power cable to system power supply; use P/N: 130211081 to extend it to...",
    imageSrc: "/products/product-79.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Digital Media Topper II w/ Flat Ba...",
    description:
      "Digital Media Topper II w/ Flat Base Great for Advertising your business and products",
    imageSrc: "/products/product-80.png",
    link: "#",
    inStock: true,
  },
  {
    name: "NEW REVISION STANDARD TOP...",
    description:
      "19x17x7 (When Using On Rev 10 or Lower NH1800SE Requires Rev 10 Topper Brack...",
    imageSrc: "/products/product-81.png",
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
                ATM TOPPER
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                The ATM Topper is a high-visibility signage solution designed to
                draw attention to your ATM and boost foot traffic. Ideal for
                indoor or outdoor use, it enhances visibility with bright,
                customizable messaging that can promote your brand, advertise
                services, or highlight the availability of cash withdrawals.
                Easy to install and built for durability, the ATM Topper helps
                maximize your ATM’s impact and customer engagement.
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
                src="/hyosung-collage.png"
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
        title="ATM TOPPER"
        totalProducts={atmTopperProducts.length}
        products={atmTopperProducts}
      />
    </>
  );
}

export default page;
