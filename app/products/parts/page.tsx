import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const partsProducts: Product[] = [
  {
    name: "Nautilus Hyosung ATM Topper Bracket",
    description:
      "This Nautilus Hyosung ATM Topper Bracket is an essential mounting component for securely attaching a topper to your machine. Specifically designed with an angled top, this bracket is compatible with models like the NH2600 and HALO II, ensuring a perfect fit and a professional appearance. Using the correct OEM bracket is crucial for maintaining the stability and safety of your ATM topper, preventing it from becoming loose or damaged. This durable bracket provides the proper support for your signage, enhancing your ATM's visibility and branding.",
    imageSrc: "/products/product-82.png",
    link: "nautilus-hyosung-atm-topper-bracket",
    inStock: true,
    tags: ["atm parts", "atm signage"],
  },
  {
    name: "LCD Assembly with Inverter Board",
    description:
      "This complete LCD Assembly is a critical replacement part for Nautilus Hyosung 1800SE and MX 4000W ATM models. The assembly includes both the LCD screen and the vital I/F (inverter) board, which is responsible for powering the screen's backlight. Replacing the entire unit ensures compatibility and simplifies the repair process, restoring a clear and bright display for your customers. A functioning screen is essential for user interaction, making this assembly a key component for maintaining your ATM's operational readiness and professional appearance.",
    imageSrc: "/products/product-83.png",
    link: "lcd-assembly-if-board-inverter",
    inStock: true,
    tags: ["atm parts", "pos parts"],
  },
  {
    name: 'Genmega and Hantle 7" Color LCD',
    description:
      "Restore the visual interface of your ATM with this 7-inch Color LCD screen. This high-quality display is a direct replacement part for several popular Genmega and Hantle ATM models, including the 1700W, G1900, and GT3000. A crisp, bright, and fully functional screen is crucial for guiding customers through transactions smoothly and providing a professional user experience. This component ensures that on-screen prompts and information are clearly visible, which is essential for the day-to-day operation and reliability of your ATM.",
    imageSrc: "/products/product-84.png",
    link: "genmega-and-hantle-7-color-lcd",
    inStock: true,
    tags: ["atm parts"],
  },
  {
    name: "Hyosung 1800SE LCD Screen",
    description:
      "This is a replacement LCD screen specifically designed for use with Nautilus Hyosung ATM models, including the widely-used NH1800SE and the through-the-wall MX4000W. This listing is for the LCD screen panel only and does not include the inverter board or other assembly components. It is the perfect solution for when the screen itself is cracked, scratched, or has dead pixels, but the surrounding electronics are still functional. Swapping out just the screen is a cost-effective repair to bring your ATM's display back to its original clarity.",
    imageSrc: "/products/product-85.png",
    link: "hyosung-1800se-lcd-screen",
    inStock: true,
    tags: ["atm parts"],
  },
  {
    name: "Hyosung 1K New Style CDU Side Cover",
    description:
      "This Hyosung 1K New Style CDU Side Cover is an authentic OEM replacement part, identified by part number S4310000340. This cover is designed to fit and protect the side of the 1,000-note capacity Cash Dispensing Unit (CDU) in various newer-style Hyosung ATMs. It plays a crucial role in shielding the internal mechanisms of the dispenser from dust, debris, and potential tampering. Using genuine replacement parts like this side cover ensures a perfect fit and maintains the integrity and security of your ATM's cash handling components.",
    imageSrc: "/products/product-86.png",
    link: "hyosung-1k-new-style-cdu-side-cover",
    inStock: true,
    tags: ["atm parts"],
  },
  {
    name: "Hyosung Rubber Note Pick Wheel",
    description:
      "The Hyosung Rubber Note Pick Wheel is a small but critical component in the cash dispensing unit of many Hyosung ATMs. This high-friction rubber wheel is responsible for accurately picking and separating individual banknotes from the stack in the cassette. It is compatible with a wide range of popular models, including the HALO II, MX5200SE, MX5600, and more. Over time, these wheels can wear down, leading to note jams and dispensing errors. Replacing them is a common and essential maintenance task to ensure the smooth and reliable operation of your ATM.",
    imageSrc: "/products/product-87.png",
    link: "hyosung-rubber-note-pick-wheel",
    inStock: true,
    tags: ["atm parts"],
  },
  {
    name: "Genmega GT5000 ATM Series",
    description:
      "The Genmega GT5000 series represents a leap forward in through-the-wall ATM technology, offering high-end features at an accessible price. This rear-load ATM is designed for financial institutions and high-volume retail locations, featuring a large 15-inch display, high-capacity dispensers, and robust security. It's an economical yet powerful solution for businesses looking to provide a full suite of self-service options, including cash withdrawal and potentially deposit automation. The GT5000 delivers reliable, secure, around-the-clock service, making it a valuable asset for any location.",
    imageSrc: "/products/product-88.png",
    link: "genmega-gt5000-atm-series-2",
    inStock: true,
    tags: ["atm machines"],
  },
  {
    name: "Hyosung Halo II Rubber Function Pad",
    description:
      "This is a genuine replacement Rubber Function Pad for the Nautilus Hyosung Halo II ATM, identified by part number S4960000344. This pad contains the rubber buttons for the function keys located on either side of the ATM's screen. Constant use can cause these buttons to wear out, crack, or become unresponsive, hindering the customer's ability to navigate transaction menus. Replacing the function pad restores the tactile feel and responsiveness of these keys, ensuring a smooth and frustration-free user experience on your Halo II machine.",
    imageSrc: "/products/product-89.png",
    link: "hyosung-halo-ii-rubber-function-pad",
    inStock: true,
    tags: ["atm parts"],
  },
  {
    name: "Hyosung Upper Fascia Bezel Unit for Halo II",
    description:
      "This is the official Hyosung Upper Fascia Bezel Unit specifically designed for the Halo II ATM model, with part number S4570002531. This component is the upper plastic frame or 'bezel' that surrounds the screen and other interface elements, forming a key part of the ATM's distinctive and stylish appearance. It is an essential part for repairs where the original fascia has been cracked, scratched, or otherwise damaged. Using this genuine OEM part ensures a perfect fit and restores the sleek, factory-fresh look of your Halo II machine.",
    imageSrc: "/products/product-90.png",
    link: "hyosung-upper-fascia-bezel-unit",
    inStock: true,
    tags: ["atm parts"],
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
                Parts
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
                src="/parts-collage.png"
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
        title="Parts"
        totalProducts={partsProducts.length}
        products={partsProducts}
      />
    </>
  );
}

export default page;
