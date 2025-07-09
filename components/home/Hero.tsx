"use client";
import React, { useState, useEffect } from "react";
import Searchbar from "./Searchbar";
import CategoryPillsScroller from "./CategoryPillsScroller";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative h-fit overflow-hidden mx-2 sm:mx-4 lg:mx-6 rounded-2xl mt-4">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/0_Payment_Mobile Payment.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/20"></div>{" "}
        {/* Slight overlay for contrast */}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col">
        {/* Hero Section */}
        <div className="py-8 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-full md:max-w-4xl lg:max-w-6xl mx-auto text-center">
            <div
              className={`transform transition-all duration-1000 ease-out ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 leading-tight">
                More Than Just Payment{" "}
                <span className="block md:inline">Solutions</span>
              </h1>
            </div>
            <div
              className={`transform transition-all duration-1000 delay-300 ease-out ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
                At MTech Distributors, we offer end-to-end payment solutions
                that enhance transaction security, improve operational
                efficiency, and provide tailored integration to meet the unique
                needs of your business. Experience seamless payment processing
                with added value beyond the basics.
              </p>
            </div>
            <Searchbar isVisible={isVisible} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pb-4 sm:pb-6 lg:pb-8 px-2 sm:px-4 lg:px-6 h-[290px] md:h-[370px] lg:h-[370px]">
          <CategoryPillsScroller />
        </div>
      </div>
    </div>
  );
};

export default Hero;
