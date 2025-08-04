import ProductGridLayout from "@/components/ProductGridLayout";
import ProductHeroSection from "@/components/ProductHeroSection";
import PricingSection from "@/components/products/PricingSection";
import { Product } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import Image from "next/image";

const ingenicoProducts: Partial<Product>[] = [
  {
    name: "Ingenico Moby 5500 Card Reader",
    description:
      "The Ingenico Moby 5500 is a versatile and secure mobile point-of-sale (mPOS) card reader designed for modern commerce. It accepts all major card-based payment methods, including traditional magstripe, secure EMV chip cards, and convenient NFC/contactless payments. A standout feature is its 'PIN-on-Mobile' capability, which allows for secure PIN entry directly on a consumer-grade smartphone or tablet. This makes it an incredibly flexible and cost-effective solution for merchants who need to accept secure payments anywhere their business takes them.",
    imageSrc: "/products/product-61.png",
    link: "ingenico-moby-5500-card-reader",
    inStock: true,
    tags: ["credit card terminals", "pos accessories"],
  },
  {
    name: "Ingenico Lane 3000 PIN Pad",
    description:
      "The Ingenico Lane 3000 is a robust and reliable PIN pad designed to enhance the checkout process in even the most demanding retail environments. It features a high-end, durable keypad that provides a comfortable and secure PIN entry experience for customers. Its compact design saves counter space, while its fast processor ensures transactions are completed quickly. The Lane 3000 supports all modern payment methods, making it a versatile and long-lasting addition to any integrated point-of-sale system.",
    imageSrc: "/products/product-62.png",
    link: "ingenico-lane-3000-pin-pad",
    inStock: true,
    tags: ["credit card terminals", "pos accessories"],
  },
];

async function page() {
  const Ingenico = await client.fetch(
    `*[_type == "POS_SYSTEM_TYPES" && POS_System_Link == "/ingenico"]`
  );
  console.log(Ingenico);
  return (
    <>
      <ProductHeroSection
        title={Ingenico[0].POS_System_Header}
        description={Ingenico[0].POS_System_Description}
        image={Ingenico[0].POS_System_Image}
        ctaText="Buy Our Products"
      />
      <ProductGridLayout
        title="Ingenico"
        totalInitialProducts={Ingenico[0].POS_System_Items?.length || 0}
        initialProducts={Ingenico[0].POS_System_Items as Product[]}
      />
      <PricingSection pricingPlans={Ingenico[0].POS_System_Pricing_Plans} header={Ingenico[0].POS_System_Pricing_Header} description={Ingenico[0].POS_System_Pricing_Description} />
    </>
  );
}

export default page;
