import FeatureSlider from "@/components/business-type/FeatureSlider";
import Contact from "@/components/Contact";
import { Slide } from "@/lib/types";

const sliderData: Slide[] = [
  {
    imageSrc: "/smoke-shop.jpg",
    title: "ScanData Power: Elevate Your Smoke Shop Game",
    description:
      "Unlock the Full Power of ScanData Reporting: Seamlessly integrated with Altria and RJ Reynolds, our ScanData reporting transforms raw tobacco scans into game-changing intelligence. It’s more than just numbers, it’s your roadmap to operational excellence.",
    features: [
      {
        name: "Regulatory Compliance",
        detail: "Stay audit-ready with automated logs and built-in checks.",
      },
      {
        name: "Inventory Management",
        detail: "Track stock levels in real time to prevent costly stockouts.",
      },
      {
        name: "Price Accuracy",
        detail: "Ensure promotional and MSRP pricing is always spot on.",
      },
      {
        name: "Efficiency",
        detail: "Streamline reorder workflows and reduce manual tasks.",
      },
      {
        name: "Sales Analysis",
        detail: "Dive into performance trends and identify top-selling SKUs.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    imageSrc: "/smoke-shop-counter.jpg",
    title: "Protect Your Margins",
    description:
      "Defend against losses with our advanced security tools, ensuring every cent you earn stays right with you.",
    features: [
      {
        name: "Reduced Fees",
        detail: "Stop losing money to high rates.",
      },
      {
        name: "Boosted Profits",
        detail: "More earnings from every sale.",
      },
      {
        name: "Top-Quality Experience",
        detail: "Offer smooth, professional service without the high cost.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    title: "Premium Puff, Friendly Price. Your Style, Your Savings!",
    imageSrc: "/smoke-shop-shelve.jpg",
    description: "Catch Your Breath. Our POS System Drives Success.€",
    features: [],
  },
];

function page() {
  return (
    <>
      <section className="py-16 sm:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Smoke Shop
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              A Smoke Shop is a specialized retail store that offers a wide
              range of tobacco-related products and accessories. These shops
              typically carry items such as cigarettes, cigars, rolling papers,
              pipe tobacco, hookahs, vapes, e-liquids, lighters, grinders, and
              other smoking accessories.
            </p>
          </div>
        </div>
        <FeatureSlider sliderData={sliderData} />
      </section>
      <Contact />
    </>
  );
}

export default page;
