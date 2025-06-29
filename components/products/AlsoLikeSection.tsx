"use client";

import Slider from "react-slick";
import type { Product } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// --- Custom Arrow Components for the Slider ---
// These will be styled to match your site's theme.
const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} !flex items-center justify-center !w-12 !h-12 bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700 shadow-lg rounded-full right-[-10px] lg:right-[-25px]`}
      onClick={onClick}
    >
      <ChevronRight className="text-slate-800 dark:text-white" />
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} !flex items-center justify-center !w-12 !h-12 bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700 shadow-lg rounded-full left-[-10px] lg:left-[-25px] z-10`}
      onClick={onClick}
    >
      <ChevronLeft className="text-slate-800 dark:text-white" />
    </div>
  );
};

// In a real app, this would be a prop passed to the component,
// likely filtering out the currently viewed product.
const mockRelatedProducts: Product[] = [
  {
    name: "1K HYOSUNG CASSETTE NEEDS...",
    description: "1K HYOSUNG CASSETTE NEEDS TO BE REPAIRED, SOLD AS IS...",
    imageSrc: "/products/product-1.png",
    link: "1k-hyosung-cassette-needs-repair",
    inStock: false,
  },
  {
    name: "2K HYOSUNG CASSETTE NEEDS...",
    description: "2K HYOSUNG CASSETTE NEEDS TO BE REPAIRED, SOLD AS IS...",
    imageSrc: "/products/product-2.png",
    link: "2k-hyosung-cassette-needs-repair",
    inStock: true,
  },
  {
    name: "A SERIES 6128 ELECTRONIC LO...",
    description:
      "THE SERIES 6128 ELECTRONIC LOCK IS A HIGH-SECURITY, USER-FRIENDLY SOLU...",
    imageSrc: "/products/product-3.png",
    link: "a-series-6128-electronic-lock",
    inStock: true,
  },
  {
    name: "ANTENNA FOR WIRELESS UNITS",
    description:
      "THE ANTENNA FOR WIRELESS UNITS IS DESIGNED TO ENHANCE SIGNAL STRE...",
    imageSrc: "/products/product-4.png",
    link: "antenna-for-wireless-units",
    inStock: true,
  },
  {
    name: "ATM LED SIGN",
    description:
      "AN LED SIGN THAT ENSURES YOUR CUSTOMER WILL FIND YOUR MACHINE...",
    imageSrc: "/products/product-5.png",
    link: "atm-led-sign",
    inStock: true,
  },
  {
    name: "ATM RECEIPT PAPER (8 Rolls)",
    description: "8 ROLL CASE OF HYOSUNG RECEIPT PAPER",
    imageSrc: "/products/product-6.png",
    link: "atm-receipt-paper-8-rolls",
    inStock: true,
  },
  {
    name: "ATM AVAILABLE INSIDE SIGN",
    description: "ATM AVAILABLE INSIDE COROPLAST SIGN",
    imageSrc: "/products/product-7.png",
    link: "atm-available-inside-sign",
    inStock: true,
  },
  {
    name: "ATM SIGN",
    description:
      "ATM $10 BILLS COROPLAST SIGN. THE ATM SIGN IS DESIGNED TO CLEARLY IN...",
    imageSrc: "/products/product-8.png",
    link: "atm-sign",
    inStock: true,
  },
  {
    name: "ATM Sign",
    description:
      "ATM $10 & $20 BILLS COROPLAST SIGN. SUITABLE FOR INDOOR OR OUTDOOR U...",
    imageSrc: "/products/product-9.png",
    link: "atm-sign-10-20-bills",
    inStock: true,
  },
  {
    name: "High Bright Topper w/ Blue Grap...",
    description:
      "Includes power cable to system power supply; use P/N: 130211081 to extend it to...",
    imageSrc: "/products/product-79.png",
    link: "high-bright-topper-with-blue-graphics",
    inStock: true,
  },
];

interface AlsoLikeSectionProps {
  // You could pass related products as a prop for true reusability
  // products: Product[];
}

const AlsoLikeSection = ({}: AlsoLikeSectionProps) => {
  // Settings for the react-slick slider
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default number of slides on desktop
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // For tablets
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // For mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          You may also like
        </h2>

        {/* The Slider Component */}
        <Slider {...settings}>
          {mockRelatedProducts.map((product, index) => (
            <div key={index} className="px-3">
              <div className="h-full">
                <ProductCard product={product} viewMode="grid" />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default AlsoLikeSection;
