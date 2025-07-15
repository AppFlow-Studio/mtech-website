import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

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
      link: `/products/area-of-specialite?data=${encodeURIComponent(
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

  const expandedDuration = 5000;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [maxPills, setMaxPills] = useState(6);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Variants for the container that holds the pill and the card
  const containerVariants: Variants = {
    collapsed: {
      width: "auto",
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    expanded: {
      width: window.innerWidth < 768 ? "12rem" : "15rem",
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  // Variants for the card itself
  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      scaleY: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      scaleY: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  // Variants for card content (text and button)
  const cardContentVariants: Variants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.2, ease: "easeInOut", delay: 0.2 },
    },
  };

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
  };

  // --- Animation sequence handler ---
  const startAnimationSequence = (newIndex: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Start transition to keep both cards visible during transition
    setIsTransitioning(true);
    setPreviousIndex(currentIndex);

    // Change index immediately so both animations happen simultaneously
    setCurrentIndex(newIndex);

    // End transition after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
      setPreviousIndex(null);

      // Start the timer for next transition
      timerRef.current = setTimeout(() => {
        startAnimationSequence((newIndex + 1) % maxPills);
      }, expandedDuration);
    }, 400); // Duration matches the animation duration
  };

  // --- Timers and Effects ---

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      startAnimationSequence((currentIndex + 1) % maxPills);
    }, expandedDuration);
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    startTimer();
  };

  useEffect(() => {
    const updateMaxPills = () => {
      let newMaxPills = 6;
      if (window.innerWidth < 400) newMaxPills = 2;
      else if (window.innerWidth < 700) newMaxPills = 3;
      else if (window.innerWidth < 850) newMaxPills = 4;
      else if (window.innerWidth < 1100) newMaxPills = 5;

      setMaxPills(newMaxPills);
      setCurrentIndex((prev) => (prev >= newMaxPills ? 0 : prev));
    };

    updateMaxPills();
    window.addEventListener("resize", updateMaxPills);
    return () => window.removeEventListener("resize", updateMaxPills);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [maxPills]);

  const visibleCategories = categories.slice(0, maxPills);

  const handleShopNow = () => {
    const currentCategory = visibleCategories[currentIndex];
    window.location.href = currentCategory.link;
  };

  const handlePillClick = (index: number) => {
    if (index === currentIndex) return;
    startAnimationSequence(index);
  };

  return (
    <div className="w-full mx-auto h-[280px] md:h-[350px] relative overflow-hidden flex items-end justify-center">
      <div className="flex items-end justify-center gap-6 px-4">
        {visibleCategories.map((category, index) => {
          const isActive = index === currentIndex;
          const isPrevious = isTransitioning && index === previousIndex;
          const shouldShowCard = isActive || isPrevious;

          return (
            <motion.div
              key={`${category.name}-${index}`}
              variants={containerVariants}
              animate={shouldShowCard ? "expanded" : "collapsed"}
              className="relative flex justify-center flex-shrink-0"
              style={{ transformOrigin: "bottom" }}
            >
              {/* Pill */}
              <motion.div
                onClick={() => handlePillClick(index)}
                animate={{ opacity: shouldShowCard ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className={`
                  bg-[#8B848C] backdrop-blur-sm text-[#F0F3FD]
                  text-[10px] xs:text-xs sm:text-sm px-2 xs:px-3 sm:px-4
                  py-1 xs:py-1.5 sm:py-2 rounded-full
                  font-medium border border-white/30 hover:bg-white/30
                  transition-colors duration-300 whitespace-nowrap m-1
                  cursor-pointer
                  ${shouldShowCard ? "pointer-events-none" : ""}
                `}
              >
                {category.name}
              </motion.div>

              {/* Card */}
              <AnimatePresence>
                {shouldShowCard && (
                  <motion.div
                    key={`card-${index}`}
                    variants={cardVariants}
                    initial="hidden"
                    animate={isActive ? "visible" : "hidden"}
                    exit="hidden"
                    className="absolute bottom-0 left-0 right-0 z-10"
                    style={{ transformOrigin: "bottom" }}
                  >
                    <div
                      className="bg-[#FFFFFF80] backdrop-blur-md rounded-xl sm:rounded-2xl 
                        p-3 sm:p-4 border border-white/20 
                        w-full flex-shrink-0 relative overflow-hidden"
                    >
                      <motion.div
                        variants={cardContentVariants}
                        initial="hidden"
                        animate={isActive ? "visible" : "hidden"}
                        exit="hidden"
                      >
                        <h3 className="text-white text-sm sm:text-base xl:text-xl font-semibold mb-2 sm:mb-3 text-center sm:text-left">
                          {category.title}
                        </h3>
                        <div className="rounded-lg bg-[#B4ADB8] p-2 sm:p-3 flex flex-col items-center">
                          <div className="mb-2 sm:mb-3">
                            <img
                              src={category.image}
                              alt={category.title}
                              className="w-full h-auto rounded-md sm:rounded-lg object-contain max-h-16 xs:max-h-20 sm:max-h-24"
                            />
                          </div>
                          <button
                            onClick={handleShopNow}
                            className="w-full bg-gradient-to-r from-[#662CB2] to-[#2C134C] text-white 
                            text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-4 rounded-full 
                            font-semibold hover:from-purple-700 hover:to-blue-700 
                            transform hover:scale-105 transition-all duration-200 lg:shadow-md"
                          >
                            Shop Now
                          </button>
                        </div>
                      </motion.div>

                      {/* Progress Bar */}
                      {!isTransitioning && (
                        <div className="absolute bottom-0 left-0 right-0 h-2 z-50 bg-white/20 rounded-b-xl sm:rounded-b-2xl overflow-hidden">
                          <motion.div
                            key={`progress-${currentIndex}`}
                            className="h-full bg-gradient-to-r from-[#662CB2] to-[#2C134C]"
                            variants={progressBarVariants}
                            initial="initial"
                            animate="animate"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPillsScroller;
