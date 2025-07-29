import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const genmegaAtmProducts: Product[] = [
  {
    name: "Genmega Onyx-W Wall Mount ATM",
    description:
      "Introducing the innovative Onyx-W, a versatile ATM from Genmega that is specifically designed for secure wall-mounted applications. The Onyx-W can be installed as a traditional wall mount or as a sleek through-the-wall unit, making it an ideal choice for locations where floor space is limited but security cannot be compromised. It features the modern, high-end design of the Onyx series, combined with a heavy-gauge steel construction to ensure maximum durability and protection. This machine is perfect for providing 24/7 cash access in a compact and secure footprint.",
    imageSrc: "/products/product-67.png",
    link: "onyx-wall-mount",
    inStock: true,
    tags: ["atm machines", "atm parts"],
  },
  {
    name: "Genmega G2500 ATM Series",
    description:
      "The Genmega G2500 series is a top-tier ATM designed to meet the demands of retail and off-premise locations. This machine comes loaded with a host of premium features right out of the box, including a large 8-inch high-resolution LCD screen for easy viewing and a multi-color LED receipt paper indicator. Its modern, attractive design is built around a reliable and secure framework, ensuring high uptime and customer trust. The G2500 is an excellent choice for merchants looking for a stylish, feature-rich, and cost-effective ATM solution to drive foot traffic and revenue.",
    imageSrc: "/products/product-68.png",
    link: "g2500-atm-series",
    inStock: true,
    tags: ["atm machines"],
  },
  {
    name: "Genmega G2500P ATM Series",
    description:
      "The Genmega G2500P model builds upon the outstanding reputation of the standard G2500, adding an integrated printer cover for enhanced security and a sleeker profile. This feature helps protect the receipt paper and printer mechanism from tampering and the elements, making it an even better fit for busy retail and off-premise environments. The G2500P retains all the premium features of the series, including a large display and modern aesthetics, offering a robust, secure, and visually appealing ATM solution that delivers exceptional value and performance.",
    imageSrc: "/products/product-69.png",
    link: "g2500p-atm-series",
    inStock: true,
    tags: ["atm machines"],
  },
  {
    name: "Genmega Onyx Series ATM",
    description:
      "The Genmega Onyx series ATM is the epitome of modern, upscale design in the retail ATM market. This machine features a stunning 10.2-inch widescreen display, an optional lightbox for high-visibility branding, and a sleek, elegant finish that complements any high-end location. Beneath its stylish exterior, the Onyx houses a host of powerful features and robust security components, including a durable frame and a reliable cash dispenser. It's the perfect ATM for businesses that want to offer cash access without compromising on aesthetics or security.",
    imageSrc: "/products/product-70.png",
    link: "genmega-onyx-series-atm",
    inStock: true,
    tags: ["atm machines"],
  },
  {
    name: "Genmega Onyx-P ATM Series",
    description:
      "The Genmega Onyx-P series offers a unique and secure ATM solution by integrating a printer cover into its sleek, modern design. This model is ideal for locations requiring enhanced security and a more streamlined appearance, as the enclosed printer helps prevent paper jams and unauthorized access. The Onyx-P maintains the premium look and feel of the Onyx line, with its large display and high-end finishes, while providing an extra layer of physical protection for its components. It's a secure and stylish choice for discerning business owners.",
    imageSrc: "/products/product-71.png",
    link: "onyx-p-atm-series",
    inStock: true,
    tags: ["atm machines"],
  },
  {
    name: "Genmega GT3000 ATM Series",
    description:
      "Genmega's GT3000 series is a true through-the-wall ATM designed to provide convenient outdoor or vestibule cash access with the security of an interior-loaded machine. It's engineered for easy installation and service, offering a cost-effective solution for businesses like banks, credit unions, and retail centers that need a permanent, weather-resistant ATM. The GT3000 features a compact design that doesn't compromise on functionality, boasting a clear display, reliable dispenser, and robust security features to ensure dependable 24/7 service for your customers.",
    imageSrc: "/products/product-72.png",
    link: "genmega-gt3000-atm-series",
    inStock: true,
    tags: ["atm machines"],
  },
  {
    name: "Genmega GT5000 ATM Series",
    description:
      "The Genmega GT5000 series is a high-performance, rear-load, through-the-wall ATM that delivers advanced functionality at an economical price point. Designed for financial institutions and high-traffic retail locations, the GT5000 boasts a large 15-inch screen, high-capacity cash dispensers, and options for deposit automation. Its robust construction and comprehensive security features make it a reliable and secure choice for providing a full range of ATM services. The GT5000 combines the capabilities of a bank-grade machine with the value Genmega is known for.",
    imageSrc: "/products/product-73.png",
    link: "genmega-gt5000-atm-series",
    inStock: true,
    tags: ["atm machines"],
  },
  {
    name: "Genmega NOVA ATM",
    description:
      "Genmega proudly introduces the NOVA, a new retail ATM that sets a new standard for design and functionality. The NOVA features an industry-first, 17-inch vertically oriented touchscreen that offers a modern, smartphone-like user experience. This innovative interface opens up a world of new service possibilities, including dynamic marketing and interactive content. With its sleek lines, advanced features, and user-centric design, the Genmega NOVA is the future of retail ATMs, built to engage customers and drive more transactions.",
    imageSrc: "/products/product-74.png",
    link: "genmega-nova",
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
                Genmega ATM
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                Genmega's products are frequently developed with direct consumer
                feedback and collaboration. Genmega is a beneficial partner
                because of its ability to take a customer's idea or equipment
                need from concept to market and its openness to explore
                possibilities. With tens of thousands of ATMs and components
                installed and a team of engineers, developers, and technicians
                with decades of ATM experience, Genmega has designed everything
                while keeping the importance of having reliable equipment in
                ATMs.
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
                src="/genmega-atm-collage.png"
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
        title="Genmega ATM"
        totalInitialProducts={genmegaAtmProducts.length}
        initialProducts={genmegaAtmProducts}
      />
    </>
  );
}

export default page;
