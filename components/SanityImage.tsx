// src/components/SanityImage.tsx
import Image from "next/image";
import { urlFor } from "@/utils/sanity/lib/image"; // Adjust path as needed
import { getImageDimensions, SanityImageSource } from "@sanity/asset-utils"; // If you need dimensions

interface SanityImageProps {
  image: SanityImageSource;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  // You can add more props like sizes, quality, etc.
}

export default function SanityImage({ image, alt, className, width = 800, height = 600, }: SanityImageProps) {
  if (!image) {
    return null; // Or return a placeholder image
  }

  // If you need the original dimensions of the image:
  // const { width, height } = getImageDimensions(image);

  return (
    <Image
      src={urlFor(image).url()} // Generate the image URL
      alt={alt}
      // You can define width and height here if you want fixed dimensions,
      // otherwise, let Next.js handle responsiveness via `sizes`
      // width={width}
      // height={height}
      className={className}
      width={width}
      height={height}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw" // Example sizes, adjust for your layout
      placeholder="blur" // Enable blur placeholder
      blurDataURL={urlFor(image).width(24).height(24).blur(10).url()} // Low-quality blurred image for placeholder
    />
  );
}