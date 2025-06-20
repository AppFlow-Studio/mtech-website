import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const standsProducts: Product[] = [
  {
    name: "Stand PAX S300 Terminal",
    description:
      "The Stand for PAX S300 Terminal offers a durable and ergonomic mounting solution...",
    imageSrc: "/products/product-63.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Stand Ingenico Lane 3000",
    description:
      "The Stand for Ingenico Lane 3000 is a secure and practical mounting solution de...",
    imageSrc: "/products/product-64.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Stand Dejavoo Z8-Z11 Terminals",
    description:
      "The Stand for Dejavoo Z8 and Z11 Terminals is a durable, space-saving solutio...",
    imageSrc: "/products/product-65.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Stand Valor ALL Terminals",
    description:
      "The Stand for Valor All Terminals is a versatile and secure mounting solution co...",
    imageSrc: "/products/product-66.png",
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
                Stands
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
                src="/ingenico-collage.png"
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
        title="Stands"
        totalProducts={standsProducts.length}
        products={standsProducts}
      />
    </>
  );
}

export default page;
