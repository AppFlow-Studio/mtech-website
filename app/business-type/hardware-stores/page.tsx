import FeatureSlider from "@/components/business-type/FeatureSlider";
import Contact from "@/components/Contact";
import { Slide } from "@/lib/types";

const sliderData: Slide[] = [
  {
    imageSrc: "/hardware-store-inventory.jpg",
    title: "Take Control of Your Inventory",
    description:
      "Our POS system is designed to simplify inventory management, helping you stay stocked, stay organized, and stay ready.",
    features: [
      {
        name: "Real-Time Tracking",
        detail:
          "Keep an eye on inventory levels and product movement effortlessly.",
      },
      {
        name: "Automated Reordering",
        detail: "Prevent out-of-stock issues with automated restock triggers.",
      },
      {
        name: "Custom Alerts",
        detail:
          "Set up low-stock, expiry, and fast-seller alerts tailored to your needs.",
      },
      {
        name: "Improve Accuracy",
        detail: "Reduce human error and optimize inventory performance.",
      },
      {
        name: "Stay in Control",
        detail:
          "Proactively manage inventory and avoid unnecessary disruptions.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    imageSrc: "/hardware-store-staff.jpg",
    title: "Fortify Your Retail Defense with Advanced Loss Prevention",
    description:
      "Safeguard your store from theft, fraud, and shrinkage with the powerful security features built into our POS system.",
    features: [
      {
        name: " Staff Controls",
        detail: "Manage who can do what with customizable access levels.",
      },
      {
        name: " Real-Time Tracking",
        detail: "Keep tabs on every transaction as it happens.",
      },
      {
        name: "Security Camera Integration",
        detail: "Sync surveillance systems with your POS for full visibility.",
      },
      {
        name: "Loss Prevention Features",
        detail: "Cut shrinkage and keep your business profitable.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    title: "Empower Your Hardware Store with Smart Solutions",
    imageSrc: "/hardware-store-interior.jpg",
    description:
      "From tools to paint to plumbing supplies, your hardware store is a community hub for DIYers and pros alike. Our POS system helps you manage complex inventory, speed up checkout, and deliver expert service every time.",
    features: [
      {
        name: "Bulk Item Management",
        detail: "Easily track and sell items by weight, length, or quantity.",
      },
      {
        name: "Customer Accounts",
        detail:
          "Offer trade accounts and track purchase history for loyal customers.",
      },
      {
        name: "Barcode & Label Printing",
        detail: "Print custom labels for shelves and products on demand.",
      },
      {
        name: "Expert Service Tools",
        detail:
          "Equip your staff with quick lookup and product info at the register.",
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
              Hardware Stores
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Hardware Stores are specialized retail outlets that offer tools,
              building materials, plumbing supplies, electrical components,
              paint, fasteners, and home improvement products. Serving both DIY
              customers and professional contractors, hardware stores are a
              go-to destination for repair, renovation, and maintenance needs.
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
