import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import SanityImage from "@/components/SanityImage";
import PricingSection from "@/components/products/PricingSection";
import { PortableText } from "@portabletext/react";


const paxProducts: Partial<Product>[] = [
  {
    name: "Pax Aries 8 Tablet POS",
    description:
      "The Pax Aries 8 is a next-generation, multi-functional retail tablet that serves a multitude of purposes at the point of sale. With its large, vibrant touchscreen and powerful processor, it can function as a sleek, modern POS terminal, a customer-facing display, or a mobile unit for staff on the floor. Running on a secure Android-based operating system, the Aries 8 is designed for versatility, allowing businesses to manage sales, inventory, and customer interactions all from one elegant and adaptable device.",
    imageSrc: "/products/product-52.png",
    link: "pax-aries-8",
    inStock: true,
    tags: ["pos system", "credit card terminals"],
  },
  {
    name: "Pax A35 PIN Pad",
    description:
      "The Pax A35 is a sophisticated and highly secure PIN pad that enhances the customer checkout experience. It operates on the latest PAXBiz operating system, powered by Android, providing a modern, app-driven interface on its brilliant color touchscreen. The A35 is designed to adhere to the highest security standards, ensuring customer payment data is always protected. It's an ideal solution for multi-lane retailers and businesses looking to integrate a feature-rich, customer-facing payment device into their POS system.",
    imageSrc: "/products/product-53.png",
    link: "pax-a35-pin-pad",
    inStock: true,
    tags: ["pos accessories", "pos system"],
  },
  {
    name: "Pax A30 PIN Pad",
    description:
      "The Pax A30 is a versatile and powerful payment device that combines the functions of a traditional PIN pad with the intelligence of a smart terminal. Equipped with a Cortex A53 processor, the A30 ensures swift and secure transaction processing, minimizing wait times for customers. It features a crystal-clear touchscreen and supports all forms of payment, from magnetic stripe and EMV chip to contactless and mobile wallets. The A30 is a robust and efficient solution for merchants looking to modernize their payment acceptance capabilities.",
    imageSrc: "/products/product-54.png",
    link: "pax-a30-pin-pad",
    inStock: true,
    tags: ["pos accessories", "pos system"],
  },
  {
    name: "Stand for Pax S300 & A35",
    description:
      "Provide a secure and professional mounting solution for your payment terminals with this custom-designed stand. It is compatible with both the PAX S300 and A35 PIN pad models, ensuring a perfect fit. This stand elevates the device for easier customer interaction, reduces countertop clutter, and protects the terminal from spills and damage. Its sturdy construction and swivel mechanism allow for smooth movement, making it easier for customers to enter their PIN or sign, thereby improving the overall checkout experience.",
    imageSrc: "/products/product-55.png",
    link: "stand-for-pax-s300-a35",
    inStock: true,
    tags: ["pos accessories"],
  },
  {
    name: "Stand for PAX S300 Terminal",
    description:
      "This stand is a sturdy and reliable mounting solution designed specifically for the PAX S300 integrated retail payment terminal. By securely holding the S300 in place, it creates a more organized and professional checkout counter. The stand is designed for optimal ergonomics, positioning the terminal at a comfortable angle for customer use, whether they are inserting a card, tapping to pay, or entering a PIN. It's a crucial accessory for protecting your investment and ensuring a smooth, efficient payment process.",
    imageSrc: "/products/product-56.png",
    link: "stand-pax-s300-terminal",
    inStock: true,
    tags: ["pos accessories"],
  },
  {
    name: "PAX A60 SmartMobile PIN Pad",
    description:
      "The PAX A60 is a sleek and compact SmartMobile PIN Pad that delivers the highest level of payment security and performance in a portable package. Featuring a vibrant touchscreen, long-lasting battery, and robust wireless connectivity options, the A60 is designed for businesses on the move. It allows merchants to accept payments, manage inventory, and perform other business tasks from anywhere. Its ergonomic design and powerful features make it an ideal choice for hospitality, mobile services, and retail environments requiring flexibility.",
    imageSrc: "/products/product-57.png",
    link: "pax-a60",
    inStock: true,
    tags: ["pos system", "credit card terminals"],
  },
  {
    name: "PAX S300 Integrated Retail Payment Solution",
    description:
      "The PAX S300 is the ultimate integrated retail payment solution for merchants who require a secure, fast, and reliable customer-facing device. As the latest in a line of trusted payment terminals, the S300 is designed to connect directly to an ECR or POS system, handling all payment processing with speed and security. It supports a full range of payment options, including NFC contactless, EMV chip, and magstripe, all while meeting the most stringent security standards. It's a cornerstone for building a modern, efficient, and secure checkout lane.",
    imageSrc: "/products/product-58.png",
    link: "pax-s300",
    inStock: true,
    tags: ["pos system", "credit card terminals"],
  },
  {
    name: "PAX A920 Pro SmartMobile Terminal",
    description:
      "The PAX A920 Pro is an upgraded version of the popular A920, designed for merchants who demand even more performance and functionality. It comes with a larger, higher-resolution screen for an improved user and customer experience, a faster processor for quicker transactions, and an optional built-in professional barcode scanner. This powerful, all-in-one mobile terminal runs on a flexible Android OS, combining payment, business management, and mobility into one elegant device. The A920 Pro is the ultimate tool for modern, dynamic commerce.",
    imageSrc: "/products/product-59.png",
    link: "pax-a920pro",
    inStock: true,
    tags: ["pos system", "credit card terminals"],
  },
  {
    name: "PAX A80 Countertop Smart Terminal",
    description:
      "The PAX A80 is a game-changing countertop payment terminal that offers robust performance at an exceptional value, making it the most cost-effective device in the A-series. This powerful yet compact terminal is designed to be the central hub of any business's payment operations. It features an intuitive touchscreen, a fast thermal printer, and a full range of connectivity options. Running on a secure Android-based platform, the A80 supports all modern payment methods and can be customized with various business applications, providing a versatile and future-proof solution.",
    imageSrc: "/products/product-60.png",
    link: "pax-a80",
    inStock: true,
    tags: ["pos system", "credit card terminals"],
  },
];

async function page() {
  const PAX = await client.fetch(
    `*[_type == "POS_SYSTEM_TYPES" && POS_System_Link == "/pax"]`
  );
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
                {PAX[0].POS_System_Header}
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                <PortableText value={PAX[0].POS_System_Description} />
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
              {/* <Image
                src="/pax-collage.png"
                alt="A collage of modern payment processing images"
                width={800} // Defines the aspect ratio
                height={550} // Defines the aspect ratio
                className="w-full h-auto"
              /> */}
              <SanityImage 
                image={PAX[0].POS_System_Image}
                alt={PAX[0].POS_System_Header}
                width={800}
                height={550}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      <ProductGridLayout
        title="PAX"
        totalInitialProducts={PAX[0].POS_System_Items?.length || 0}
        initialProducts={PAX[0].POS_System_Items as Product[]}
      />
      <PricingSection pricingPlans={PAX[0].POS_System_Pricing_Plans} header={PAX[0].POS_System_Pricing_Header} description={PAX[0].POS_System_Pricing_Description} />
    </>
  );
}

export default page;
