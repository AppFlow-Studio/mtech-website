import FeatureSlider from "@/components/business-type/FeatureSlider";
import Contact from "@/components/Contact";
import { Slide } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import BusinessTypePage from "@/components/business-type/BusinessTypePage";

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

async function page() {
  const convenienceStore = await client.fetch(
    `*[_type == "BUSINESS_TYPES" && business_type_link == "/convenience-store"]`
  );
  if (!convenienceStore) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Convenience Store not found
        </h1>
      </div>
    )
  }
  return (
    <BusinessTypePage businessType={convenienceStore[0]} />
  )
}
export default page;
