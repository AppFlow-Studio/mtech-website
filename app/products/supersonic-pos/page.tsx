import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import { Product } from "@/lib/types";
import Image from "next/image";

const supersonicProducts: Partial<Product>[] = [
  {
    name: "SuperSonic POS",
    description:
      "SuperSonic POS is a comprehensive and versatile point-of-sale system that is perfectly suited for a wide range of retail environments. It's the best choice for businesses with diverse needs, including grocery delis, supermarkets, convenience stores, smoke shops, and clothing stores. The system is designed to handle complex inventory, fast transactions, and detailed reporting with ease. With its intuitive interface and powerful features, SuperSonic POS helps business owners streamline their operations, manage sales effectively, and provide excellent customer service.",
    imageSrc: "/products/product-14.png",
    link: "supersonic-pos",
    inStock: true,
    tags: ["pos system"],
  },
  {
    name: "Supersonic Mach X Kiosk",
    description:
      "The Supersonic Mach X Kiosk is a sleek and powerful 16-inch touchscreen self-service solution designed to revolutionize the customer experience. This modern kiosk empowers customers to place their own orders and process payments independently, which helps to reduce wait times and improve order accuracy. Ideal for quick-service restaurants, cinemas, and retail stores, the Mach X features an intuitive interface and a robust design, making it a reliable and efficient addition to any business looking to embrace self-service technology.",
    imageSrc: "/products/product-15.png",
    link: "supersonic-mach-x",
    inStock: true,
    tags: ["pos system", "credit card terminals"],
  },
  {
    name: "SuperSonic Kiosk",
    description:
      "The SuperSonic Kiosk is an ideal self-service solution for a variety of retail and hospitality businesses, including grocery delis, supermarkets, convenience stores, and more. By allowing customers to place and pay for their own orders, this kiosk system can dramatically increase efficiency, reduce lines, and free up staff to focus on other tasks. Its user-friendly interface ensures a smooth customer journey, while its robust hardware is built to withstand the demands of a high-volume environment, making it a smart investment for modernizing your business.",
    imageSrc: "/products/product-16.png",
    link: "supersonic-kiosk",
    inStock: true,
    tags: ["pos system"],
  },
  {
    name: "Supersonic Mach Flex",
    description:
      "The Supersonic Mach Flex is the perfect point-of-sale option for merchants who need a versatile and adaptable system. This flexible solution can be configured to meet the unique demands of various business types, from retail boutiques to bustling restaurants. Its modular design allows for customization of hardware components like screens, printers, and payment terminals, ensuring that the system perfectly matches your operational workflow. The Mach Flex combines powerful software with adaptable hardware for a truly personalized POS experience.",
    imageSrc: "/products/product-17.png",
    link: "supersonic-mach-flex",
    inStock: true,
    tags: ["pos system", "credit card terminals"],
  },
  {
    name: "Supersonic Mach Mini Bundle",
    description:
      "The Supersonic Mach Mini Bundle is a complete, all-in-one, portable point-of-sale solution designed for businesses that require mobility and power in a compact form factor. This bundle typically includes a tablet-based POS, a mobile payment reader, and a portable printer, giving you everything you need to conduct business from anywhere. It's an excellent choice for food trucks, pop-up shops, and service professionals who need to process sales and manage their operations on the go without being tied to a fixed counter.",
    imageSrc: "/products/product-18.png",
    link: "supersonic-mach-mini-bundle",
    inStock: true,
    tags: ["pos system"],
  },
  {
    name: "Supersonic Touch Screen",
    description:
      "Upgrade or replace the central component of your POS system with this Supersonic Touch Screen. Designed for clarity, responsiveness, and durability, this touchscreen is ideal for fast-paced environments like grocery delis, supermarkets, and smoke shops. Its intuitive touch interface allows cashiers to process orders and payments quickly and accurately, reducing transaction times and improving customer flow. This high-quality display is an essential part for ensuring your SuperSonic POS system operates at peak efficiency.",
    imageSrc: "/products/product-19.png",
    link: "supersonic-touch-screen",
    inStock: true,
    tags: ["pos accessories", "pos parts"],
  },
  {
    name: "Supersonic Printer",
    description:
      "This SuperSonic POS High-speed Thermal TCP/IP Printer (v2) is an essential accessory included in many POS bundles and available as a standalone upgrade. It is engineered for rapid and quiet receipt printing, helping to keep your checkout lines moving smoothly. Using a reliable TCP/IP Ethernet connection, it ensures stable communication with your main POS terminal. Its thermal printing technology means you never have to worry about replacing ink ribbons, making it a low-maintenance and cost-effective choice for any busy retail or hospitality business.",
    imageSrc: "/products/product-20.png",
    link: "supersonic-printer",
    inStock: true,
    tags: ["pos accessories"],
  },
  {
    name: "Supersonic Barcode Scanner",
    description:
      "Accelerate your checkout process and improve inventory management with the Supersonic Barcode Scanner. This high-performance scanner is an indispensable tool for a wide range of businesses, including grocery stores, supermarkets, and clothing boutiques. It quickly and accurately reads barcodes, reducing manual entry errors and speeding up transactions. Integrating seamlessly with the SuperSonic POS system, this scanner helps to streamline operations, from point of sale to stock-taking, making it a vital accessory for any retail environment.",
    imageSrc: "/products/product-21.png",
    link: "supersonic-barcode-scanner",
    inStock: true,
    tags: ["pos accessories"],
  },
  {
    name: "Supersonic Connect Box (Mini PC)",
    description:
      "The Supersonic Connect Box is the powerful and compact Mini PC that serves as the brain of your POS system. Designed for reliability and performance, this unit runs the core POS software and manages all connected peripherals, from touch screens to printers and scanners. Its small footprint allows it to be discreetly placed out of sight, saving valuable counter space. This Connect Box is an ideal solution for businesses like grocery delis and convenience stores that need a robust and dependable computing engine to power their daily operations.",
    imageSrc: "/products/product-22.png",
    link: "supersonic-connect-box-mini-pc",
    inStock: true,
    tags: ["network devices"],
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
                Supersonic POS
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                Supersonic POS" is a fast, user-friendly point-of-sale system
                that simplifies your business operations. From secure
                transactions to real-time analytics, it helps you manage
                inventory, track sales, and boost efficiency—all in one place.
                Perfect for businesses of all sizes, Supersonic POS makes
                running your store smarter and easier.
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
                src="/supersonic-pos-collage.png"
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
        title="Supersonic POS"
        totalInitialProducts={supersonicProducts.length}
        initialProducts={supersonicProducts}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}

export default page;
