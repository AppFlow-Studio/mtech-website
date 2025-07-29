import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const ingenicoProducts: Partial<Product>[] = [
  {
    name: "Ingenico Moby 5500 Card Reader",
    description:
      "The Ingenico Moby 5500 is a versatile and secure mobile point-of-sale (mPOS) card reader designed for modern commerce. It accepts all major card-based payment methods, including traditional magstripe, secure EMV chip cards, and convenient NFC/contactless payments. A standout feature is its 'PIN-on-Mobile' capability, which allows for secure PIN entry directly on a consumer-grade smartphone or tablet. This makes it an incredibly flexible and cost-effective solution for merchants who need to accept secure payments anywhere their business takes them.",
    imageSrc: "/products/product-61.png",
    link: "ingenico-moby-5500-card-reader",
    inStock: true,
    tags: ["credit card terminals", "pos accessories"],
  },
  {
    name: "Ingenico Lane 3000 PIN Pad",
    description:
      "The Ingenico Lane 3000 is a robust and reliable PIN pad designed to enhance the checkout process in even the most demanding retail environments. It features a high-end, durable keypad that provides a comfortable and secure PIN entry experience for customers. Its compact design saves counter space, while its fast processor ensures transactions are completed quickly. The Lane 3000 supports all modern payment methods, making it a versatile and long-lasting addition to any integrated point-of-sale system.",
    imageSrc: "/products/product-62.png",
    link: "ingenico-lane-3000-pin-pad",
    inStock: true,
    tags: ["credit card terminals", "pos accessories"],
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
                Ingenico 
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
        title="Ingenico"
        totalInitialProducts={ingenicoProducts.length}
        initialProducts={ingenicoProducts}
      />
    </>
  );
}

export default page;
