import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { motion, AnimatePresence, Variants } from "framer-motion";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

const CategoryPillsScroller = () => {
  const categories = [
    {
      name: "POS System",
      image: "/pos-system.png",
      title: "POS System",
      link: `/products/area-of-speciality?data=${encodeURIComponent(
        JSON.stringify({ tags: ["pos system"] })
      )}`,
    },
    {
      name: "ATM Machines",
      image: "/atm-machines.png",
      title: "ATM Machines",
      link: `/products/area-of-speciality?data=${encodeURIComponent(
        JSON.stringify({ tags: ["atm machines"] })
      )}`,
    },
    {
      name: "ATM Parts",
      image: "/atm-parts.png",
      title: "ATM Parts & Components",
      link: `/products/area-of-speciality?data=${encodeURIComponent(
        JSON.stringify({ tags: ["atm parts"] })
      )}`,
    },
    {
      name: "POS Parts",
      image: "/pos-parts.png",
      title: "POS Parts & Accessories",
      link: `/products/area-of-speciality?data=${encodeURIComponent(
        JSON.stringify({ tags: ["pos parts"] })
      )}`,
    },
    {
      name: "POS Accessories",
      image: "/pos-accessories.png",
      title: "POS Accessories",
      link: `/products/area-of-speciality?data=${encodeURIComponent(
        JSON.stringify({ tags: ["pos accessories"] })
      )}`,
    },
    {
      name: "Scales",
      image: "/digital-scales.png",
      title: "Digital Scales",
      link: `/products/area-of-speciality?data=${encodeURIComponent(
        JSON.stringify({ tags: ["scales"] })
      )}`,
    },
    {
      name: "ATM Signage",
      image: "/atm-signage.png",
      title: "ATM Signage Solutions",
      link: `/products/area-of-speciality?data=${encodeURIComponent(
        JSON.stringify({ tags: ["atm signage"] })
      )}`,
    },
    {
      name: "ATM Cards",
      image: "/credit-card-terminals.png",
      title: "ATM Card Terminals",
      link: `/products/area-of-speciality?data=${encodeURIComponent(
        JSON.stringify({ tags: ["credit card terminals"] })
      )}`,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<Slider | null>(null);

  const handleCategoryClick = (category: string) => {
    console.log(`Clicked on: ${category}`);

    // Find the index of the clicked category
    const categoryIndex = categories.findIndex((cat) => cat.name === category);

    if (categoryIndex !== -1 && sliderRef.current) {
      // Calculate the direction to always go left to right
      const currentIndex = currentSlide % categories.length;
      let targetIndex = categoryIndex;

      // If target is behind current position, add categories length to go forward
      if (targetIndex < currentIndex) {
        targetIndex = categoryIndex + categories.length;
      }

      // Navigate to the clicked category (always left to right)
      sliderRef.current.slickGoTo(targetIndex);
    }
  };

  // Get the current active category (leftmost visible)
  const activeCategory = categories[currentSlide % categories.length];

  // Animation variants for the expanded pill
  const expandedPillVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -100,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        // duration: 0.2,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
    enter: {
      opacity: 0,
      x: -100,
      scale: 0.9,
    },
  };

  // Animation variants for regular pills
  const pillVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  // Progress bar animation variants
  const progressBarVariants: Variants = {
    initial: {
      width: "0%",
    },
    animate: {
      width: "100%",
      transition: {
        duration: 4.4, // adjusted to match the autoplay speed and transition animation
        ease: "linear",
      },
    },
    paused: {
      transition: {
        duration: 0,
      },
    },
  };

  // React Slick Settings
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    slidesToScroll: 1,
    pauseOnHover: true,
    autoplaySpeed: 5000,
    speed: 500,
    cssEase: "ease-in-out",
    beforeChange: (current: any, next: React.SetStateAction<number>) => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentSlide(next);
        setIsVisible(true);
      }, 200);
    },
    slidesToShow: 6,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div className="relative py-2 sm:pb-3 h-full flex flex-col">
      {/* Fixed Positioned Active Pill */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`expanded-${activeCategory.name}`}
          variants={expandedPillVariants}
          initial="enter"
          animate={isVisible ? "visible" : "exit"}
          exit="exit"
          className="absolute top-0 left-0 z-10
            bg-[#FFFFFF80] backdrop-blur-md rounded-xl sm:rounded-2xl 
            p-3 sm:p-4 lg:p-6 border border-white/20 
            w-36 xs:w-40 sm:w-48 md:w-60 lg:w-80 flex-shrink-0 overflow-hidden"
        >
          <motion.h3
            className="text-white text-xs xs:text-sm sm:text-base lg:text-lg xl:text-xl font-semibold mb-1 xs:mb-2 sm:mb-3 lg:mb-4 text-center sm:text-left"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeCategory.title}
          </motion.h3>
          <motion.div
            className="rounded-lg bg-[#B4ADB8] p-1 xs:p-2 sm:p-3 lg:p-4 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.div
              className="mb-1 xs:mb-2 sm:mb-3 lg:mb-4 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <img
                src={activeCategory.image}
                alt={activeCategory.title}
                className="w-full h-auto rounded-md sm:rounded-lg object-contain max-h-16 xs:max-h-20 sm:max-h-24 lg:max-h-32"
              />
            </motion.div>
            <Link
              href={activeCategory.link}
              onClick={() => handleCategoryClick(activeCategory.name)}
              className="w-full bg-gradient-to-r from-[#662CB2] to-[#2C134C] text-white 
              text-[10px] xs:text-xs sm:text-sm lg:text-base py-1 xs:py-1.5 sm:py-2.5 lg:py-3 
              px-2 xs:px-3 sm:px-4 rounded-full 
              font-semibold hover:from-purple-700 hover:to-blue-700 
              transform hover:scale-105 transition-all duration-200 lg:shadow-md text-center"
            >
              Shop Now
            </Link>
          </motion.div>

          {/* Animated Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-2 z-50 bg-white/20 rounded-b-xl sm:rounded-b-2xl overflow-hidden">
            <motion.div
              key={`progress-${activeCategory.name}-${isVisible}`}
              className="h-full bg-gradient-to-r from-[#662CB2] to-[#2C134C]"
              variants={progressBarVariants}
              initial="initial"
              animate={isVisible && !isHovered ? "animate" : "paused"}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider with Regular Pills - Skip the currently active category - Positioned at bottom */}
      <div
        className="mt-auto pt-24 xs:pt-28 sm:pt-32 md:pt-36 lg:pt-40 ml-0 sm:ml-24 lg:ml-52"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Slider {...settings} ref={sliderRef}>
          {categories.map((category, index) => (
            <div key={category.name} className="px-1">
              {index === currentSlide % categories.length ? (
                // Skip/hide the currently active category pill
                <></>
              ) : (
                // Regular Pills - only show non-active categories
                <motion.button
                  variants={pillVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleCategoryClick(category.name)}
                  className="bg-[#8B848C] backdrop-blur-sm text-[#F0F3FD] 
                    text-[10px] xs:text-xs sm:text-sm px-2 xs:px-3 sm:px-4 lg:px-6 
                    py-1 xs:py-1.5 sm:py-2 lg:py-3 rounded-full w-full
                    font-medium border border-white/30 hover:bg-white/30 
                    transition-all duration-200 whitespace-nowrap m-1"
                >
                  {category.name}
                </motion.button>
              )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CategoryPillsScroller;
