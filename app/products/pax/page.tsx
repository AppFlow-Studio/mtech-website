import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const paxProducts: Product[] = [
  {
    name: "Pax Aries 8",
    description:
      "The Aries8 is a next generation multi-functional tablet that serves a multitude of...",
    imageSrc: "/products/product-52.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Pax A35 Pin Pad",
    description:
      "Features our latest operating system, PAXBiz® powered by Android™ – Adheres...",
    imageSrc: "/products/product-53.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Pax A30 Pin Pad",
    description:
      "Equipped with a Cortex A53 processor, the A30 ensures swift transaction processing...",
    imageSrc: "/products/product-54.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Stand for Pax S300 & A35",
    description:
      "The Stand for PAX S300 & A35 provides a secure, professional mounting solution de...",
    imageSrc: "/products/product-55.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Stand PAX S300 Terminal",
    description:
      "The Stand for PAX S300 Terminal is a sturdy and reliable mounting solution desi...",
    imageSrc: "/products/product-56.png",
    link: "#",
    inStock: true,
  },
  {
    name: "PAX A60",
    description:
      "The A60 is a sleek and compact SmartMobile Pin Pad that delivers the hig...",
    imageSrc: "/products/product-57.png",
    link: "#",
    inStock: true,
  },
  {
    name: "PAX S300",
    description:
      "PAX's S300 is the latest integrated retail payment solution for retail merchants who...",
    imageSrc: "/products/product-58.png",
    link: "#",
    inStock: true,
  },
  {
    name: "PAX A920PRO",
    description:
      "The A920 Pro comes with a larger screen, faster performance, and an optional built-i...",
    imageSrc: "/products/product-59.png",
    link: "#",
    inStock: true,
  },
  {
    name: "PAX A80",
    description:
      "PAX’s A80, the most cost-effective in the A-series, is a powerful, game-changing coun...",
    imageSrc: "/products/product-60.png",
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
                PAX 
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                PAX is a global leader in secure electronic payment solutions,
                offering innovative, reliable, and user-friendly point-of-sale
                (POS) terminals for businesses of all sizes. Known for their
                robust hardware and advanced software features, PAX devices
                support a wide range of payment methods, including EMV,
                magstripe, and contactless options.
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
                src="/pax-collage.png"
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
        title="PAX"
        totalProducts={paxProducts.length}
        products={paxProducts}
      />
    </>
  );
}

export default page;
