// components/StationManagement.tsx
"use client";

import Image from "next/image";

// --- Data for the feature cards ---
const featureData = [
  {
    title: "Enhanced Customer Experience",
    description:
      "Simplify checkout, offer promotions, and keep customers coming back for more.",
    imageSrc: "/feature-customer-experience.png",
  },
  {
    title: "Inventory Management",
    description:
      "Stay stocked with real-time tracking to prevent shortages and optimize product availability.",
    imageSrc: "/feature-inventory.png",
  },
  {
    title: "Data Analytics",
    description:
      "Gain insights into sales trends and customer preferences to drive targeted marketing and boost revenue.",
    imageSrc: "/feature-analytics.png",
  },
];

const StationManagement = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
          All-in-One Station Management Platform
        </h2>

        {/* Responsive Grid for Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureData.map((feature, index) => (
            <div
              key={index}
              className="
                rounded-2xl shadow-lg overflow-hidden
                transition-transform duration-300 hover:-translate-y-1
              "
            >
              {/* Image Container */}
              <div className="relative w-full aspect-video">
                <Image
                  src={feature.imageSrc}
                  alt={feature.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>

              {/* Text Content */}
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="mt-12 text-center">
          <button
            className="
                inline-flex items-center justify-center 
                px-8 py-4 rounded-full font-semibold text-white
                bg-gradient-to-r from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 hover:opacity-90 transition-opacity duration-300 shadow-lg
            "
          >
            Read More
          </button>
        </div>
      </div>
    </section>
  );
};

export default StationManagement;
