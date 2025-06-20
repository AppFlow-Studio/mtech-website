import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const hyosungAtmProducts: Product[] = [
  {
    name: "HYOSUNG HALO II",
    description:
      "The HALO II offers a unique, sleek design perfect for locations ranging from small c...",
    imageSrc: "/products/product-75.png",
    link: "#",
    inStock: true,
  },
  {
    name: "HYOSUNG 5200SE",
    description:
      "The 5200 provides a choice of either an affordable Microsoft® Windows® CE 6.0 p...",
    imageSrc: "/products/product-76.png",
    link: "#",
    inStock: true,
  },
  {
    name: "HYOSUNG FORCE MX 2800SE",
    description:
      "Hyosung is dedicated to making technology work for the humans who use...",
    imageSrc: "/products/product-77.png",
    link: "#",
    inStock: true,
  },
  {
    name: "HYOSUNG FORCE TTW 4K",
    description:
      "The 2800T brings you through-the-wall replacement and enhancement...",
    imageSrc: "/products/product-78.png",
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
                HYOSUNG 
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                Innovation, creativity, and technology allow Nautilus Hyosung to
                provide the customers with next-generation ATMs that are
                incomparable. Nautilus Hyosung machines are engineered to
                provide consumers with a functional, user-friendly, secure
                experience. From bill payments and fund transfers to self-audit
                and video assistance, the capabilities of Hyosung machines
                exceed all the expectations and ensure that Hyosung will remain
                your first choice in ATM manufacturing and technology. Hyosung
                ATMs are highly considered when huge businesses are forming
                their digital transformation strategies.
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
        title="HYOSUNG"
        totalProducts={hyosungAtmProducts.length}
        products={hyosungAtmProducts}
      />
    </>
  );
}

export default page;
