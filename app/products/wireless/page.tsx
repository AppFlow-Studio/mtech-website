import ProductGridLayout from "@/components/ProductGridLayout";
import HardwareSection from "@/components/HardwareSection";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import type { Product } from "@/lib/types";

const wirelessProducts: Product[] = [
  {
    name: "1K Hyosung Cassette Needs Repair",
    default_price: 100,
    subscription: false,
    id: "1k-hyosung-cassette-needs-repair-2",
    description:
      "This 1K Hyosung cash cassette, designed to hold 1,000 banknotes, is available for purchase in an 'as-is' condition, requiring repair before it can be put into service. This item is an excellent opportunity for ATM service professionals or businesses with in-house technical skills to acquire a genuine Hyosung cassette at a significantly lower cost. It can be refurbished for use as a primary or spare cassette, or used as a source for valuable salvageable parts, making it a smart and economical choice for ATM fleet maintenance.",
    imageSrc: "/products/product-10.png",
    link: "1k-hyosung-cassette-needs-repair-2",
    inStock: true,
    tags: ["atm parts"],
  },
  {
    name: "2K Hyosung Cassette Needs Repair",
    default_price: 100,
    subscription: false,
    id: "2k-hyosung-cassette-needs-repair-2",
    description:
      "This is a 2,000-note capacity cash cassette for Hyosung ATMs, ideal for locations with high transaction volumes. The unit is being sold in an 'as-is' state and requires repair to become fully operational. For ATM technicians and service companies, this product represents a cost-effective way to obtain a high-capacity cassette. Whether you intend to repair the unit for active use or dismantle it for essential spare parts, this offering provides significant value and helps in managing the operational costs of maintaining your ATM network.",
    imageSrc: "/products/product-11.png",
    link: "2k-hyosung-cassette-needs-repair-2",
    inStock: true,
    tags: ["atm parts"],
  },
  {
    name: "A Series 6128 Electronic Lock",
    default_price: 100,
    subscription: false,
    id: "a-series-6128-electronic-lock-2",
    description:
      "The A Series 6128 Electronic Lock is a high-security, user-friendly solution designed to safeguard the valuable contents of ATMs and other secure containers. It provides a major security enhancement over traditional key-based locks, offering features like programmable user codes, audit trails to track access, and protection against tampering. Its robust construction ensures reliability and long-term performance, giving business owners peace of mind and greater control over their assets. This electronic lock is a critical component for any modern, secure cash management system.",
    imageSrc: "/products/product-12.png",
    link: "a-series-6128-electronic-lock-2",
    inStock: true,
    tags: ["atm parts", "pos parts"],
  },
  {
    name: "Antenna for Wireless Units",
    default_price: 100,
    subscription: false,
    id: "antenna-for-wireless-units-2",
    description:
      "Improve the performance and reliability of your wireless ATMs and POS terminals with this specialized antenna. It is designed to enhance signal strength, ensuring a stable and consistent connection to cellular or Wi-Fi networks. In locations where network signals are weak or inconsistent, this antenna can be the difference between a successful transaction and a frustrating service interruption. It is an easy-to-install and essential accessory for maximizing uptime and ensuring your wireless devices operate at their full potential.",
    imageSrc: "/products/product-13.png",
    link: "antenna-for-wireless-units-2",
    inStock: true,
    tags: ["network devices"],
  },
];

const totalProducts = 4;

export default function Products() {
  return (
    <>
      <ProductGridLayout
        title="Our Products"
        totalInitialProducts={totalProducts}
        initialProducts={wirelessProducts}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}
