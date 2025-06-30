"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";

// --- Data for the POS system cards ---
// This structure makes it easy to manage all content from one place.
const posSystemsData = [
  {
    name: "Supersonic POS",
    imageSrc: "/products/pos-supersonic.png",
    link: "/products/supersonic-pos",
    features: [
      "Supersonic Pos Bundle",
      "Supersonic Touch Screen",
      "Router",
      "POE Switch",
      "Cash Drawer",
      "More",
    ],
  },
  {
    name: "Figure POS",
    imageSrc: "/products/pos-figure.png",
    link: "/products/figure-pos",
    features: [
      "Receipt Printer",
      "Kitchen Printer",
      "Card Reader Option 1",
      "Card Reader Option 2",
      "Cash Drawer",
      "More",
    ],
  },
  {
    name: "On The Fly POS",
    imageSrc: "/products/pos-onthefly.png",
    link: "/products/on-the-fly-pos",
    features: [
      "Cash Drawer",
      "Pin Pad",
      "Receipt Printer",
      "Kitchen Printer",
      "Single Screen",
      "More",
    ],
  },
  {
    name: "Clover POS",
    imageSrc: "/products/pos-clover.png",
    link: "/products/clover",
    features: [
      "Clover Flex",
      "Clover Go",
      "Clover Mini",
      "Clover Station Duo",
      "Clover Station Solo",
      "More",
    ],
  },
];

const PosSystems = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white">
          Our POS Systems
        </h2>

        {/* Responsive Grid for Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {posSystemsData.map((system) => (
            <div
              key={system.name}
              className="
              flex flex-col bg-[#E6E7E7] dark:bg-[#231A30] 
              rounded-2xl shadow-lg overflow-hidden
            "
            >
              {/* Image Container */}
              <div className="p-6 bg-white m-4 rounded-2xl">
                <Image
                  src={system.imageSrc}
                  alt={`Image of ${system.name}`}
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain aspect-[4/3]"
                />
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-2xl text-center text-gray-800 dark:text-gray-100">
                  {system.name}
                </h3>

                <Link
                  href={system.link}
                  className="inline-flex items-center justify-center gap-2 mt-4 w-full
                  px-6 py-3 rounded-full font-semibold bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white
                  transition-colors duration-300"
                >
                  Go to POS <ChevronRight className="h-5 w-5" />
                </Link>

                {/* Features List */}
                <ul className="mt-6 space-y-3">
                  {system.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-500 dark:text-purple-400 flex-shrink-0 fill-[#D7CBEE]" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PosSystems;
