"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { FeatureTabsProps } from "@/lib/types";

const FeatureTabs: React.FC<FeatureTabsProps> = ({ features }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!features || features.length === 0) {
    return null;
  }

  const activeFeature = features[activeIndex];

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Main container with a minimum height for desktop */}
        <div className="flex flex-col lg:flex-row gap-6 lg:min-h-[450px]">
          <div
            className="
            w-full lg:w-3/5 p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col justify-between bg-[#672AB233] dark:bg-[#672AB233]"
          >
            <div className="flex flex-1 flex-col md:flex-row gap-2 lg:gap-4">
              {/* Top: Text content */}
              <div className="w-full md:min-w-2/3 lg:min-w-1/2 flex flex-col">
                <span className="text-xl font-bold text-gray-700 dark:text-gray-400">
                  {`0${activeIndex + 1}`}
                </span>
                <h3 className="text-base font-normal my-2 text-[#2C3551] dark:text-white">
                  {activeFeature.title}
                </h3>
                <div className="min-h-[120px] lg:min-h-[100px]">
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                    {activeFeature.description}
                  </p>
                </div>
              </div>
              <div className="h-auto">
                <Image
                  src={activeFeature.imageSrc}
                  alt={activeFeature.title}
                  width={600}
                  height={400}
                  className="rounded-xl object-cover h-full"
                />
              </div>
            </div>
            {/* Middle: Button */}
            <div className="mt-8">
              <button
                onClick={handleNext}
                className="flex items-center justify-center gap-2 w-32 px-4 py-3 rounded-full bg-gradient-to-b from-[#662CB2] to-[#2C134C] text-white font-semibold shadow-md hover:bg-indigo-700 transition-all duration-300"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* === Right Side (Inactive Tabs) === */}
          <div className="w-full lg:w-2/5 flex flex-row gap-3 lg:gap-4 overflow-x-auto pb-4 lg:pb-0">
            {features.map((feature, index) => {
              if (index === activeIndex) return null;

              return (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className="
                    p-4 rounded-2xl transition-all duration-300
                    flex flex-col items-center justify-between
                    w-20 flex-shrink-0 lg:w-auto lg:flex-grow
                    bg-[#672AB233] hover:bg-[#E9E5F5]
                    dark:bg-[#672AB233] dark:hover:bg-[#382E5A] flex-1 lg:flex-none
                  "
                >
                  <span className="font-bold text-gray-700 dark:text-gray-400">
                    {`0${index + 1}`}
                  </span>

                  <div className="h-full flex items-center justify-center">
                    <span
                      className="
                      font-semibold text-sm whitespace-nowrap
                      [writing-mode:vertical-rl] rotate-180
                      text-gray-800 dark:text-white
                    "
                    >
                      {feature.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureTabs;
