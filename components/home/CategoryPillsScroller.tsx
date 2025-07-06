import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useAnimationControls,
  AnimatePresence,
  Variants,
} from "framer-motion";
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

  const slideDuration = 5000;
  const animationDuration = 800;
  const expandedDuration = 5000;
  const totalItems = categories.length;

  const [currentIndex, setCurrentIndex] = useState(totalItems);
  const [isExpanded, setIsExpanded] = useState(false);
  const controls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pillsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [offsetValue, setOffsetValue] = useState(40);

  const expandedCardWidth = 108;

  const tripleCategories = [...categories, ...categories, ...categories];

  // Progress bar animation variants
  const progressBarVariants: Variants = {
    initial: { width: "0%" },
    animate: {
      width: "100%",
      transition: {
        duration: expandedDuration / 1000,
        ease: "linear",
      },
    },
    paused: { width: "0%" },
  };

  useEffect(() => {
    // Update offset value based on screen size
    const updateOffset = () => {
      if (window.innerWidth < 640) {
        // Mobile
        setOffsetValue(40);
      } else if (window.innerWidth < 768) {
        // Small tablet
        setOffsetValue(50);
      } else {
        // Desktop
        setOffsetValue(110);
      }
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  useEffect(() => {
    if (totalItems <= 1) return;
    const timer = setInterval(() => {
      if (isExpanded) {
        setIsExpanded(false);
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
        }, 1000);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, slideDuration);
    return () => clearInterval(timer);
  }, [totalItems, isExpanded, slideDuration, currentIndex]);

  useEffect(() => {
    if (totalItems <= 1 || !containerRef.current) return;

    const targetPill = pillsRef.current[currentIndex];
    if (!targetPill) return;

    const targetPosition = -targetPill.offsetLeft + offsetValue;

    controls
      .start({
        x: targetPosition,
        transition: { ease: "easeInOut", duration: animationDuration / 1000 },
      })
      .then(() => {
        setIsExpanded(true);

        if (currentIndex >= totalItems * 2) {
          const newIndex = totalItems + (currentIndex % totalItems);
          const newTargetPill = pillsRef.current[newIndex];
          if (newTargetPill) {
            const newXPosition = -newTargetPill.offsetLeft + offsetValue;
            controls.set({ x: newXPosition });
            setCurrentIndex(newIndex);
          }
        }
      });
  }, [currentIndex, controls, totalItems, animationDuration, offsetValue]);

  useEffect(() => {
    if (!isExpanded) return;
    const collapseTimer = setTimeout(() => {
      setIsExpanded(false);
    }, expandedDuration);
    return () => clearTimeout(collapseTimer);
  }, [isExpanded, expandedDuration]);

  const handleShopNow = () => {
    const currentCategory = categories[currentIndex % totalItems];
    window.location.href = currentCategory.link;
  };

  const getPillTransform = (index: number) => {
    if (isExpanded && index > currentIndex) {
      return window.innerWidth < 640 ? 60 : expandedCardWidth;
    }
    return 0;
  };

  const handlePillClick = (index: number) => {
    if (index === currentIndex) return;

    setIsExpanded(false);

    setTimeout(() => {
      setCurrentIndex(index);
    }, 150);
  };

  return (
    <div
      className="w-full mx-auto h-[220px] md:h-[350px] relative overflow-hidden"
      ref={containerRef}
    >
      <div className="absolute bottom-0 left-0 right-0 py-4">
        <motion.div
          className="flex items-end pl-4"
          animate={controls}
          initial={{ x: 0 }}
        >
          {tripleCategories.map((category, index) => {
            const isActive = index === currentIndex;
            const isFirstInSequenceActive = currentIndex % totalItems === 0;
            const isPillLastInSequence = index % totalItems === totalItems - 1;
            const hideBecauseOfSeam =
              isFirstInSequenceActive && isPillLastInSequence;

            const isHidden =
              (isExpanded && isActive) ||
              index === currentIndex - 1 ||
              index === currentIndex - 2 ||
              hideBecauseOfSeam;

            return (
              <motion.div
                key={`${category.name}-${index}`}
                ref={(el) => {
                  pillsRef.current[index] = el;
                }}
                className="flex-shrink-0 px-1 relative"
                animate={{ x: getPillTransform(index) }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ opacity: isHidden ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <Link href={category.link} passHref>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        handlePillClick(index);
                      }}
                      className="
                        bg-[#8B848C] backdrop-blur-sm text-[#F0F3FD]
                        text-[10px] xs:text-xs sm:text-sm px-2 xs:px-3 sm:px-4 lg:px-6
                        py-1 xs:py-1.5 sm:py-2 lg:py-3 rounded-full
                        font-medium border border-white/30 hover:bg-white/30
                        transition-all duration-200 whitespace-nowrap m-1
                        cursor-pointer
                      "
                    >
                      {category.name}
                    </div>
                  </Link>
                </motion.div>

                <AnimatePresence>
                  {isExpanded && isActive && (
                    <motion.div
                      key={`card-${index}`}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10"
                      style={{ transformOrigin: "bottom center" }}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div
                        className="bg-[#FFFFFF80] backdrop-blur-md rounded-xl sm:rounded-2xl 
                          p-3 sm:p-4 lg:p-6 border border-white/20 
                          w-36 xs:w-40 sm:w-48 md:w-60 lg:w-80 flex-shrink-0 relative overflow-hidden"
                      >
                        <h3 className="text-white text-sm sm:text-base lg:text-lg xl:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4 text-center sm:text-left">
                          {category.title}
                        </h3>
                        <div className="rounded-lg bg-[#B4ADB8] p-2 sm:p-3 lg:p-4 flex flex-col items-center">
                          <div className="mb-2 sm:mb-3 lg:mb-4">
                            <img
                              src={category.image}
                              alt={category.title}
                              className="w-full h-auto rounded-md sm:rounded-lg object-contain max-h-16 xs:max-h-20 sm:max-h-24 lg:max-h-32"
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

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-2 z-50 bg-white/20 rounded-b-xl sm:rounded-b-2xl overflow-hidden">
                          <motion.div
                            key={`progress-${category.name}-${isExpanded}`}
                            className="h-full bg-gradient-to-r from-[#662CB2] to-[#2C134C]"
                            variants={progressBarVariants}
                            initial="initial"
                            animate={isExpanded ? "animate" : "paused"}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPillsScroller;
