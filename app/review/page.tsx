"use client";

import { ChevronDown } from "lucide-react";
import { FullTestimonial } from "@/lib/types";
import { StarRating } from "@/components/review/StarRating";
import TestimonialCard from "@/components/review/TestimonialCard";
import Contact from "@/components/Contact";

const mockTestimonials: FullTestimonial[] = [
  {
    logoSrc: "/logos/house-of-wings.png",
    companyName: "House of Wings NYC",
    rating: 5,
    timestamp: "3 months ago",
    title: "Transformed operations with MTech support",
    text: "When I reached out to mtech about online ordering it completely transformed my business. It eliminated wait times and streamlined operations, making a huge difference. even now, i feel like there's still so much more i can do with MTech to make things even more seamless.",
    likes: 3,
    dislikes: 2,
  },
  {
    logoSrc: "/logos/lava-restaurant.png",
    companyName: "Lava Restaurant",
    rating: 5,
    timestamp: "3 months ago",
    title: "MTech simplified my business journey",
    text: "When I started House of Wings, it was a way to support my family. Finding the right location and staff was challenging, but MTech made everything else so much easier.",
    likes: 3,
    dislikes: 2,
  },
  {
    logoSrc: "/logos/animal-paradise.png",
    companyName: "Animal Paradise Hospital",
    rating: 5,
    timestamp: "3 months ago",
    title: "I chose MTech because they’re local.",
    text: "I wanted someone nearby who was accessible and understood our needs. Their technicians were incredibly helpful, and the new system they installed made what could have been a complicated process feel simple and smooth.",
    likes: 3,
    dislikes: 2,
  },
  {
    logoSrc: "/logos/fresh-daily-bagels.png",
    companyName: "Fresh Daily Bagels Rx",
    rating: 5,
    timestamp: "3 months ago",
    title: "Would you like a few variations to choose from?",
    text: "When I reached out to MTech about online ordering, it completely transformed my business. It eliminated wait times and streamlined operations, making a huge difference. Even now, I feel like there's still so much more I can do with MTech to make things even more seamless.",
    likes: 3,
    dislikes: 2,
  },
  {
    logoSrc: "/logos/fuel.png",
    companyName: "Fuel",
    rating: 5,
    timestamp: "3 months ago",
    title: "MTech support made expansion easy.",
    text: "Thanks to MTech, expanding has been stress-free. I would definitely recommend them. Their technicians are knowledgeable and their office staff is always helpful. They've been a huge part of making House of Wings what it is today!",
    likes: 3,
    dislikes: 2,
  },
];

const TestimonialsPage = () => {
  return (
    <>
      <div className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white">
              House Of Wings Testimonial
            </h1>
          </header>

          {/* Aggregate Rating Section */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
            <div className="text-center md:text-left">
              <p className="text-5xl font-medium text-center text-gray-900 dark:text-white">
                4.7
              </p>
              <div className="mt-2 flex justify-center">
                <StarRating rating={4.7} className="h-4 w-4" />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Based on 3,205 reviews
              </p>
            </div>
            <div className="w-full md:w-2/3">
              <div className="relative h-16">
                {/* The functional slider input */}
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  defaultValue="4.7"
                  className="custom-range w-full absolute top-8 z-10"
                  disabled
                />

                {/* Container for all visual, non-interactive elements */}
                <div className="absolute inset-x-0 top-8 pointer-events-none">
                  {/* The visual track line */}
                  <div className="h-0.5 bg-slate-300 dark:bg-slate-600"></div>

                  {/* Container for labels and ticks */}
                  <div className="relative h-full">
                    {/* "Fit" Label at top center */}
                    <div className="absolute left-0 -top-9">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Fit
                      </span>
                    </div>

                    {/* Left vertical line */}
                    <div className="absolute left-0 -top-2">
                      <div className="w-px h-4 bg-gray-400 dark:bg-gray-500"></div>
                    </div>

                    {/* Right vertical line */}
                    <div className="absolute right-0 -top-2">
                      <div className="w-px h-4 bg-gray-400 dark:bg-gray-500"></div>
                    </div>

                    {/* "Poor" Label at bottom left */}
                    <div className="absolute left-0 top-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Poor
                      </span>
                    </div>

                    {/* "Perfect" Label at bottom right */}
                    <div className="absolute right-0 top-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Perfect
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-header with sort */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              3,205 reviews
            </p>
            <div className="relative">
              <select className="appearance-none bg-transparent pl-3 pr-8 py-2 font-semibold text-gray-800 dark:text-gray-100 focus:outline-none">
                <option>Highest Rating</option>
                <option>Lowest Rating</option>
                <option>Most Recent</option>
              </select>
              <ChevronDown className="h-5 w-5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Testimonials List */}
          <div className="mt-6">
            {mockTestimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>

          {/* Show More Button */}
          <div className="mt-12 text-center">
            <button
              className="
            px-4 py-2 rounded-full font-semibold text-white
            bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 
            transition-colors duration-300
          "
            >
              Show More
            </button>
          </div>
        </div>
      </div>
      <Contact />
    </>
  );
};

export default TestimonialsPage;
