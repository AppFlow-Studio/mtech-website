import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const standsProducts: Product[] = [
  {
    name: "Stand for PAX S300 Terminal",
    description:
      "This durable and ergonomic mounting solution is designed specifically for the PAX S300 payment terminal. The stand securely holds the device, elevating it off the counter to protect it from spills and damage while reducing clutter. Its thoughtful design tilts the terminal towards the customer for easy viewing and interaction, facilitating a smoother, more professional payment experience. For any business using the PAX S300, this stand is an essential accessory for improving checkout efficiency and prolonging the life of the device.",
    imageSrc: "/products/product-63.png",
    link: "stand-pax-s300-terminal-2",
    inStock: true,
    tags: ["pos accessories"],
  },
  {
    name: "Stand for Ingenico Lane 3000",
    description:
      "The Stand for Ingenico Lane 3000 is a secure and practical mounting accessory designed to enhance the functionality of your PIN pad. By elevating the Lane 3000, this stand provides a stable platform for customers to complete their transactions, improving ergonomics and ease of use. It also helps protect the device from potential damage from spills and being knocked over, while keeping the countertop organized. This is an essential add-on for any retail environment looking to create a more secure and user-friendly checkout station.",
    imageSrc: "/products/product-64.png",
    link: "stand-ingenico-lane-3000",
    inStock: true,
    tags: ["pos accessories"],
  },
  {
    name: "Stand for Dejavoo Z8 & Z11 Terminals",
    description:
      "This custom stand is a durable, space-saving solution designed to securely hold Dejavoo Z8 and Z11 payment terminals. It positions the terminal at an optimal angle for customer interaction, making it easier to view the screen, insert cards, and enter PINs. The sturdy base keeps the device stable during use and helps to protect it from the daily wear and tear of a busy retail environment. This stand is a smart investment to improve the checkout workflow and maintain a clean, organized point-of-sale area.",
    imageSrc: "/products/product-65.png",
    link: "stand-dejavoo-z8-z11-terminals",
    inStock: true,
    tags: ["pos accessories"],
  },
  {
    name: "Stand for Valor ALL Terminals",
    description:
      "The Stand for Valor ALL Terminals is a versatile and secure mounting solution compatible with the entire range of Valor payment devices. This universal stand is engineered to provide a stable and ergonomic base for your terminal, improving the customer experience by positioning the device for easy access. It helps to keep your counter space tidy and protects your valuable payment terminal from accidental damage. Its robust construction ensures long-lasting performance in any high-traffic commercial setting.",
    imageSrc: "/products/product-66.png",
    link: "stand-valor-all-terminals",
    inStock: true,
    tags: ["pos accessories"],
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
        totalInitialProducts={standsProducts.length}
        initialProducts={standsProducts}
      />
    </>
  );
}

export default page;
