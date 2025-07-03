"use client";
import { Product } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";

function Detail({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* --- Column 1: Product Image --- */}
        <div className="relative">
          <div
            ref={imageRef}
            className="bg-[#F0F3FD] dark:bg-[#2A2039] p-8 rounded-2xl cursor-zoom-in relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              alt={product.name}
              width={800}
              height={600}
              src={product.imageSrc}
              className="w-full h-auto object-contain aspect-square"
            />

            {isHovered && (
              <div
                className="absolute inset-0 pointer-events-none bg-[#F0F3FD] dark:bg-[#2A2039]"
                style={{
                  backgroundImage: `url(${product.imageSrc})`,
                  backgroundPosition: `${position.x}% ${position.y}%`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "200%",
                }}
              />
            )}
          </div>
        </div>

        {/* --- Column 2: Product Details --- */}
        <div className=" lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            {product.description}
          </p>

          <div className="mt-8">
            <Link href="tel:888-411-7063" className="mt-4">
              <button
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-sm text-white rounded-full transition-colors duration-300 cursor-pointer ${
                  product.inStock
                    ? "bg-gradient-to-b from-[#662CB2] to-[#2C134C] hover:from-[#7a3ac5] hover:to-[#3c1961]"
                    : "bg-[#382F44]"
                }`}
              >
                Call For Price
                <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
