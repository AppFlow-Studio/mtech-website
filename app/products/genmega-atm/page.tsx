import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const genmegaAtmProducts: Product[] = [
  {
    name: "ONYX WALL MOUNT",
    description:
      "Introducing the all new Onyx-W ATM. The Onyx-W can be installed securely as a Wal...",
    imageSrc: "/products/product-67.png",
    link: "#",
    inStock: true,
  },
  {
    name: "G2500 ATM SERIES",
    description:
      "Designed for retail and off-premise locations, the G2500 comes loaded with...",
    imageSrc: "/products/product-68.png",
    link: "#",
    inStock: true,
  },
  {
    name: "G2500P ATM SERIES",
    description:
      "Building on the great reputation of the G2500 the G2500P model...",
    imageSrc: "/products/product-69.png",
    link: "#",
    inStock: true,
  },
  {
    name: "GENMEGA ONYX SERIES ATM",
    description: "A new, modern, upscale design containing a host...",
    imageSrc: "/products/product-70.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ONYX-P ATM SERIES",
    description: "Securely. We do not store credit card detai...",
    imageSrc: "/products/product-71.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Genmega GT3000 ATM Series",
    description:
      "Genmega introduces the GT3000 series through-the-wall ATM. Designed as a true...",
    imageSrc: "/products/product-72.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Genmega GT5000 ATM Series",
    description:
      "Genmega introduces the GTD000 series ATM. A high performance yet economical...",
    imageSrc: "/products/product-73.png",
    link: "#",
    inStock: true,
  },
  {
    name: "GENMEGA NOVA",
    description:
      "Genmega is proud to announce the new NOVA retail ATM. With a world of new ser...",
    imageSrc: "/products/product-74.png",
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
                Genmega ATM
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                Genmega's products are frequently developed with direct consumer
                feedback and collaboration. Genmega is a beneficial partner
                because of its ability to take a customer's idea or equipment
                need from concept to market and its openness to explore
                possibilities. With tens of thousands of ATMs and components
                installed and a team of engineers, developers, and technicians
                with decades of ATM experience, Genmega has designed everything
                while keeping the importance of having reliable equipment in
                ATMs.
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
                src="/genmega-atm-collage.png"
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
        title="Genmega ATM"
        totalProducts={genmegaAtmProducts.length}
        products={genmegaAtmProducts}
      />
    </>
  );
}

export default page;
