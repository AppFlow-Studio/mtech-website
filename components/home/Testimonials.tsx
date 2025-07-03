"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperCore } from "swiper";
import "swiper/css"; // Core Swiper styles

// --- Data for the testimonials ---
const testimonialsData = [
  {
    quote:
      "When I reached out to MTech about online ordering, it completely transformed my business. It eliminated wait times and streamlined operations, making a huge difference. Even now, I feel like there's still so much more I can do with MTech to make things even more seamless.",
    rating: 5,
    author: "Sarah Johnson",
    title: "CEO of House of Wings NYC",
    imageSrc: "/logos/house-of-wings.png",
  },
  {
    quote:
      "When I started House of Wings, it was a way to support my family. Finding the right location and staff was challenging, but MTech made everything else so much easier.",
    rating: 5,
    author: "Lava Restaurant",
    title: "MTech simplified my business journey",
    imageSrc: "/logos/lava-restaurant.png",
  },
  {
    quote:
      "I wanted someone nearby who was accessible and understood our needs. Their technicians were incredibly helpful, and the new system they installed made what could have been a complicated process feel simple and smooth.",
    rating: 5,
    author: "Animal Paradise Hospital",
    title: "I chose MTech because they're local.",
    imageSrc: "/logos/animal-paradise.png",
  },
  {
    quote:
      "When I reached out to MTech about online ordering, it completely transformed my business. It eliminated wait times and streamlined operations, making a huge difference. Even now, I feel like there's still so much more I can do with MTech to make things even more seamless.",
    rating: 5,
    author: "Fresh Daily Bagels Rx",
    title: "Would you like a few variations to choose from?",
    imageSrc: "/logos/fresh-daily-bagels.png",
  },
  {
    quote:
      "Thanks to MTech, expanding has been stress-free. I would definitely recommend them. Their technicians are knowledgeable and their office staff is always helpful. They've been a huge part of making House of Wings what it is today!",
    rating: 5,
    author: "Fuel",
    title: "MTech support made expansion easy.",
    imageSrc: "/logos/fuel.png",
  },
];

// --- Helper component for rendering stars ---
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating
            ? "text-[#672AB2] fill-[#672AB2] dark:text-white dark:fill-white"
            : "text-[#672ab23f] fill-[#672ab23f] dark:text-white/20 dark:fill-white/20"
        }`}
      />
    ))}
  </div>
);

const Testimonials = () => {
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);

  const slidePrev = () => swiper?.slidePrev();
  const slideNext = () => swiper?.slideNext();

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-medium text-center text-gray-900 dark:text-white">
          Sweet word from sweet Clients
        </h2>

        <div className="relative mt-12">
          {/* Desktop Previous Button */}
          <button
            onClick={slidePrev}
            className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 p-3 rounded-full bg-slate-200/70 dark:bg-slate-700/70 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors hidden lg:block"
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="h-6 w-6 text-gray-800 dark:text-white" />
          </button>

          <Swiper
            onSwiper={setSwiper}
            modules={[Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000, // Time in ms between slides
              disableOnInteraction: true, // Autoplay will stop on user interaction
            }}
          >
            {testimonialsData.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-[#05070D1A] dark:bg-[#FFFFFF33] rounded-2xl p-3 md:p-8 shadow-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[900px] md:h-[500px] lg:h-[450px]">
                    <div className="order-2 lg:order-1 flex flex-col gap-6 text-center lg:text-left">
                      <div className="flex-1 flex items-center">
                        <p className="text-2xl text-gray-600 dark:text-gray-300">
                          "{testimonial.quote}"
                        </p>
                      </div>

                      <div className="flex flex-col items-center lg:items-start gap-2 flex-shrink-0">
                        <StarRating rating={testimonial.rating} />
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                          {testimonial.author}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>

                    <div className="order-1 lg:order-2 bg-white rounded-lg p-4 flex items-center justify-center">
                      <Image
                        src={testimonial.imageSrc}
                        alt={`Logo for ${testimonial.title}`}
                        width={400}
                        height={400}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Desktop Next Button */}
          <button
            onClick={slideNext}
            className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 p-3 rounded-full bg-slate-200/70 dark:bg-slate-700/70 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors hidden lg:block"
            aria-label="Next testimonial"
          >
            <ArrowRight className="h-6 w-6 text-gray-800 dark:text-white" />
          </button>
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="mt-8 flex justify-center items-center gap-4 lg:hidden">
          <button
            onClick={slidePrev}
            className="p-3 rounded-full bg-slate-200 dark:bg-slate-700"
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="h-6 w-6 text-gray-800 dark:text-white" />
          </button>
          <button
            onClick={slideNext}
            className="p-3 rounded-full bg-slate-200 dark:bg-slate-700"
            aria-label="Next testimonial"
          >
            <ArrowRight className="h-6 w-6 text-gray-800 dark:text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
