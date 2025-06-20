"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ImageLinkCardProps } from "@/lib/types";

const ImageLinkCard = ({ title, imageSrc, link }: ImageLinkCardProps) => {
  return (
    <Link href={link} className="group block">
      <div
        className="
        relative bg-[#E6E6E7] dark:bg-[#231A30]
        rounded-2xl shadow-lg overflow-hidden
        transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
      "
      >
        {/* Image Container */}
        <div className="p-4 bg-white m-4 rounded-lg ">
          <Image
            src={imageSrc}
            alt={title}
            width={400}
            height={300}
            className="w-full h-auto object-contain aspect-[4/3]"
          />
        </div>

        {/* Footer Section */}
        <div className="p-5 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
            {title}
          </h3>
          <div
            className="
            flex items-center justify-center h-10 w-10 rounded-full 
            bg-gradient-to-b from-[#662CB2] to-[#2C134C]
            text-white transition-transform duration-300 group-hover:scale-110
          "
          >
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ImageLinkCard;
