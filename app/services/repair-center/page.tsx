"use client";

import Contact from "@/components/Contact";
import ImageLinkCard from "@/components/ImageLinkCard";
import { ImageLinkCardProps } from "@/lib/types";
const repairCenterCards: ImageLinkCardProps[] = [
  {
    title: "House Of Wings Testimonial",
    imageSrc: "/repair-house-of-wings.png",
    link: "/review",
  },
  {
    title: "Osos Pet Supply Testimonial",
    imageSrc: "/repair-pet-supply.png",
    link: "/review",
  },
];

const RepairCenter = () => {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
              Repair Center
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Our Repair Center offers professional, fast, and reliable repair
              services for a wide range of POS equipment and electronic devices.
              From barcode scanners and receipt printers to payment terminals,
              touchscreens, and mini PCs, our certified technicians diagnose and
              repair hardware issues using quality parts and industry-best
              practices.
            </p>
          </div>

          {/* Responsive Grid for Cards */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {repairCenterCards.map((card) => (
              // Use the new component here
              <ImageLinkCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
};

export default RepairCenter;
