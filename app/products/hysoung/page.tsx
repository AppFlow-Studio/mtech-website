import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const hyosungAtmProducts: Product[] = [
  {
    name: "Hyosung HALO II ATM",
    description:
      "The Nautilus Hyosung HALO II ATM is a standout in the retail ATM market, featuring a unique, sleek design and a vibrant, user-friendly interface. Its signature iridescent, color-changing keypad bezel attracts customers, while its large, bright display makes transactions easy to follow. The HALO II is perfect for a wide range of locations, from small convenience stores to upscale hotels, offering robust security and high reliability. It combines stunning aesthetics with the dependable performance that Hyosung is known for, making it a popular choice worldwide.",
    imageSrc: "/products/product-75.png",
    link: "hyosung-halo-ii",
    inStock: true,
    tags: ["atm machines"],
  },
  {
    name: "Hyosung 5200SE ATM",
    description:
      "The Hyosung 5200SE is a high-performance, bank-grade lobby ATM that offers advanced features and exceptional reliability. This machine provides a choice of either an affordable Microsoft Windows CE 6.0 platform or the more powerful Windows 7, allowing for greater flexibility and upgradeability. With its large 12.1-inch screen, high-capacity cash dispenser, and options for check and cash deposit, the 5200SE is designed to handle high transaction volumes in financial institutions and busy retail environments, providing a true self-service experience.",
    imageSrc: "/products/product-76.png",
    link: "hyosung-5200se",
    inStock: true,
    tags: ["atm machines"],
  },
  {
    name: "Hyosung FORCE MX 2800SE ATM",
    description:
      "The Hyosung FORCE MX 2800SE is a next-generation retail ATM dedicated to making technology work seamlessly for its users. It features a modern, user-friendly interface on a large 12.1-inch screen, along with integrated NFC/RFID and barcode scanning capabilities for enhanced transaction options. The FORCE is built with a strong focus on security and reliability, ensuring maximum uptime and customer trust. Its modular design allows for easy maintenance and future upgrades, making it a smart, forward-looking investment for any business.",
    imageSrc: "/products/product-77.png",
    link: "hyosung-force-mx-2800se",
    inStock: true,
    tags: ["atm machines"],
  },
  {
    name: "Hyosung FORCE TTW 4K ATM",
    description:
      "The Hyosung FORCE TTW (Through-The-Wall) brings next-generation technology to the outdoor ATM space. Designed as an ideal replacement for older through-the-wall models, this machine offers significant enhancements in performance, security, and user experience. It features a large, weatherized display, modern transaction options like contactless payments, and robust construction to withstand the elements. The FORCE TTW provides a reliable and attractive 24/7 cash access point for customers while offering easy rear-access serviceability for operators.",
    imageSrc: "/products/product-78.png",
    link: "hyosung-force-ttw-4k",
    inStock: true,
    tags: ["atm machines"],
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
        totalInitialProducts={hyosungAtmProducts.length}
        initialProducts={hyosungAtmProducts}
      />
    </>
  );
}

export default page;
