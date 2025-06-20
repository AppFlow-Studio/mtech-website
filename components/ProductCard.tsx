// components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-[#E6E6E7] dark:bg-[#231A30] rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
      <div className="m-4 rounded-lg bg-[#F0F3FD]">
        <Image
          src={product.imageSrc}
          alt={product.name}
          width={300}
          height={200}
          className="w-full h-auto object-contain aspect-[4/3]"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-medium text-lg text-gray-900 dark:text-white line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-2 flex-grow">
          {product.description}
        </p>
        <Link href={product.link} className="mt-4">
          <button
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-sm
            bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-full
            transition-colors duration-300"
          >
            Call For Price
            <ChevronRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
