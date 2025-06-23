import FeatureSlider from "@/components/business-type/FeatureSlider";
import Contact from "@/components/Contact";
import { Slide } from "@/lib/types";

const sliderData: Slide[] = [
  {
    title: "Inventory Management",
    imageSrc: "/inventory-management.png",
    description:
      "Handling diverse stock from perishables to daily essentials can be complex. Our POS system streamlines inventory tasks, letting you concentrate on growing your business.",
    features: [
      {
        name: "All Your Vendors, One Dashboard",
        detail: "Organize pricing, contacts, and deliveries in a single place.",
      },
      {
        name: "Smart Stock Alerts",
        detail: "Be notified the moment inventory dips below your set limits.",
      },
      {
        name: "Auto-Reorder Made Easy",
        detail:
          "Let the system handle fast-moving item restocks with no hassle.",
      },
      {
        name: "Easy PO Management",
        detail: "Create and approve orders without the usual friction.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    title: "Customer Engagement",
    imageSrc: "/customer-engagement.jpg",
    description:
      "Build lasting relationships with your customers through targeted loyalty programs, promotions, and personalized communication, all managed from one hub.",
    features: [
      {
        name: "Loyalty Programs",
        detail: "Reward your regulars and keep them coming back for more.",
      },
      {
        name: "Email & SMS Marketing",
        detail: "Send targeted offers and updates directly to your customers.",
      },
      {
        name: "Customer Profiles",
        detail:
          "Understand purchasing habits to offer personalized experiences.",
      },
      {
        name: "Gift Card Management",
        detail:
          "Boost sales and attract new customers with branded gift cards.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    title: "Quick & Easy Checkout",
    imageSrc: "/quick-checkout.jpg",
    description:
      "Long lines and full carts are no longer an issue. Our breakthrough in retail efficiency is designed and engineered for rapid processing.",
    features: [
      {
        name: "Rapid Checkout",
        detail:
          "Transform your checkout process to make long lines a thing of the past.",
      },
      {
        name: "User-Friendly Interface",
        detail:
          "Benefit from an interface so simple, your team can focus on what matters.",
      },
      {
        name: "Superior Customer Engagement",
        detail: "Ensure each customer enjoys higher satisfaction rates.",
      },
      {
        name: "Optimized Efficiency",
        detail:
          "Enable your staff to perform at a higher productivity, when it counts.",
      },
    ],
    cta: "Talk to an Expert",
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
              Convenience Store
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              We provide tailored solutions for convenience stores that keep
              operations running smoothly and customers coming back. From fast,
              reliable payment processing to integrated POS systems.
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
