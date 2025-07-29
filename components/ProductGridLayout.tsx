"use client";

import { useState, useEffect } from "react";
import FilterSidebar from "./FilterSidebar";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import type { Product } from "@/lib/types";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts } from "./actions/hooks/useProducts";

interface ProductGridLayoutProps {
  title: string;
  totalInitialProducts?: number;
  initialProducts?: Product[];
}

const ProductGridLayout = ({
  title,
  totalInitialProducts,
  initialProducts,
}: ProductGridLayoutProps) => {
  const { data: products, isLoading } = useProducts()
  //console.log(products)
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isCompareOn, setIsCompareOn] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts ? initialProducts : products || []);
  const [totalProducts, setTotalProducts] = useState(totalInitialProducts ? totalInitialProducts : products?.length || 0);

  // Filter states
  const [inStockFilter, setInStockFilter] = useState<boolean | null>(null);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [tagFilters, setTagFilters] = useState<string[]>([]);

  // On mount, parse tags from URL if present
  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const decoded = decodeURIComponent(dataParam);
        const parsed = JSON.parse(decoded);
        if (parsed.tags && Array.isArray(parsed.tags)) {
          setTagFilters(parsed.tags);
        }
      } catch (e) {
        // ignore parse errors
      }
    }
    // Optionally, parse other filters from URL here (e.g., stock, sort)
  }, []); // Only run on mount

  const productsPerPage = viewMode === "grid" ? 9 : 6;

  // Apply filters and sorting whenever they change
  useEffect(() => {
    let result = [...initialProducts || products || []];

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
  }, [products, tagFilters, inStockFilter, sortOption]);

  // Update URL when filters change
  useEffect(() => {
    const data: any = {};
    if (tagFilters.length > 0) data.tags = tagFilters;
    // Optionally, add inStockFilter and sortOption to URL as well
    // if (inStockFilter !== null) data.inStock = inStockFilter;
    // if (sortOption) data.sort = sortOption;
    const params = new URLSearchParams(searchParams.toString());
    if (Object.keys(data).length > 0) {
      params.set("data", encodeURIComponent(JSON.stringify(data)));
    } else {
      params.delete("data");
    }
    // Only update if changed
    if (searchParams.get("data") !== params.get("data")) {
      router.replace(`?${params.toString()}`);
    }
  }, [tagFilters]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="text-lg font-medium text-gray-700 animate-pulse">
            Loading products...
          </span>
        </div>
      </div>
    );
  }
  if (!products) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-b from-[#f5f3ff] to-[#ede9fe] dark:from-[#2C134C] dark:to-[#1a102b] rounded-xl shadow-lg border border-purple-200 dark:border-purple-900">
        <svg
          className="h-14 w-14 text-purple-400 dark:text-purple-500 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.5"
            className="opacity-30"
          />
          <path
            d="M8 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-80"
          />
        </svg>
        <span className="text-xl font-semibold text-purple-700 dark:text-purple-200 mb-1">
          No products found
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your filters or check back later.
        </span>
      </div>
    )
  }
  if(filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-b from-[#f5f3ff] to-[#ede9fe] dark:from-[#2C134C] dark:to-[#1a102b] rounded-xl shadow-lg border border-purple-200 dark:border-purple-900">
        <span className="text-xl font-semibold text-purple-700 dark:text-purple-200 mb-1">
          No products found
        </span>
      </div>
    )
  }
  console.log(filteredProducts)
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
              inStockCount={filteredProducts.filter((p) => p.inStock).length}
              outOfStockCount={filteredProducts.filter((p) => !p.inStock).length}
              products={filteredProducts}
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
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isCompareOn ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isCompareOn ? "translate-x-6" : "translate-x-1"
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
        className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${isFilterOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity ${isFilterOpen ? "opacity-100" : "opacity-0"
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
            inStockCount={filteredProducts.filter((p) => p.inStock).length}
            outOfStockCount={filteredProducts.filter((p) => !p.inStock).length}
            products={filteredProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductGridLayout;
