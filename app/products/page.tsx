import ProductGridLayout from "@/components/ProductGridLayout";
import HardwareSection from "@/components/HardwareSection";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import type { Product } from "@/lib/types";

const mockProducts: Product[] = [
  {
    name: "1K HYOSUNG CASSETTE NEEDS...",
    description: "1K HYOSUNG CASSETTE NEEDS TO BE REPAIRED, SOLD AS IS...",
    imageSrc: "/products/product-1.png",
    link: "#",
    inStock: false,
  },
  {
    name: "2K HYOSUNG CASSETTE NEEDS...",
    description: "2K HYOSUNG CASSETTE NEEDS TO BE REPAIRED, SOLD AS IS...",
    imageSrc: "/products/product-2.png",
    link: "#",
    inStock: true,
  },
  {
    name: "A SERIES 6128 ELECTRONIC LO...",
    description:
      "THE SERIES 6128 ELECTRONIC LOCK IS A HIGH-SECURITY, USER-FRIENDLY SOLU...",
    imageSrc: "/products/product-3.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ANTENNA FOR WIRELESS UNITS",
    description:
      "THE ANTENNA FOR WIRELESS UNITS IS DESIGNED TO ENHANCE SIGNAL STRE...",
    imageSrc: "/products/product-4.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ATM LED SIGN",
    description:
      "AN LED SIGN THAT ENSURES YOUR CUSTOMER WILL FIND YOUR MACHINE...",
    imageSrc: "/products/product-5.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ATM RECEIPT PAPER (8 Rolls)",
    description: "8 ROLL CASE OF HYOSUNG RECEIPT PAPER",
    imageSrc: "/products/product-6.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ATM AVAILABLE INSIDE SIGN",
    description: "ATM AVAILABLE INSIDE COROPLAST SIGN",
    imageSrc: "/products/product-7.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ATM SIGN",
    description:
      "ATM $10 BILLS COROPLAST SIGN. THE ATM SIGN IS DESIGNED TO CLEARLY IN...",
    imageSrc: "/products/product-8.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ATM Sign",
    description:
      "ATM $10 & $20 BILLS COROPLAST SIGN. SUITABLE FOR INDOOR OR OUTDOOR U...",
    imageSrc: "/products/product-9.png",
    link: "#",
    inStock: true,
  },
  {
    name: "High Bright Topper w/ Blue Grap...",
    description:
      "Includes power cable to system power supply; use P/N: 130211081 to extend it to...",
    imageSrc: "/products/product-79.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Digital Media Topper II w/ Flat Ba...",
    description:
      "Digital Media Topper II w/ Flat Base Great for Advertising your business and products",
    imageSrc: "/products/product-80.png",
    link: "#",
    inStock: true,
  },
  {
    name: "NEW REVISION STANDARD TOP...",
    description:
      "19x17x7 (When Using On Rev 10 or Lower NH1800SE Requires Rev 10 Topper Brack...",
    imageSrc: "/products/product-81.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Clover Go Reader and Dock Bundle",
    description:
      "Pair this portable credit card reader with your phone to take payments wherever yo...",
    imageSrc: "/products/product-30.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Clover Station DUO",
    description:
      "The Clover Station Duo is a powerful, dual-screen point-of-sale system designed for...",
    imageSrc: "/products/product-31.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Clover Station DUO WIFI Bundle...",
    description:
      "The Clover Station Duo WIFI Bundle – No Cash Drawer offers a complete, modern P...",
    imageSrc: "/products/product-32.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Clover Station Solo",
    description:
      "The Clover Station Solo is a powerful all-in-one POS system designed for businesses...",
    imageSrc: "/products/product-33.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Clover Station Solo Bundle- No...",
    description:
      "The Clover Station Solo Bundle – No Cash Drawer is a sleek, all-in-one POS solution...",
    imageSrc: "/products/product-34.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Clover Mini",
    description:
      "The Clover Mini is a compact, powerful POS device that offers full functionality in...",
    imageSrc: "/products/product-35.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Clover Flex WiFi",
    description:
      "The Clover Flex WiFi is a portable, all-in-one POS device designed for mobility and con...",
    imageSrc: "/products/product-36.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo P1 Desktop Android",
    description:
      'Features that keep your business moving forward: Large 5" HD touch screen, Power...',
    imageSrc: "/products/product-37.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo P3 Handheld Wireless A...",
    description:
      'Features that keep your business moving forward: Large 5" HD touch screen, Power...',
    imageSrc: "/products/product-38.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo P5 Handheld/PIN Pad W...",
    description:
      'Features that keep your business moving forward: Large 5" HD touch screen, Power...',
    imageSrc: "/products/product-39.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo QD1 Rigid Wireless Andr...",
    description:
      'Features that keep your business moving forward: Large 5" HD touch screen, Power...',
    imageSrc: "/products/product-40.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo P1 Desktop Android",
    description:
      'Features that keep your business moving forward: Large 5" HD touch screen, Power...',
    imageSrc: "/products/product-41.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo QD3 mPOS Android",
    description:
      'Features that keep your business moving forward: Large 5" HD touch screen, Power...',
    imageSrc: "/products/product-42.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo QD4 Desktop Android",
    description:
      "Features that keep your business moving forward: Lightning fast, Ethernet & WiFi, B...",
    imageSrc: "/products/product-43.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Dejavoo QD5 PIN Pad Android",
    description:
      "Features that keep your business moving forward: Fast and secure tap-and-go pay...",
    imageSrc: "/products/product-44.png",
    link: "#",
    inStock: true,
  },
  {
    name: "DEJAVOO Z3 PINPAD WITH NO...",
    description:
      "Features that keep your business moving forward: Built in NFC Contactless Reader ,...",
    imageSrc: "/products/product-45.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ONYX WALL MOUNT",
    description:
      "Introducing the all new Onyx-W ATM. The Onyx-W can be installed securely as a Wal...",
    imageSrc: "/products/product-67.png",
    link: "#",
    inStock: true,
  },
  {
    name: "G2500 ATM SERIES",
    description:
      "Designed for retail and off-premise locations, the G2500 comes loaded with...",
    imageSrc: "/products/product-68.png",
    link: "#",
    inStock: true,
  },
  {
    name: "G2500P ATM SERIES",
    description:
      "Building on the great reputation of the G2500 the G2500P model...",
    imageSrc: "/products/product-69.png",
    link: "#",
    inStock: true,
  },
  {
    name: "GENMEGA ONYX SERIES ATM",
    description: "A new, modern, upscale design containing a host...",
    imageSrc: "/products/product-70.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ONYX-P ATM SERIES",
    description: "Securely. We do not store credit card detai...",
    imageSrc: "/products/product-71.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Genmega GT3000 ATM Series",
    description:
      "Genmega introduces the GT3000 series through-the-wall ATM. Designed as a true...",
    imageSrc: "/products/product-72.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Genmega GT5000 ATM Series",
    description:
      "Genmega introduces the GTD000 series ATM. A high performance yet economical...",
    imageSrc: "/products/product-73.png",
    link: "#",
    inStock: true,
  },
  {
    name: "GENMEGA NOVA",
    description:
      "Genmega is proud to announce the new NOVA retail ATM. With a world of new ser...",
    imageSrc: "/products/product-74.png",
    link: "#",
    inStock: true,
  },
  {
    name: "HYOSUNG HALO II",
    description:
      "The HALO II offers a unique, sleek design perfect for locations ranging from small c...",
    imageSrc: "/products/product-75.png",
    link: "#",
    inStock: true,
  },
  {
    name: "HYOSUNG 5200SE",
    description:
      "The 5200 provides a choice of either an affordable Microsoft® Windows® CE 6.0 p...",
    imageSrc: "/products/product-76.png",
    link: "#",
    inStock: true,
  },
  {
    name: "HYOSUNG FORCE MX 2800SE",
    description:
      "Hyosung is dedicated to making technology work for the humans who use...",
    imageSrc: "/products/product-77.png",
    link: "#",
    inStock: true,
  },
  {
    name: "HYOSUNG FORCE TTW 4K",
    description:
      "The 2800T brings you through-the-wall replacement and enhancement...",
    imageSrc: "/products/product-78.png",
    link: "#",
    inStock: true,
  },
  {
    name: "INGENICO MOBY 5500 CARD R...",
    description:
      "Accepts all card-based payments: EMV, magstripe and NFC/contactless PIN-on-M...",
    imageSrc: "/products/product-61.png",
    link: "#",
    inStock: true,
  },
  {
    name: "INGENICO LANE 3000 PIN PAD",
    description:
      "Robust design for even the most demanding situations High-end keypad fo...",
    imageSrc: "/products/product-62.png",
    link: "#",
    inStock: true,
  },
  {
    name: "On The Fly POS",
    description:
      "Best for Bar, Coffee Shop, Quick service, Pizzeria, Restaurant",
    imageSrc: "/products/product-29.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Nautilus Hyosung ATM Topper Br...",
    description:
      "Nautilus Hyosung ATM Topper Bracket Angled Top NH2600 Halo II...",
    imageSrc: "/products/product-82.png",
    link: "#",
    inStock: true,
  },
  {
    name: "LCD ASSEMBLY, I F BOARD (INV...",
    description:
      "The LCD Assembly with v/f (inverter) board for 1800SE and MX 4000W ATMS is a criti...",
    imageSrc: "/products/product-83.png",
    link: "#",
    inStock: true,
  },
  {
    name: 'GENMEGA AND HANTLE 7" Col...',
    description: 'GENMEGA AND HANTLE 7" Color LCD for 1700W, G1900 & GT3000',
    imageSrc: "/products/product-84.png",
    link: "#",
    inStock: true,
  },
  {
    name: "HYOSUNG, 1800SE LCD SCREEN",
    description:
      "HYOSUNG LCD SCREEN ONLY COMPATIBLE WITH MX4000W , NH1800SE...",
    imageSrc: "/products/product-85.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Hyosung 1K New Style CDU Side...",
    description:
      "Hyosung 1K New Style CDU Side Cover Part Number S4310000340...",
    imageSrc: "/products/product-86.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Hyosung Rubber Note Pick Wheel",
    description:
      "Compatible with HALO II, MX5200SE, MX5200S, MX5100T, MX5600L, MX560...",
    imageSrc: "/products/product-87.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Genmega GT5000 ATM Series",
    description:
      "Genmega introduces the GT5000 series ATM. A high performance yet economical...",
    imageSrc: "/products/product-88.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Hyosung Halo II Rubber Function Pad",
    description: "Hyosung Halo II Rubber Function Pad. Part Number S4960000344",
    imageSrc: "/products/product-89.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Hyosung Upper Fascia Bezel Unit...",
    description:
      "Hyosung Upper Fascia Bezel Unit For Halo II Part Number S4570002531",
    imageSrc: "/products/product-90.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Pax Aries 8",
    description:
      "The Aries8 is a next generation multi-functional tablet that serves a multitude of...",
    imageSrc: "/products/product-52.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Pax A35 Pin Pad",
    description:
      "Features our latest operating system, PAXBiz® powered by Android™ – Adheres...",
    imageSrc: "/products/product-53.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Pax A30 Pin Pad",
    description:
      "Equipped with a Cortex A53 processor, the A30 ensures swift transaction processing...",
    imageSrc: "/products/product-54.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Stand for Pax S300 & A35",
    description:
      "The Stand for PAX S300 & A35 provides a secure, professional mounting solution de...",
    imageSrc: "/products/product-55.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Stand PAX S300 Terminal",
    description:
      "The Stand for PAX S300 Terminal is a sturdy and reliable mounting solution desi...",
    imageSrc: "/products/product-56.png",
    link: "#",
    inStock: true,
  },
  {
    name: "PAX A60",
    description:
      "The A60 is a sleek and compact SmartMobile Pin Pad that delivers the hig...",
    imageSrc: "/products/product-57.png",
    link: "#",
    inStock: true,
  },
  {
    name: "PAX S300",
    description:
      "PAX's S300 is the latest integrated retail payment solution for retail merchants who...",
    imageSrc: "/products/product-58.png",
    link: "#",
    inStock: true,
  },
  {
    name: "PAX A920PRO",
    description:
      "The A920 Pro comes with a larger screen, faster performance, and an optional built-i...",
    imageSrc: "/products/product-59.png",
    link: "#",
    inStock: true,
  },
  {
    name: "PAX A80",
    description:
      "PAX’s A80, the most cost-effective in the A-series, is a powerful, game-changing coun...",
    imageSrc: "/products/product-60.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Nautilus Hyosung ATM Topper Br...",
    description:
      "Nautilus Hyosung ATM Topper Bracket Angled Top NH2600 Halo II...",
    imageSrc: "/products/product-82.png",
    link: "#",
    inStock: true,
  },
  {
    name: "LCD ASSEMBLY, I F BOARD (INV...",
    description:
      "The LCD Assembly with v/f (inverter) board for 1800SE and MX 4000W ATMS is a criti...",
    imageSrc: "/products/product-83.png",
    link: "#",
    inStock: true,
  },
  {
    name: 'GENMEGA AND HANTLE 7" Col...',
    description: 'GENMEGA AND HANTLE 7" Color LCD for 1700W, G1900 & GT3000',
    imageSrc: "/products/product-84.png",
    link: "#",
    inStock: true,
  },
  {
    name: "HYOSUNG, 1800SE LCD SCREEN",
    description:
      "HYOSUNG LCD SCREEN ONLY COMPATIBLE WITH MX4000W , NH1800SE...",
    imageSrc: "/products/product-85.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Hyosung 1K New Style CDU Side...",
    description:
      "Hyosung 1K New Style CDU Side Cover Part Number S4310000340...",
    imageSrc: "/products/product-86.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Hyosung Rubber Note Pick Wheel",
    description:
      "Compatible with HALO II, MX5200SE, MX5200S, MX5100T, MX5600L, MX560...",
    imageSrc: "/products/product-87.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Genmega GT5000 ATM Series",
    description:
      "Genmega introduces the GT5000 series ATM. A high performance yet economical...",
    imageSrc: "/products/product-88.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Hyosung Halo II Rubber Function Pad",
    description: "Hyosung Halo II Rubber Function Pad. Part Number S4960000344",
    imageSrc: "/products/product-89.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Hyosung Upper Fascia Bezel Unit...",
    description:
      "Hyosung Upper Fascia Bezel Unit For Halo II Part Number S4570002531",
    imageSrc: "/products/product-90.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Stand PAX S300 Terminal",
    description:
      "The Stand for PAX S300 Terminal offers a durable and ergonomic mounting solution...",
    imageSrc: "/products/product-63.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Stand Ingenico Lane 3000",
    description:
      "The Stand for Ingenico Lane 3000 is a secure and practical mounting solution de...",
    imageSrc: "/products/product-64.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Stand Dejavoo Z8-Z11 Terminals",
    description:
      "The Stand for Dejavoo Z8 and Z11 Terminals is a durable, space-saving solutio...",
    imageSrc: "/products/product-65.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Stand Valor ALL Terminals",
    description:
      "The Stand for Valor All Terminals is a versatile and secure mounting solution co...",
    imageSrc: "/products/product-66.png",
    link: "#",
    inStock: true,
  },
  {
    name: "SuperSonic POS",
    description:
      "Best for Grocery Deli, Supermarkets, Convenience Stores, Smoke Shops, Cloth...",
    imageSrc: "/products/product-14.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Mach X",
    description:
      "The Mach X Kiosk is a sleek and powerful 16-inch touchscreen self-service solution,...",
    imageSrc: "/products/product-15.png",
    link: "#",
    inStock: true,
  },
  {
    name: "SuperSonic Kiosk",
    description:
      "Best for Grocery Deli, Supermarkets, Convenience Stores, Smoke Shops, Cloth...",
    imageSrc: "/products/product-16.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Mach Flex",
    description:
      "The Mach Flex option is perfect for merchants who need a versatile and adap...",
    imageSrc: "/products/product-17.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Mach Mini Bundle",
    description:
      "The Mach Mini Bundle is an all-in-one, portable point-of-sale solution designed f...",
    imageSrc: "/products/product-18.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Touch Screen",
    description:
      "Best for Grocery Deli, Supermarkets, Convenience Stores, Smoke Shops, Cloth...",
    imageSrc: "/products/product-19.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Printer",
    description:
      "SuperSonic POS Highspeed Thermal TCP/IP Printer-v2 in POS bundle.",
    imageSrc: "/products/product-20.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Barcode Scanner",
    description:
      "Best for Grocery Deli, Supermarkets, Convenience Stores, Smoke Shops, Cloth...",
    imageSrc: "/products/product-21.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Supersonic Connect Box (Mini Pc)",
    description:
      "Best for Grocery Deli, Supermarkets, Convenience Stores, Smoke Shops, Cloth...",
    imageSrc: "/products/product-22.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Valor RCKT eMV mPOS Reader",
    description:
      "The RCKT is the perfect mobile payment solution. This mini portable payment devic...",
    imageSrc: "/products/product-46.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Valor VP550",
    description:
      "The RCKT is the perfect mobile payment solution. This mini portable payment devic...",
    imageSrc: "/products/product-47.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Stand Valor ALL Terminals",
    description:
      "The RCKT is the perfect mobile payment solution. This mini portable payment devic...",
    imageSrc: "/products/product-48.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Valor VP 300",
    description:
      "The RCKT is the perfect mobile payment solution. This mini portable payment devic...",
    imageSrc: "/products/product-49.png",
    link: "#",
    inStock: true,
  },
  {
    name: "Valor VP 100",
    description:
      "The mG-T30 offers precise and reliable weighing for a variety of business needs, l...",
    imageSrc: "/products/product-50.png",
    link: "#",
    inStock: true,
  },
  {
    name: "VALOR VL300 PIN PAD",
    description:
      "PCI-PTS 5.0 Certified PinPad, Signature Capture, Smart Tipping, Ethernet, USB an...",
    imageSrc: "/products/product-51.png",
    link: "#",
    inStock: true,
  },
  {
    name: "1K HYOSUNG CASSETTE NEEDS REPAIR",
    description: "1K HYOSUNG CASSETTE NEEDS TO BE REPAIRED, SOLD AS IS...",
    imageSrc: "/products/product-10.png",
    link: "#",
    inStock: true,
  },
  {
    name: "2K HYOSUNG CASSETTE NEEDS REPAIR",
    description: "2K HYOSUNG CASSETTE NEEDS TO BE REPAIRED, SOLD AS IS...",
    imageSrc: "/products/product-11.png",
    link: "#",
    inStock: true,
  },
  {
    name: "A SERIES 6128 ELECTRONIC LOCK",
    description:
      "THE SERIES 6128 ELECTRONIC LOCK IS A HIGH-SECURITY, USER-FRIENDLY SOLU...",
    imageSrc: "/products/product-12.png",
    link: "#",
    inStock: true,
  },
  {
    name: "ANTENNA FOR WIRELESS UNITS",
    description:
      "THE ANTENNA FOR WIRELESS UNITS IS DESIGNED TO ENHANCE SIGNAL STRE...",
    imageSrc: "/products/product-13.png",
    link: "#",
    inStock: true,
  },
];

const totalProducts = 123;

export default function Products() {
  return (
    <>
      <ProductGridLayout
        title="Our Products"
        totalProducts={totalProducts}
        products={mockProducts}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}
