// components/StarRating.tsx
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export const StarRating = ({
  rating,
  className = "h-5 w-5",
}: StarRatingProps) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`${className} ${
          index < rating
            ? "text-[#672AB2] fill-[#672AB2] dark:text-white dark:fill-white"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ))}
  </div>
);
