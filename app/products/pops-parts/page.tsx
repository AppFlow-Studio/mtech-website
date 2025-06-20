import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const popsPartsProducts: Product[] = [
  {
    name: "Nautilus Hyosung ATM Topper Br...",
    description:
      "Nautilus Hyosung ATM Topper Bracket Angled Top NH2600 Halo II...",
    imageSrc: "/products/product-82.png",
    link: "#",
    inStock: true,
  },
  {
    name: "LCD ASSEMBLY, I F BOARD (INV...",
    description:
      "The LCD Assembly with v/f (inverter) board for 1800SE and MX 4000W ATMS is a criti...",
    imageSrc: "/products/product-83.png",
    link: "#",
    inStock: true,
  },
  {
    name: 'GENMEGA AND HANTLE 7" Col...',
    description: 'GENMEGA AND HANTLE 7" Color LCD for 1700W, G1900 & GT3000',
    imageSrc: "/products/product-84.png",
    link: "#",
    inStock: true,
  },
  {
    name: "HYOSUNG, 1800SE LCD SCREEN",
    description:
      "HYOSUNG LCD SCREEN ONLY COMPATIBLE WITH MX4000W , NH1800SE...",
    imageSrc: "/products/product-85.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Hyosung 1K New Style CDU Side...",
    description:
      "Hyosung 1K New Style CDU Side Cover Part Number S4310000340...",
    imageSrc: "/products/product-86.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Hyosung Rubber Note Pick Wheel",
    description:
      "Compatible with HALO II, MX5200SE, MX5200S, MX5100T, MX5600L, MX560...",
    imageSrc: "/products/product-87.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Genmega GT5000 ATM Series",
    description:
      "Genmega introduces the GT5000 series ATM. A high performance yet economical...",
    imageSrc: "/products/product-88.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Hyosung Halo II Rubber Function Pad",
    description: "Hyosung Halo II Rubber Function Pad. Part Number S4960000344",
    imageSrc: "/products/product-89.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Hyosung Upper Fascia Bezel Unit...",
    description:
      "Hyosung Upper Fascia Bezel Unit For Halo II Part Number S4570002531",
    imageSrc: "/products/product-90.png",
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
                POPS Parts
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                POS (Point of Sale) Parts are essential components used to
                maintain, upgrade, or repair point-of-sale systems in retail,
                hospitality, and service environments. This category includes
                items such as receipt printer parts, cash drawer components,
                barcode scanner accessories, touch screen replacements, power
                adapters.
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
                src="/parts-collage.png"
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
        title="POPS Parts"
        totalProducts={popsPartsProducts.length}
        products={popsPartsProducts}
      />
    </>
  );
}

export default page;
