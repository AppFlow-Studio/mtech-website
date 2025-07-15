import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const atmTopperProducts: Product[] = [
  {
    name: "High Bright Topper with Blue Graphics",
    description:
      "Make your ATM impossible to miss with this High Bright Topper featuring attractive blue graphics. This illuminated sign is designed to sit on top of your ATM, increasing its height and visibility across any retail or event space. The 'high bright' illumination ensures it stands out even in brightly lit environments, drawing customer attention effectively. The package includes the necessary power cable for a straightforward connection to the system's power supply, making it an easy-to-install upgrade that can significantly boost machine awareness and usage.",
    imageSrc: "/products/product-79.png",
    link: "high-bright-topper-with-blue-graphics",
    inStock: true,
    tags: ["atm parts", "atm signage"],
  },
  {
    name: "Digital Media Topper II with Flat Base",
    description:
      "Transform your ATM into a dynamic advertising platform with the Digital Media Topper II. This modern topper features a digital screen on a stable flat base, allowing you to display customized advertisements, promotions, and information about your business and its products. It's a powerful tool for cross-selling and up-selling to a captive audience, turning your ATM from a simple cash dispenser into a revenue-generating marketing asset. Engage customers and drive sales with vibrant, eye-catching digital content right at the point of service.",
    imageSrc: "/products/product-80.png",
    link: "digital-media-topper-ii-with-flat-base",
    inStock: true,
    tags: ["atm parts", "atm signage"],
  },
  {
    name: "New Revision Standard Topper",
    description:
      "This New Revision Standard Topper is an updated OEM component designed for various Genmega and Hyosung ATM models. Measuring 19x17x7 inches, this topper provides a clean, professional look and essential signage space for your machine. It is important to note the compatibility requirements; for example, when using this topper on a Nautilus Hyosung NH1800SE model (Revision 10 or lower), a specific Rev 10 Topper Bracket is required for proper installation. This ensures a secure and correct fit, maintaining the intended design and stability of the ATM.",
    imageSrc: "/products/product-81.png",
    link: "new-revision-standard-topper",
    inStock: true,
    tags: ["atm parts", "atm signage"],
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
                ATM TOPPER
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                The ATM Topper is a high-visibility signage solution designed to
                draw attention to your ATM and boost foot traffic. Ideal for
                indoor or outdoor use, it enhances visibility with bright,
                customizable messaging that can promote your brand, advertise
                services, or highlight the availability of cash withdrawals.
                Easy to install and built for durability, the ATM Topper helps
                maximize your ATM’s impact and customer engagement.
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
        title="ATM TOPPER"
        totalProducts={atmTopperProducts.length}
        products={atmTopperProducts}
      />
    </>
  );
}

export default page;
