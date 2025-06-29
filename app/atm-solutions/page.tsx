"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Contact from "@/components/Contact";

// --- Data for the solution cards ---
const solutionsData = [
  {
    title: "Large businesses",
    imageSrc: "/solutions/atm-large-business.png",
    link: "/dual-pricing/large-business",
  },
  {
    title: "Small and Midsize Businesses",
    imageSrc: "/solutions/atm-smb.png",
    link: "/dual-pricing/small-mid-businesses",
  },
  {
    title: "Solutions for Distributors",
    imageSrc: "/solutions/atm-distributors.png",
    link: "/dual-pricing/merchant-services",
  },
];

const AtmSolutions = () => {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
              ATM Solutions
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Our ATM solutions are designed to provide reliable, secure, and
              convenient cash access for your customers while generating
              additional revenue for your business.
            </p>
          </div>

          {/* Responsive Grid for Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutionsData.map((solution) => (
              <Link
                key={solution.title}
                href={solution.link}
                className="group block h-full"
              >
                <div
                  className="
                relative bg-[#E6E7E7] dark:bg-[#231A30] 
                rounded-2xl shadow-lg overflow-hidden h-full
                flex flex-col
                transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
              "
                >
                  {/* Image Container */}
                  <div className="m-4 rounded-lg bg-[#F0F3FD] flex-shrink-0">
                    <Image
                      src={solution.imageSrc}
                      alt={solution.title}
                      objectFit="cover"
                      width={300}
                      height={200}
                      className="w-full h-auto object-cover rounded-xl aspect-[4/3]"
                    />
                  </div>

                  {/* Footer Section - This will be pushed to bottom */}
                  <div className="p-5 flex justify-between items-center mt-auto">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 flex-1 pr-4">
                      {solution.title}
                    </h3>
                    <div
                      className="
                    flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 flex-shrink-0
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
      <Contact />
    </>
  );
};

export default AtmSolutions;
