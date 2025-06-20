import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const dejavooProducts: Product[] = [
  {
    name: "Dejavoo P1 Desktop Android",
    description:
      'Features that keep your business moving forward: Large 5" HD touch screen, Power...',
    imageSrc: "/products/product-37.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo P3 Handheld Wireless A...",
    description:
      'Features that keep your business moving forward: Large 5" HD touch screen, Power...',
    imageSrc: "/products/product-38.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo P5 Handheld/PIN Pad W...",
    description:
      'Features that keep your business moving forward: Large 5" HD touch screen, Power...',
    imageSrc: "/products/product-39.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo QD1 Rigid Wireless Andr...",
    description:
      'Features that keep your business moving forward: Large 5" HD touch screen, Power...',
    imageSrc: "/products/product-40.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo P1 Desktop Android",
    description:
      'Features that keep your business moving forward: Large 5" HD touch screen, Power...',
    imageSrc: "/products/product-41.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo QD3 mPOS Android",
    description:
      'Features that keep your business moving forward: Large 5" HD touch screen, Power...',
    imageSrc: "/products/product-42.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo QD4 Desktop Android",
    description:
      "Features that keep your business moving forward: Lightning fast, Ethernet & WiFi, B...",
    imageSrc: "/products/product-43.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo QD5 PIN Pad Android",
    description:
      "Features that keep your business moving forward: Fast and secure tap-and-go pay...",
    imageSrc: "/products/product-44.png",
    link: "#",
    inStock: true,
  },
  {
    name: "DEJAVOO Z3 PINPAD WITH NO...",
    description:
      "Features that keep your business moving forward: Built in NFC Contactless Reader ,...",
    imageSrc: "/products/product-45.png",
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
                Dejavoo
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                Dejavoo offers some of the most innovative payment software
                solutions in the industry, designed for businesses of any size
                or from any sector.
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
                src="/dejavoo-collage.png"
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
        title="Dejavoo"
        totalProducts={dejavooProducts.length}
        products={dejavooProducts}
      />
    </>
  );
}

export default page;
