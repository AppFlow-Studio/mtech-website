"use client";
import React, { useState, useEffect } from "react";
import Searchbar from "./Searchbar";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  //List of categories
  const categories = [
    "POS System",
    "ATM Machines",
    "ATM Parts",
    "POS Parts",
    "POS Accessories",
    "Scales",
    "ATM Signage",
    "ATM Cards",
  ];

  const handleCategoryClick = (category: string) => {
    console.log("Category clicked:", category);
  };

  const handleShopNow = () => {
    console.log("Shop Now clicked for Credit Card Terminals");
  };

  return (
    <div className="relative min-h-screen overflow-hidden mx-2 sm:mx-4 lg:mx-6 rounded-2xl mt-4">
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
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 lg:pt-0">
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

        {/* Bottom Section - Unified Layout */}
        <div className="pb-4 sm:pb-6 lg:pb-8 px-2 sm:px-4 lg:px-6">
          <div className="max-w-full mx-auto">
            <div className="flex flex-row items-end gap-3 sm:gap-4 lg:gap-6">
              {/* Credit Card Terminal Card Wrapper */}
              <div
                className={`transform transition-all duration-1000 delay-700 ease-out 
                  ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10"
                  } 
                  bg-[#FFFFFF80] backdrop-blur-md rounded-xl sm:rounded-2xl 
                  p-3 sm:p-4 lg:p-6 border border-white/20 
                  w-36 xs:w-40 sm:w-48 md:w-60 lg:w-80 flex-shrink-0`}
              >
                <h3 className="text-white text-sm sm:text-base lg:text-lg xl:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4 text-center sm:text-left">
                  Credit Card Terminals
                </h3>
                <div className="rounded-lg bg-[#B4ADB8] p-2 sm:p-3 lg:p-4 flex flex-col items-center">
                  <div className="mb-2 sm:mb-3 lg:mb-4">
                    <img
                      src="/credit-card-terminals.png"
                      alt="Credit Card Terminals"
                      className="w-full h-auto rounded-md sm:rounded-lg object-contain"
                    />
                  </div>
                  <button
                    onClick={handleShopNow}
                    className="w-full bg-gradient-to-r from-[#662CB2] to-[#2C134C] text-white 
                    text-xs sm:text-sm lg:text-base py-2 sm:py-2.5 lg:py-3 px-3 sm:px-4 rounded-full 
                    font-semibold hover:from-purple-700 hover:to-blue-700 
                    transform hover:scale-105 transition-all duration-200 lg:shadow-md"
                  >
                    Shop Now
                  </button>
                </div>
              </div>

              {/* Categories Pills Wrapper */}
              <div
                className={`transform transition-all duration-1000 delay-900 ease-out 
                  ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-10"
                  } 
                  flex-1 overflow-hidden`}
              >
                {/* Scrollable container for pills. Pills start from the left. Scrollbar hidden. */}
                <div className="flex overflow-x-auto gap-2 sm:gap-3 lg:gap-4 py-2 sm:pb-3 justify-start hide-scrollbar">
                  {categories.map((category, index) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="bg-[#8B848C] backdrop-blur-sm text-[#F0F3FD] 
                        text-xs sm:text-sm px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-full 
                        font-medium border border-white/30 hover:bg-white/30 
                        hover:scale-105 transition-all duration-200 whitespace-nowrap flex-shrink-0"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
