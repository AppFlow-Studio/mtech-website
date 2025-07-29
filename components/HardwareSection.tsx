"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const HardwareSection = () => {
  // State to manage whether the video player should be shown
  const [isPlaying, setIsPlaying] = useState(false);

  // Replace with your actual video embed URL (e.g., from YouTube, Vimeo)
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* --- Section Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
           Hardware Line
          </h2>
          <div className="max-w-md">
            <p className=" text-gray-600 dark:text-gray-300">
              Our Hardware Line introduces the next generation of payment
              and business technology — combining sleek design with powerful
              performance.
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="
                inline-flex items-center justify-center 
                px-6 py-3 rounded-full font-semibold text-white
                bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600
                hover:opacity-90 transition-opacity duration-300 shadow-lg
              "
              >
                Buy Our Products
              </Link>
            </div>
          </div>
        </div>

        {/* --- Video Player Container --- */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
          {isPlaying ? (
            // If playing, show the embedded video iframe
            <iframe
              src={videoUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            // If not playing, show the thumbnail and custom play button
            <>
              <Image
                src="/hardware-line-thumbnail.jpg"
                alt="A modern office environment"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="group"
                  aria-label="Play video"
                >
                  <Image
                    src="/play-button.svg"
                    alt="Play button"
                    width={100}
                    height={100}
                    className="
                      w-20 h-20 md:w-24 md:h-24 
                      transition-transform duration-300 
                      group-hover:scale-110
                    "
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HardwareSection;
