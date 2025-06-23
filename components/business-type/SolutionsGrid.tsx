// components/SolutionsGrid.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

// --- Data for the solution cards ---
const solutionsData = [
  {
    title: "24/7 operation demands...",
    description:
      "As gas stations cater to drivers round the clock, our loss prevention feature offers peace of mind with continuous monitori...",
    imageSrc: "/solution-gas-station.png",
    link: "/solutions/24-7-operations",
  },
  {
    title: "Evolve with confidence!",
    description:
      "With gas stations expanding their offerings beyond fuel, SuperSonic has you covered every step of the way from...",
    imageSrc: "/solution-analytics.png",
    link: "/solutions/evolve",
  },
  {
    title: "Beyond Fuel",
    description:
      "Gas stations have evolved beyond just selling fuel. Many now offer convenience stores, car wash services, food and bev...",
    imageSrc: "/solution-beyond-fuel.png",
    link: "/solutions/beyond-fuel",
  },
  {
    title: "24/7 Operations Secured...",
    description:
      "Many gas stations operate 24/7, catering to drivers at any time of day or night, and our monitoring ensures your assets stay...",
    imageSrc: "/solution-retail.png",
    link: "/solutions/security",
  },
];

const SolutionsGrid = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Responsive Grid for Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutionsData.map((solution, index) => (
            <div className="group block">
              <Image
                src={solution.imageSrc}
                alt={solution.title}
                width={400} // Defines aspect ratio
                height={550} // Defines aspect ratio (adjust if needed)
                className="
                  w-full h-auto rounded-2xl shadow-lg
                  transition-all duration-300 
                  group-hover:shadow-2xl group-hover:scale-105
                "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsGrid;
