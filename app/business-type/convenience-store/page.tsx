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
      {
        name: "Extra 1",
        detail: "Lorem ipsum",
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
      {
        name: "Extra 1",
        detail: "Lorem ipsum",
      },
    ],
    cta: "Get a Demo",
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
