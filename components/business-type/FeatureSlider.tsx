"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// --- React-Slick Imports ---
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Slide } from "@/lib/types";

interface FeatureSliderProps {
  sliderData: Slide[];
}

const FeatureSlider = ({ sliderData }: FeatureSliderProps) => {
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isHeightCalculated, setIsHeightCalculated] = useState(false);

  // --- Settings object for the react-slick slider ---
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "300px",
    slidesToShow: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    dots: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
        },
      },
    ],
  };

  useEffect(() => {
    const calculateMaxHeight = () => {
      let max = 0;

      // First, reset all heights to auto
      slideRefs.current.forEach((ref) => {
        if (ref) {
          ref.style.height = "auto";
        }
      });

      // Then measure all heights
      slideRefs.current.forEach((ref) => {
        if (ref) {
          const height = ref.offsetHeight;
          if (height > max) {
            max = height;
          }
        }
      });

      if (max > 0) {
        setMaxHeight(max);
        setIsHeightCalculated(true);
      }
    };

    // Multiple attempts to ensure proper calculation
    const timeouts = [
      setTimeout(calculateMaxHeight, 100),
      setTimeout(calculateMaxHeight, 500),
      setTimeout(calculateMaxHeight, 1000),
    ];

    const handleResize = () => {
      setIsHeightCalculated(false);
      setTimeout(calculateMaxHeight, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      timeouts.forEach(clearTimeout);
    };
  }, [sliderData]);

  return (
    <div className="mt-16">
      <style jsx>{`
        .equal-height-slide {
          height: ${isHeightCalculated ? `${maxHeight}px` : "auto"} !important;
        }
      `}</style>

      <Slider {...settings}>
        {sliderData.map((slide, index) => (
          <div key={index} className="px-2 md:px-4">
            <div
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              className={`p-8 rounded-2xl flex flex-col bg-[#FAFAFA] dark:bg-[#231A30] shadow-xl ${
                isHeightCalculated ? "equal-height-slide" : ""
              }`}
            >
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={slide.imageSrc}
                  alt={slide.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h3 className="text-3xl font-bold mt-6 text-gray-900 dark:text-white">
                {slide.title}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {slide.description}
              </p>
              <ul className="mt-6 space-y-4">
                {slide.features.map((feature) => (
                  <li
                    key={feature.name}
                    className="flex flex-col items-start gap-1 pb-4 border-b border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-white fill-[#662CB2]" />
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {feature.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-8">
                      {feature.detail}
                    </p>
                  </li>
                ))}
              </ul>
              {slide.cta && (
                <button className="w-fit mt-8 py-3 px-4 rounded-full font-semibold text-white bg-gradient-to-r from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 hover:opacity-90 transition-opacity">
                  {slide.cta}
                </button>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeatureSlider;
