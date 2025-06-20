import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const valorProducts: Product[] = [
  {
    name: "Valor RCKT eMV mPOS Reader",
    description:
      "The RCKT is the perfect mobile payment solution. This mini portable payment devic...",
    imageSrc: "/products/product-46.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Valor VP550",
    description:
      "The RCKT is the perfect mobile payment solution. This mini portable payment devic...",
    imageSrc: "/products/product-47.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Stand Valor ALL Terminals",
    description:
      "The RCKT is the perfect mobile payment solution. This mini portable payment devic...",
    imageSrc: "/products/product-48.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Valor VP 300",
    description:
      "The RCKT is the perfect mobile payment solution. This mini portable payment devic...",
    imageSrc: "/products/product-49.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Valor VP 100",
    description:
      "The mG-T30 offers precise and reliable weighing for a variety of business needs, l...",
    imageSrc: "/products/product-50.png",
    link: "#",
    inStock: true,
  },
  {
    name: "VALOR VL300 PIN PAD",
    description:
      "PCI-PTS 5.0 Certified PinPad, Signature Capture, Smart Tipping, Ethernet, USB an...",
    imageSrc: "/products/product-51.png",
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
                Valor
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                Fast, secure, and built for modern businesses, Valor credit card
                terminals deliver seamless payment processing with advanced
                features, intuitive design, and the reliability you need to keep
                every transaction smooth and efficient.
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
                src="/valor-collage.png"
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
        title="Valor"
        totalProducts={valorProducts.length}
        products={valorProducts}
      />
    </>
  );
}

export default page;
