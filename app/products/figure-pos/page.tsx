import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import { Product } from "@/lib/types";
import Image from "next/image";

const figurePosProducts: Product[] = [
  {
    name: "Figure POS",
    description:
      "Figure POS is a powerful and intuitive point-of-sale system meticulously designed for the dynamic hospitality industry. It is the perfect operational hub for bars, coffee shops, quick-service establishments, pizzerias, and full-service restaurants. This system streamlines every aspect of your business, from easy order entry and customizable table management to seamless payment processing and integrated loyalty programs. With its robust reporting features and inventory controls tailored for food and beverage, Figure POS helps you make smarter business decisions, reduce waste, and enhance the overall guest experience, ensuring your service is always fast, accurate, and efficient.",
    imageSrc: "/products/product-23.png",
    link: "figure-pos",
    inStock: true,
    tags: ["pos system", "restaurant pos", "hospitality"],
  },
  {
    name: "Kitchen Display System (KDS)",
    description:
      "Our Kitchen Display System (KDS) revolutionizes your kitchen workflow by replacing traditional paper tickets with a dynamic digital screen. Orders are sent instantly from the POS to the KDS, eliminating handwritten errors and lost tickets. This system improves communication between front-of-house and back-of-house staff, enhances order accuracy, and tracks ticket times to ensure food is prepared and delivered efficiently. With features like color-coded order statuses and routing to specific prep stations, the KDS creates a quieter, more organized, and highly efficient kitchen environment, leading to faster service and higher customer satisfaction.",
    imageSrc: "/products/product-24.png",
    link: "kitchen-display-system-kds",
    inStock: true,
    tags: ["pos accessories", "kitchen display system", "restaurant tech"],
  },
  {
    name: "Star Micronics SP700 Kitchen Printer",
    description:
      "The Star Micronics SP700 is a high-speed, impact kitchen printer engineered to thrive in the demanding environment of a professional kitchen. Built to handle the heat, humidity, and grease, its clam-shell, splash-proof design ensures exceptional reliability and easy paper loading. As an impact printer, it uses a ribbon to print, making it ideal for environments where thermal paper might be affected by heat sources. The SP700 provides clear, legible printing for kitchen orders and can even print in two colors to highlight special requests or modifiers, making it the workhorse printer of choice for kitchens everywhere.",
    imageSrc: "/products/product-25.png",
    link: "star-kitchen-printer-sp700",
    inStock: true,
    tags: ["pos accessories", "kitchen printer", "restaurant tech"],
  },
  {
    name: "Star Micronics TSP100 futurePRNT Ethernet Receipt Printer",
    description:
      "The Star Micronics TSP100 Ethernet is a high-performance thermal receipt printer designed for reliability and speed at the front-of-house. As a market-leading choice, it offers fast, crisp receipt printing and features an easy 'drop-in and print' paper loading system. Its key feature is the direct Ethernet (LAN) connection, which allows it to be seamlessly integrated into your network and shared by multiple POS terminals. The TSP100 is known for its all-in-one-box solution, including all necessary cables and a suite of `futurePRNT` software tools for creating custom coupons and marketing materials directly on your receipts.",
    imageSrc: "/products/product-26.png",
    link: "star-printer-tsp100-ethernet",
    inStock: true,
    tags: ["pos accessories", "receipt printer", "network devices"],
  },
  {
    name: "Ingenico Moby/5500 Mobile Card Reader",
    description:
      "The Ingenico Moby/5500 is a compact, versatile, and highly secure mobile card reader designed for modern commerce. This mPOS (mobile Point of Sale) device empowers you to accept payments anywhere by connecting wirelessly to a smartphone or tablet. It processes all major payment types, including EMV chip cards, traditional magstripe, and NFC/contactless payments like Apple Pay and Google Pay. With its robust, PCI-certified security and lightweight design, the Moby/5500 is the perfect solution for mobile businesses, delivery services, pop-up shops, and for line-busting in busy retail environments.",
    imageSrc: "/products/product-27.png",
    link: "ingenico-moby-5500-card-reader",
    inStock: true,
    tags: ["credit card terminals", "pos accessories", "mobile payments"],
  },
  {
    name: "Dejavoo Z6 Countertop Payment Terminal",
    description:
      "The Dejavoo Z6 is a sleek and reliable countertop payment terminal designed for secure and efficient transaction processing. It is an ideal solution for small to medium-sized businesses, including retail stores, salons, and professional services, that require a dependable, hard-wired payment solution. The Z6 supports all modern payment methods, including EMV chip, NFC/contactless, and magstripe, all processed through a secure and stable IP or dial-up connection. Its user-friendly interface and straightforward functionality make it an easy-to-use and cost-effective choice for any merchant.",
    imageSrc: "/products/product-28.png",
    link: "dejavoo-z6",
    inStock: true,
    tags: ["credit card terminals", "pos system"],
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
                Figure Pos
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                Figure Pos helps you track and improve your posture with ease.
                Designed for comfort and efficiency, it offers real-time
                feedback to encourage healthy posture habits throughout your
                day.
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
                src="/figure-pos-collage.png"
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
        title="Figure POS"
        totalInitialProducts={figurePosProducts.length}
        initialProducts={figurePosProducts}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}

export default page;
