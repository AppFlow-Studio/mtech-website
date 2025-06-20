import Image from "next/image";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { StarRating } from "./StarRating";
import type { FullTestimonial } from "@/lib/types";

interface TestimonialCardProps {
  testimonial: FullTestimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 border-y border-[#DCE0EC] dark:border-white">
      {/* Logo */}
      <div className="flex-shrink-0 w-full h-auto md:self-stretch md:aspect-square md:w-[200px] bg-[#F2F2F2] rounded-lg flex items-center justify-center p-2">
        <Image
          src={testimonial.logoSrc}
          alt={`${testimonial.companyName} logo`}
          width={100}
          height={100}
          className="object-cover w-full"
        />
      </div>

      {/* Content */}
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <StarRating rating={testimonial.rating} />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {testimonial.timestamp}
          </span>
        </div>
        <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
          {testimonial.title}
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">
          {testimonial.text}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Was this helpful?</span>
          <button className="flex items-center gap-1.5 hover:text-purple-600 transition-colors">
            <ThumbsUp className="h-4 w-4" />
            <span>{testimonial.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-purple-600 transition-colors">
            <ThumbsDown className="h-4 w-4" />
            <span>{testimonial.dislikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
