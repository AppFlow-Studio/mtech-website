import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

const ProductCard = ({ product, viewMode }: ProductCardProps) => {
  return viewMode === "grid" ? (
    <div className="bg-[#E6E6E7] dark:bg-[#231A30] rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="m-4 rounded-lg bg-[#F0F3FD] dark:bg-[#2A2039]">
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
            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-sm text-white rounded-full transition-colors duration-300 cursor-pointer ${
              product.inStock
                ? "bg-gradient-to-b from-[#662CB2] to-[#2C134C] hover:from-[#7a3ac5] hover:to-[#3c1961]"
                : "bg-[#382F44]"
            }`}
          >
            {product.inStock ? "View Details" : "Call For Price"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </div>
  ) : (
    <div className="bg-[#E6E6E7] dark:bg-[#231A30] rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row h-full transition-all hover:shadow-xl">
      <div className="md:w-1/3 p-4">
        <div className="rounded-lg bg-[#F0F3FD] dark:bg-[#2A2039] h-full">
          <Image
            src={product.imageSrc}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="md:w-2/3 p-6 flex flex-col">
        <h3 className="font-medium text-xl text-gray-900 dark:text-white">
          {product.name}
        </h3>
        <p className="mt-3 text-gray-600 dark:text-gray-400 flex-grow">
          {product.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <Link href={product.link}>
            <button
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 font-semibold text-sm text-white rounded-full transition-colors duration-300 cursor-pointer ${
                product.inStock
                  ? "bg-gradient-to-b from-[#662CB2] to-[#2C134C] hover:from-[#7a3ac5] hover:to-[#3c1961]"
                  : "bg-[#382F44]"
              }`}
            >
              {product.inStock ? "View Details" : "Call For Price"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
