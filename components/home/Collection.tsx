"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Download, Flame } from "lucide-react";

// --- Data for the collection cards ---
const collectionData = [
  {
    title: "Credit Card Terminals",
    imageSrc: "/products/terminals.png",
    isNew: true,
    link: "/products/terminals",
  },
  {
    title: "ATM Machines",
    imageSrc: "/products/atm-machines.png",
    isNew: true,
    link: "/products/atm",
  },
  {
    title: "Network Devices",
    imageSrc: "/products/network-devices.png",
    isNew: true,
    link: "/products/networking",
  },
];

const Collection = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white">
          Best MTech Collection
        </h2>

        {/* Responsive Grid for Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionData.map((item, index) => (
            <Link key={index} href={item.link} className="group block">
              <div
                className="
                relative bg-[#E6E6E7] dark:bg-[#231A30]
                rounded-2xl shadow-lg overflow-hidden
                transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* "New" Tag */}
                {item.isNew && (
                  <div className="absolute top-6 left-5 z-10 flex items-center gap-1.5 bg-[#FB941B] text-white px-3 py-1 rounded-md text-sm">
                    New <Flame className="h-4 w-4 fill-white" />
                  </div>
                )}

                {/* Image Container */}
                <div className="p-4 bg-white m-4 rounded-lg ">
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-auto object-contain aspect-[4/3]"
                  />
                </div>

                {/* Footer Section */}
                <div className="p-5 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                    {item.title}
                  </h3>
                  <div
                    className="
                    flex items-center justify-center h-10 w-10 rounded-full 
                    bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white
                    transition-transform duration-300 group-hover:scale-110
                  "
                  >
                    <ChevronRight className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collection;
