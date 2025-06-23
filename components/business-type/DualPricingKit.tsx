"use client";

import { ImageLinkCardProps } from "@/lib/types"; // Assuming your type is here
import ImageLinkCard from "../ImageLinkCard";

// --- Data for the page (You can import this from another file) ---
const mainCardData: ImageLinkCardProps = {
  title: "Large businesses",
  imageSrc: "/products/dual-pricing-tag-gun.png",
  link: "#",
};
const gridCardsData: ImageLinkCardProps[] = [
  {
    title: "Prices Tags",
    imageSrc: "/products/price-tags-roll.png",
    link: "#",
  },
  { title: "Ink Rolls", imageSrc: "/products/ink-rolls.png", link: "#" },
  {
    title: "Portable Thermal Printer",
    imageSrc: "/products/portable-printer.png",
    link: "#",
  },
  {
    title: "MTech Dual Pricing",
    imageSrc: "/products/mtech-dual-pricing.png",
    link: "#",
  },
];

const DualPricingKit = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* 
          Main Grid Container:
          - A single column by default (for mobile).
          - A 3-column grid on desktop to create the specific layout.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* --- Left Column (Text + Main Card) --- */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Dual Pricing Starter Kit
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                The Dual Pricing Starter Kit is an all-in-one solution designed
                to help merchants implement a compliant and transparent dual
                pricing system — displaying both cash and card prices at the
                point of sale.
              </p>
            </div>
            {/* Render the single main card */}
            <ImageLinkCard
              title={mainCardData.title}
              imageSrc={mainCardData.imageSrc}
              link={mainCardData.link}
            />
          </div>

          {/* --- Right Column (Grid of other cards) --- */}
          {/* This nested grid handles the 2x2 layout on desktop */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {gridCardsData.map((card) => (
              <ImageLinkCard
                key={card.title}
                title={card.title}
                imageSrc={card.imageSrc}
                link={card.link}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DualPricingKit;
