import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import { Product } from "@/lib/types";
import Image from "next/image";

const cloverProducts: Product[] = [
  {
    name: "Clover Go Reader and Dock Bundle",
    description:
      "Take your business anywhere with the Clover Go Reader and Dock Bundle. This ultra-portable solution allows you to securely accept credit card payments on the go by pairing the compact reader with your smartphone or tablet. It accepts EMV chip, swipe, and contactless payments, offering full flexibility for you and your customers. The included dock provides a stable countertop charging base and a professional look when you're back at your home base. It's the perfect, versatile payment solution for food trucks, market stalls, and mobile service professionals.",
    imageSrc: "/products/product-30.png",
    link: "clover-go-reader-and-dock-bundle",
    inStock: true,
    tags: ["credit card terminals", "pos system", "pos accessories"],
  },
  {
    name: "Clover Station Duo",
    description:
      "The Clover Station Duo is a premier, all-in-one point-of-sale system designed to manage your entire business with power and elegance. It features a large, high-resolution screen for the merchant and a dedicated, customer-facing display for payment, tipping, and loyalty interactions, creating a smooth and transparent checkout experience. This powerful system handles everything from payment processing (including chip, swipe, and NFC) to inventory management, employee tracking, and detailed sales reporting. It's the ultimate command center for any modern retail or restaurant environment.",
    imageSrc: "/products/product-31.png",
    link: "clover-station-duo",
    inStock: true,
    tags: ["pos system", "credit card terminals"],
  },
  {
    name: "Clover Station Duo WiFi Bundle - No Cash Drawer",
    description:
      "This Clover Station Duo WiFi Bundle offers a complete, modern POS solution tailored for businesses that operate in a more digital, cash-free environment. The bundle includes the powerful dual-screen Clover Station Duo, which provides seamless transaction management and customer interaction, all connected via reliable WiFi. By excluding the traditional cash drawer, this package promotes a sleeker, more streamlined countertop setup, perfect for cafes, boutiques, and service providers who primarily handle card and digital payments. It's a modern approach to point-of-sale that emphasizes speed and digital efficiency.",
    imageSrc: "/products/product-32.png",
    link: "clover-station-duo-wifi-bundle",
    inStock: true,
    tags: ["pos system", "credit card terminals", "network devices"],
  },
  {
    name: "Clover Station Solo",
    description:
      "The Clover Station Solo is a powerful and versatile all-in-one point-of-sale system designed to be the central hub for businesses of all sizes. Featuring a single, large touchscreen, it simplifies every aspect of your operations, from taking orders and processing all payment types to managing inventory and customer relationships. Its sleek design and robust software capabilities allow for extensive customization with a wide array of apps, making it an adaptable solution that can grow with your business needs, whether you're in retail, food service, or professional services.",
    imageSrc: "/products/product-33.png",
    link: "clover-station-solo",
    inStock: true,
    tags: ["pos system", "credit card terminals"],
  },
  {
    name: "Clover Station Solo Bundle - No Cash Drawer",
    description:
      "Experience the power of a comprehensive POS in a sleek, space-saving package with the Clover Station Solo Bundle. This setup is perfect for businesses that have moved away from heavy cash transactions, offering the all-in-one Clover Station Solo without the bulk of a cash drawer. Manage sales, inventory, and customer data from a single, elegant touchscreen device that handles all modern payment types, including contactless and mobile wallets. This bundle is ideal for modern retailers, cafes, or service-based businesses looking for a clean and efficient checkout counter.",
    imageSrc: "/products/product-34.png",
    link: "clover-station-solo-bundle-no-cash-drawer",
    inStock: true,
    tags: ["pos system", "credit card terminals"],
  },
  {
    name: "Clover Mini",
    description:
      "The Clover Mini packs the full power of a traditional POS system into a compact and stylish device. While small in size, it offers robust functionality, capable of handling everything from swift payment processing to inventory tracking and employee management. Its intuitive touchscreen interface makes it easy to use, and it can operate as a standalone POS or be integrated into a larger Clover system. The Clover Mini is the perfect solution for businesses that need a full-featured system but have limited counter space, such as coffee shops, small retailers, and quick-service restaurants.",
    imageSrc: "/products/product-35.png",
    link: "clover-mini",
    inStock: true,
    tags: ["pos system", "credit card terminals"],
  },
  {
    name: "Clover Flex WiFi",
    description:
      "Unleash your business from the countertop with the Clover Flex WiFi. This portable, all-in-one POS device is designed for ultimate mobility and convenience, allowing you to take orders, process payments, and manage your business from anywhere in your store or on the go. It features a built-in receipt printer and barcode scanner, and accepts all payment types, including swipe, chip, and contactless. The Clover Flex is perfect for tableside ordering in restaurants, line-busting in retail, and any situation that demands payment flexibility and speed, all connected seamlessly through your WiFi network.",
    imageSrc: "/products/product-36.png",
    link: "clover-flex-wifi",
    inStock: true,
    tags: ["pos system", "credit card terminals", "network devices"],
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
                Clover
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
                src="/clover-collage.png"
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
        title="Clover"
        totalProducts={cloverProducts.length}
        products={cloverProducts}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}

export default page;
