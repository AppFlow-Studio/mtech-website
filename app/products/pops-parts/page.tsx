import ProductGridLayout from "@/components/ProductGridLayout";
import { Product } from "@/lib/types";
import Image from "next/image";

const popsPartsProducts: Product[] = [
  {
    name: "Nautilus Hyosung ATM Topper Bracket",
    description:
      "Securely mount your ATM topper with this genuine Nautilus Hyosung ATM Topper Bracket. It features an angled top design, making it the perfect fit for popular ATM models like the NH2600 and Halo II. Using the correct bracket is essential for a stable and secure installation of your topper, which is a key element for increasing your ATM's visibility and brand presence. This durable, precisely-engineered bracket ensures that your signage remains safely in place, providing a professional and lasting finish to your machine.",
    imageSrc: "/products/product-82.png",
    link: "nautilus-hyosung-atm-topper-bracket-2",
    inStock: true,
    tags: ["atm parts", "atm signage"],
  },
  {
    name: "LCD Assembly with Inverter Board",
    description:
      "This is a complete, all-in-one LCD Assembly replacement part for Hyosung 1800SE and MX 4000W model ATMs. The unit is a critical component that includes not only the LCD panel itself but also the necessary I/F (inverter) board, which powers the screen's backlight. Purchasing the entire assembly is the most reliable way to fix a dim, flickering, or non-working display, as it ensures all parts are compatible and working together. Restore your ATM's screen to its original brightness and clarity with this essential repair unit.",
    imageSrc: "/products/product-83.png",
    link: "lcd-assembly-if-board-inverter-2",
    inStock: true,
    tags: ["atm parts", "pos parts"],
  },
  {
    name: 'Genmega and Hantle 7" Color LCD',
    description:
      "This replacement 7-inch Color LCD is a high-quality display compatible with a range of Genmega and Hantle ATMs, including the 1700W, G1900, and GT3000 models. A clear and functioning display is vital for customer interaction, guiding users through their transactions efficiently. If your current screen is damaged, dim, or unreadable, this replacement part will restore the visual quality of your machine, ensuring a professional appearance and a positive user experience. It is a fundamental component for maintaining the operational health of your ATM.",
    imageSrc: "/products/product-84.png",
    link: "genmega-and-hantle-7-color-lcd-2",
    inStock: true,
    tags: ["atm parts"],
  },
  {
    name: "Hyosung 1800SE LCD Screen",
    description:
      "This product is a replacement LCD screen panel specifically for Nautilus Hyosung ATMs, with confirmed compatibility for the MX4000W and NH1800SE models. This is the screen component only, making it a cost-effective choice for repairs where the display glass is cracked or the pixels are faulty, but the backlight and inverter board are still functioning correctly. By replacing only the damaged screen, you can restore your ATM's display to perfect condition without the cost of a full assembly, ensuring clear visibility for all customer transactions.",
    imageSrc: "/products/product-85.png",
    link: "hyosung-1800se-lcd-screen-2",
    inStock: true,
    tags: ["atm parts"],
  },
  {
    name: "Hyosung 1K New Style CDU Side Cover",
    description:
      "Ensure the protection and longevity of your cash dispenser with the Hyosung 1K New Style CDU Side Cover. This is a genuine OEM part (S4310000340) designed to perfectly fit the side of the 1,000-note Cash Dispensing Unit (CDU) on newer Hyosung ATM models. This cover is not just cosmetic; it serves the important function of protecting the intricate internal mechanisms of the CDU from dust, debris, and potential interference. Using authentic parts guarantees a correct fit and helps maintain the security and reliability of your machine.",
    imageSrc: "/products/product-86.png",
    link: "hyosung-1k-new-style-cdu-side-cover-2",
    inStock: true,
    tags: ["atm parts"],
  },
  {
    name: "Hyosung Rubber Note Pick Wheel",
    description:
      "Maintain the flawless performance of your ATM's cash dispenser with this replacement Hyosung Rubber Note Pick Wheel. This essential part is compatible with a broad array of Hyosung ATMs such as the HALO II, MX5200SE, MX5200S, and MX5600 series. The pick wheel's rubber surface provides the necessary friction to accurately separate and feed single banknotes during a transaction. Replacing worn-out wheels is a key preventative maintenance step to avoid frustrating note jams and ensure consistent, reliable cash dispensing for your customers.",
    imageSrc: "/products/product-87.png",
    link: "hyosung-rubber-note-pick-wheel-2",
    inStock: true,
    tags: ["atm parts"],
  },
  {
    name: "Genmega GT5000 ATM Series",
    description:
      "Genmega introduces the GT5000 series, a through-the-wall ATM that masterfully combines high performance with economic value. This machine is engineered for settings that demand robust functionality, such as financial institutions and busy retail locations. It features a large, user-friendly 15-inch display and high-capacity cash dispensing capabilities, all enclosed in a secure, weather-resistant chassis designed for rear-loading. The GT5000 is the ideal choice for businesses seeking a bank-grade ATM experience without the premium price tag.",
    imageSrc: "/products/product-88.png",
    link: "genmega-gt5000-atm-series-3",
    inStock: true,
    tags: ["atm machines"],
  },
  {
    name: "Hyosung Halo II Rubber Function Pad",
    description:
      "Restore full functionality to your Halo II ATM with this replacement Rubber Function Pad (Part Number S4960000344). This pad contains the eight soft-touch function keys that flank the main display, which are used to make transaction selections. Over time, the original pad can become worn or unresponsive due to frequent use. Installing this new, genuine Hyosung part will bring back the crisp, tactile response of the buttons, ensuring your customers can navigate the ATM's interface with ease and precision.",
    imageSrc: "/products/product-89.png",
    link: "hyosung-halo-ii-rubber-function-pad-2",
    inStock: true,
    tags: ["atm parts"],
  },
  {
    name: "Hyosung Upper Fascia Bezel Unit for Halo II",
    description:
      "Refresh the appearance of your Halo II ATM with this genuine Hyosung Upper Fascia Bezel Unit (Part Number S4570002531). This part is the primary upper plastic housing that frames the screen and keypad, and is a major component of the Halo II's signature sleek design. It is the perfect replacement for a unit that has become cracked, heavily scratched, or damaged, instantly improving the machine's aesthetic appeal. Using an official Hyosung part ensures a seamless fit and restores the ATM to its original, professional look.",
    imageSrc: "/products/product-90.png",
    link: "hyosung-upper-fascia-bezel-unit-2",
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
                POPS Parts
              </h1>
              <p
                className="
                mt-6 leading-relaxed
                text-gray-600 dark:text-gray-300
                max-w-xl mx-auto lg:mx-0
              "
              >
                POS (Point of Sale) Parts are essential components used to
                maintain, upgrade, or repair point-of-sale systems in retail,
                hospitality, and service environments. This category includes
                items such as receipt printer parts, cash drawer components,
                barcode scanner accessories, touch screen replacements, power
                adapters.
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
        title="POPS Parts"
        totalInitialProducts={popsPartsProducts.length}
        initialProducts={popsPartsProducts}
      />
    </>
  );
}

export default page;
