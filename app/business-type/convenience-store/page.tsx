import FeatureSlider from "@/components/business-type/FeatureSlider";
import Contact from "@/components/Contact";
import { Slide } from "@/lib/types";

const sliderData: Slide[] = [
  {
    imageSrc: "/smart-scales.jpg",
    title: "Smart Scales help you measure the way that makes sense",
    description:
      "Efficient inventory management starts with the right tools. Our POS provides smart scale solutions to keep your business running smoothly.",
    features: [
      {
        name: "Integrated Scanner/Scales",
        detail: "Reduce wait times by combining scanning and weighing.",
      },
      {
        name: "Standalone Scales",
        detail: "Let customers weigh goods wherever works best for you.",
      },
      {
        name: "Deli Scales",
        detail: "Ensure consistent and accurate pricing for deli products.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    imageSrc: "/inventory-management.jpg",
    title: "Streamlined Store Management",
    description: "Our POS system makes running a busy butcher shop effortless.",
    features: [
      {
        name: "Manage orders from everywhere using one system, whether it's your counter, phone, or online.",
      },
      {
        name: "Quick and on-demand access to all your businesses metrics.",
      },
      {
        name: "Smart order management sends orders straight to where they're needed, letting you focus on delivering the perfect experience for your customers.",
      },
    ],
    cta: "Get a Demo",
  },
  {
    imageSrc: "/employee-management.jpg",
    title: "Employee Management & Security",
    description:
      "Empower your staff and protect your business with robust employee management and security features. From easy scheduling to advanced access controls, keep your store running smoothly and securely.",
    features: [
      {
        name: "Role-Based Access",
        detail:
          "Assign permissions to staff based on their roles to ensure sensitive data stays protected",
      },
      {
        name: "Time Tracking",
        detail:
          "Monitor employee hours and attendance with built-in time clock features.",
      },
      {
        name: "Shift Scheduling",
        detail: "Simplify shift planning and reduce scheduling conflicts.",
      },
      {
        name: "Activity Logs",
        detail:
          "Track important actions and changes for better accountability.",
      },
    ],
    cta: "Get a Demo",
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
              A Convenience Store is a small retail business that offers a wide
              range of everyday items in a quick and accessible format.
              Typically open for extended hours or 24/7, these stores provide
              essential products such as snacks, beverages, tobacco, lottery
              tickets, household goods, over-the-counter medications, and basic
              groceries.
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
