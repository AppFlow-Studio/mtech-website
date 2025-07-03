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
    title: "Quick & Easy Checkout",
    imageSrc: "/quick-checkout.jpg",
    description:
      "Long lines and full carts during busy hours no longer have to mean delays. Our POS solution delivers a breakthrough in retail efficiency with its lightning-fast checkout. Designed with an intuitive interface and engineered for rapid processing, it ensures your team can handle high traffic effortlessly and elevates every customer's shopping experience.",
    features: [
      {
        name: "Rapid Checkout",
        detail:
          "Transform your checkout process with powerful, high-speed technology that makes long lines a thing of the past-even during busy periods.",
      },
      {
        name: "User-Friendly Interface",
        detail:
          "Benefit from an interface so intuitive that it minimizes the need for extensive training, allowing your team to focus on what matters most.",
      },
      {
        name: "Superior Customer Experience",
        detail:
          "Ensure each customer enjoys a smooth, efficient transaction, resulting in shorter wait times and higher satisfaction rates.",
      },
      {
        name: "Optimized Efficiency",
        detail:
          "Enable your staff to perform transactions with exceptional speed and precision, boosting productivity when it counts",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    title: "Built for Everyone. Streamlined and Smooth",
    imageSrc: "/customer-engagement.jpg",
    description:
      "More than a corner store it's the heartbeat of your neighborhood, a warm gathering spot where friends meet, families shop side by side, and every visit strengthens our community bond.",
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
