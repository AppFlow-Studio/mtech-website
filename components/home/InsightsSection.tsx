"use client";

import { useRef } from "react";
import Image from "next/image";
import { CreditCard, Link, Hand, CircleDollarSign } from "lucide-react";
import { Insight } from "@/lib/types";

const insightsData: Insight[] = [
  {
    icon: CircleDollarSign,
    title: "Payment Processing",
    description:
      "Enable your business to process payments effortlessly through major credit and debit card networks, ACH, E-Check, and mobile payment solutions.",
    imageSrc: "/insight-gateway.png",
  },
  {
    icon: Link,
    title: "Payment Gateway Integration",
    description:
      "Protect every transaction with advanced encryption, ensuring smooth and secure communication between businesses, customers, and banks.",
    imageSrc: "/insight-pos.png",
  },
  {
    icon: CreditCard,
    title: "Point of Sale Systems",
    description:
      "Modernize your checkout experience with our intuitive and powerful POS systems, designed for speed, reliability, and ease of use.",
    imageSrc: "/payment-processing.png",
  },
];

const InsightsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Drag logic
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const startDragging = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isMouseDown.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
  };

  const stopDragging = () => {
    isMouseDown.current = false;
  };

  const onDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isMouseDown.current || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Insights That Drive Your Business Forward
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Stay informed with expert tips, industry trends, and actionable
            advice. Our blog is your go-to resource for navigating payment
            technology, improving operations, and staying ahead in an
            ever-changing market.
          </p>
        </div>

        {/* This outer container prevents horizontal overflow from affecting the whole page */}
        <div className="mt-16 overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto -mx-4 px-4 no-scrollbar cursor-grab active:cursor-grabbing select-none hide-scrollbar ml-2 md:ml-4 group"
            onMouseDown={startDragging}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            onMouseMove={onDrag}
          >
            {insightsData.map((insight, index) => (
              // The card container is now relative to position the handle icon
              <div
                key={index}
                className="relative flex-shrink-0 w-[90%] sm:w-[48%] snap-start "
              >
                {/* --- The Card --- */}
                <div className="bg-[#05070D1A] md:bg-[#FFFFFF1A] dark:bg-[#FFFFFF1A] rounded-2xl overflow-hidden h-full flex flex-col pointer-events-none p-2 md:p-4">
                  <div className="p-3 sm:p-4 flex-grow">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#F0F3FD] p-3 rounded-full">
                        <insight.icon className="h-6 w-6 text-[#8C41B8]" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                          {insight.title}
                        </h3>
                        <p className="mt-4 text-slate-600 dark:text-gray-300">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-56">
                    <Image
                      src={insight.imageSrc}
                      alt={insight.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>
                {index < insightsData.length - 1 && (
                  <div className="absolute top-1/2 -right-[16px] -translate-y-1/2 translate-x-1/2 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                    <div className="bg-white p-6 rounded-full shadow-lg">
                      <Hand className="h-8 w-8 text-[#380D52] " />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
