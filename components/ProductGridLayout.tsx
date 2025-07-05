"use client";

import { useState, useEffect } from "react";
import FilterSidebar from "./FilterSidebar";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import type { Product } from "@/lib/types";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";

interface ProductGridLayoutProps {
  title: string;
  totalProducts: number;
  products: Product[];
}

const ProductGridLayout = ({
  title,
  totalProducts: initialTotalProducts,
  products: initialProducts,
}: ProductGridLayoutProps) => {
  const [isCompareOn, setIsCompareOn] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts);
  const [totalProducts, setTotalProducts] = useState(initialTotalProducts);

  // Filter states
  const [inStockFilter, setInStockFilter] = useState<boolean | null>(null);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [tagFilters, setTagFilters] = useState<string[]>([]);

  const productsPerPage = viewMode === "grid" ? 9 : 6;

  // Apply filters and sorting whenever they change
  useEffect(() => {
    let result = [...initialProducts];

    // Apply tag filter
    if (tagFilters.length > 0) {
      result = result.filter(
        (product) =>
          product.tags && tagFilters.some((tag) => product.tags?.includes(tag))
      );
    }

    // Apply stock filter
    if (inStockFilter !== null) {
      result = result.filter((product) => product.inStock === inStockFilter);
    }

    // Apply sorting
    if (sortOption) {
      switch (sortOption) {
        case "alpha-az":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "alpha-za":
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        // Add more sorting options here if needed
        default:
          break;
      }
    }

    setFilteredProducts(result);
    setTotalProducts(result.length);
    setCurrentPage(1); // Reset to first page when filters change
  }, [initialProducts, tagFilters, inStockFilter, sortOption]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Handle filter changes
  const handleStockFilterChange = (inStock: boolean | null) => {
    setInStockFilter(inStock);
  };

  const handleSortChange = (option: string | null) => {
    setSortOption(option);
  };

  const handleTagFilterChange = (tags: string[]) => {
    setTagFilters(tags);
  };

  const resetFilters = () => {
    setInStockFilter(null);
    setSortOption(null);
    setTagFilters([]);
  };

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
            <FilterSidebar
              onStockFilterChange={handleStockFilterChange}
              onSortChange={handleSortChange}
              onTagFilterChange={handleTagFilterChange}
              onReset={resetFilters}
              currentStockFilter={inStockFilter}
              currentSortOption={sortOption}
              currentTagFilters={tagFilters}
              inStockCount={initialProducts.filter((p) => p.inStock).length}
              outOfStockCount={initialProducts.filter((p) => !p.inStock).length}
              products={initialProducts}
            />
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
              {viewMode === "grid" ? (
                <LayoutGrid
                  onClick={() => setViewMode("list")}
                  className="h-6 w-6 text-black dark:text-white cursor-pointer"
                />
              ) : (
                <List
                  onClick={() => setViewMode("grid")}
                  className="h-6 w-6 text-black dark:text-white cursor-pointer"
                />
              )}
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentProducts.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {currentProducts.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
                nextPage={nextPage}
                prevPage={prevPage}
              />
            )}
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
          <FilterSidebar
            onClose={() => setIsFilterOpen(false)}
            onStockFilterChange={handleStockFilterChange}
            onSortChange={handleSortChange}
            onTagFilterChange={handleTagFilterChange}
            onReset={resetFilters}
            currentStockFilter={inStockFilter}
            currentSortOption={sortOption}
            currentTagFilters={tagFilters}
            inStockCount={initialProducts.filter((p) => p.inStock).length}
            outOfStockCount={initialProducts.filter((p) => !p.inStock).length}
            products={initialProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductGridLayout;
