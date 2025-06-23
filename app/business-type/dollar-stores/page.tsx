import FeatureSlider from "@/components/business-type/FeatureSlider";
import Contact from "@/components/Contact";
import { Slide } from "@/lib/types";

const sliderData: Slide[] = [
  {
    imageSrc: "/smart-scales.jpg",
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
    imageSrc: "/smart-scales.jpg",
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
    title: "Elevate Your Butcher Shop with our POS solutions",
    imageSrc: "/butcher-shop-pos.jpg",
    description:
      "Your butcher shop is so much more than just a business, it's a community staple where customers find the best cuts of meat. Take it to the next level with a POS that streamlines your operations without removing your authentic charm. Experience the perfect blend of tradition and modern efficiency with a POS system that simplifies sales, enhances customer service, and keeps your business running smoothly.",
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
              Dollar Stores
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Dollar Stores are retail outlets that specialize in offering a
              wide variety of everyday items at low, fixed-price points — often
              starting at just $1. These stores provide budget-friendly options
              for household goods, cleaning supplies, snacks, party items,
              seasonal décor, personal care products, school supplies, and more.
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
