"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

// --- React-Slick Imports ---
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderData = [
  {
    title: "Inventory Management",
    imageSrc: "/inventory-management.png",
    description:
      "Handling diverse stock from perishables to daily essentials can be complex. Our POS system streamlines inventory tasks, letting you concentrate on growing your business.",
    features: [
      {
        name: "All Your Vendors, One Dashboard",
        detail: "Organize pricing, contacts, and deliveries in a single place.",
      },
      {
        name: "Smart Stock Alerts",
        detail: "Be notified the moment inventory dips below your set limits.",
      },
      {
        name: "Auto-Reorder Made Easy",
        detail:
          "Let the system handle fast-moving item restocks with no hassle.",
      },
      {
        name: "Easy PO Management",
        detail: "Create and approve orders without the usual friction.",
      },
    ],
  },
  // Add 2 more data objects for the other slides
  {
    title: "Customer Engagement",
    imageSrc: "/customer-engagement.jpg",
    description:
      "Build lasting relationships with your customers through targeted loyalty programs, promotions, and personalized communication, all managed from one hub.",
    features: [
      {
        name: "Loyalty Programs",
        detail: "Reward your regulars and keep them coming back for more.",
      },
      {
        name: "Email & SMS Marketing",
        detail: "Send targeted offers and updates directly to your customers.",
      },
      {
        name: "Customer Profiles",
        detail:
          "Understand purchasing habits to offer personalized experiences.",
      },
      {
        name: "Gift Card Management",
        detail:
          "Boost sales and attract new customers with branded gift cards.",
      },
    ],
  },
  {
    title: "Quick & Easy Checkout",
    imageSrc: "/quick-checkout.jpg",
    description:
      "Long lines and full carts are no longer an issue. Our breakthrough in retail efficiency is designed and engineered for rapid processing.",
    features: [
      {
        name: "Rapid Checkout",
        detail:
          "Transform your checkout process to make long lines a thing of the past.",
      },
      {
        name: "User-Friendly Interface",
        detail:
          "Benefit from an interface so simple, your team can focus on what matters.",
      },
      {
        name: "Superior Customer Engagement",
        detail: "Ensure each customer enjoys higher satisfaction rates.",
      },
      {
        name: "Optimized Efficiency",
        detail:
          "Enable your staff to perform at a higher productivity, when it counts.",
      },
    ],
  },
];

const FeatureSlider = () => {
  // --- Settings object for the react-slick slider ---
  const settings = {
    className: "center",
    centerMode: true, // This is the key setting for the desired effect
    infinite: true,
    centerPadding: "120px",
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

  return (
    <section className="py-16 sm:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Convenience Store
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            We provide tailored solutions for convenience stores that keep
            operations running smoothly and customers coming back. From fast,
            reliable payment processing to integrated POS systems.
          </p>
        </div>
      </div>

      {/* Slider Container */}
      <div className="mt-16">
        <Slider {...settings}>
          {sliderData.map((slide, index) => (
            <div key={index} className="px-2 md:px-4">
              <div className="p-8 rounded-2xl h-full flex flex-col bg-[#FAFAFA] dark:bg-[#231A30] shadow-xl">
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
                <p className="mt-2 text-gray-600 dark:text-gray-400 flex-grow">
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
                <button className="w-fit mt-8 py-3 px-4 rounded-full font-semibold text-white bg-gradient-to-r from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 hover:opacity-90 transition-opacity">
                  Talk to an Expert
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default FeatureSlider;
