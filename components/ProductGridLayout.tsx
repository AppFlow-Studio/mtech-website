"use client";

import { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import type { Product } from "@/lib/types"; // Adjust path if needed
import { SlidersHorizontal, LayoutGrid, X } from "lucide-react";

interface ProductGridLayoutProps {
  title: string;
  totalProducts: number;
  products: Product[];
}

const ProductGridLayout = ({
  title,
  totalProducts,
  products,
}: ProductGridLayoutProps) => {
  const [isCompareOn, setIsCompareOn] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* --- Page Header --- */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
            {title}
            <span className="text-gray-400 dark:text-gray-500 text-xl md:text-2xl ml-2">
              ({totalProducts} Products)
            </span>
          </h1>
          {/* Filter button for Mobile - now functional */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 text-gray-700 dark:text-gray-200"
          >
            <span className="font-semibold">Filter</span>
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-8">
          {/* --- Desktop Sidebar --- */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* --- Main Content --- */}
          <main className="lg:col-span-3">
            <div className="hidden lg:flex justify-end items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Compare
              </span>
              <button
                onClick={() => setIsCompareOn(!isCompareOn)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isCompareOn ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isCompareOn ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                View As
              </span>
              <LayoutGrid className="h-6 w-6 text-white cursor-pointer" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>

            <Pagination />
          </main>
        </div>
      </div>

      {/* --- Mobile Filter Drawer --- */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity ${
            isFilterOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsFilterOpen(false)}
        ></div>

        {/* Sidebar Content */}
        <div className="relative z-50 ml-auto h-full w-full max-w-xs bg-white dark:bg-[#0B0119] p-6 shadow-xl">
          <FilterSidebar onClose={() => setIsFilterOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default ProductGridLayout;
