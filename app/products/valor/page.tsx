import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const valorProducts: Product[] = [
  {
    name: "Valor RCKT eMV mPOS Reader",
    description:
      "The Valor RCKT is the perfect mobile payment solution for businesses on the go. This mini, portable payment device, or mPOS reader, is small enough to fit in your pocket but powerful enough to handle secure transactions anywhere. It connects wirelessly to your smartphone or tablet to accept EMV chip and magnetic stripe cards, making it ideal for mobile vendors, service technicians, and event merchants. The RCKT empowers you to take secure payments and grow your business without being tied to a traditional countertop.",
    imageSrc: "/products/product-46.png",
    link: "valor-rckt-emv-mpos-reader",
    inStock: true,
    tags: ["credit card terminals", "pos accessories"],
  },
  {
    name: "Valor VP550 Payment Terminal",
    description:
      "The Valor VP550 is a state-of-the-art payment terminal that offers robust performance and advanced security features. Designed for a seamless checkout experience, it supports a full range of payment methods, including contactless, EMV chip, and magstripe. Its clear display and ergonomic design make it user-friendly for both merchants and customers. The VP550 is an excellent choice for businesses looking for a reliable, fast, and secure countertop terminal that can handle the demands of modern commerce.",
    imageSrc: "/products/product-47.png",
    link: "valor-vp550",
    inStock: true,
    tags: ["credit card terminals"],
  },
  {
    name: "Stand for Valor ALL Terminals",
    description:
      "This versatile stand is designed to be compatible with all Valor payment terminals, providing a secure and stable mounting solution for your device. By elevating the terminal, it creates a more ergonomic angle for customer use, protects the device from spills, and helps to organize your checkout counter. Its sturdy construction ensures it will withstand the rigors of a busy retail environment. This stand is an essential accessory for any business using a Valor terminal to improve workflow and prolong the life of their equipment.",
    imageSrc: "/products/product-48.png",
    link: "stand-valor-all-terminals-2",
    inStock: true,
    tags: ["pos accessories"],
  },
  {
    name: "Valor VP300 Payment Terminal",
    description:
      "The Valor VP300 is a versatile and secure payment terminal designed to meet the needs of a wide range of businesses. It capably handles all major payment types, including EMV chip, NFC contactless, and magnetic stripe, ensuring you can accept any way your customers want to pay. The VP300 is known for its reliability and ease of use, making it a solid choice for merchants who need a dependable workhorse for their daily transactions. It provides a secure and efficient payment processing solution in a compact and durable package.",
    imageSrc: "/products/product-49.png",
    link: "valor-vp-300",
    inStock: true,
    tags: ["credit card terminals"],
  },
  {
    name: "Valor VP100 PIN Pad",
    description:
      "The Valor VP100 is a secure and compact PIN pad designed to integrate seamlessly with your existing POS system. It provides a dedicated and secure interface for customers to enter their PIN, ensuring compliance with security standards. Additionally, the mG-T30 scale integration offers precise and reliable weighing for businesses that sell products by weight, like delis or frozen yogurt shops. The VP100 is a multifunctional device that enhances both the security and capability of your point of sale.",
    imageSrc: "/products/product-50.png",
    link: "valor-vp-100",
    inStock: true,
    tags: ["credit card terminals", "scales"],
  },
  {
    name: "Valor VL300 PIN Pad",
    description:
      "The Valor VL300 is a feature-rich, customer-facing PIN pad that is certified with the latest PCI-PTS 5.0 security standards. It offers an enhanced checkout experience with capabilities like on-screen signature capture and smart, dynamic tipping prompts. The VL300 connects via Ethernet or USB and supports all modern payment methods, making it a highly versatile and secure addition to any POS setup. It is designed to speed up transactions while providing the highest level of payment data security for your customers.",
    imageSrc: "/products/product-51.png",
    link: "valor-vl300-pin-pad",
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
        totalInitialProducts={valorProducts.length}
        initialProducts={valorProducts}
      />
    </>
  );
}

export default page;
