"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { mockProducts as allProducts } from "@/lib/mockdata";
import type { Product } from "@/lib/types";

interface SearchbarProps {
  isVisible: boolean;
}

function Searchbar({ isVisible }: SearchbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const router = useRouter();

  // This effect runs whenever the user changes the search query
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = allProducts
        .filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5); // Limit to showing a max of 5 suggestions
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]); // Clear results if query is too short
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setFilteredProducts([]); // Close suggestions on submit
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = () => {
    setFilteredProducts([]); // Close suggestions on click
    setSearchQuery("");
  };

  return (
    <div
      className={`transform transition-all duration-1000 delay-500 ease-out relative z-50 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <form
        onSubmit={handleSearchSubmit}
        className="max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-4 md:mb-8"
      >
        <div className="relative">
          <div className="flex items-center bg-[#FFFFFF33] backdrop-blur-sm rounded-full p-1 md:py-1.5">
            <div className="flex items-center flex-1 px-3 sm:px-4 lg:px-6">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 mr-2 sm:mr-3" />
              <input
                type="text"
                placeholder="Search for Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                className="flex-1 bg-transparent text-white placeholder-white/70 outline-none text-xs sm:text-sm lg:text-base py-1.5 sm:py-2 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#662CB2] to-[#2C134C] text-white text-xs sm:text-sm px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2.5 lg:py-3 rounded-full font-semibold hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200"
            >
              Search
            </button>
          </div>

          {/* --- Search Suggestions Dropdown with very high z-index --- */}
          {filteredProducts.length > 0 && (
            <div
              className="absolute top-full mt-2 w-full bg-[#2A1F4A]/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden"
              style={{ zIndex: 9999 }}
            >
              <ul>
                {filteredProducts.map((product) => (
                  <li key={product.link}>
                    <Link
                      href={`/products/details/${product.link}`}
                      onClick={handleSuggestionClick}
                      className="flex items-center gap-4 p-3 hover:bg-purple-600/50 transition-colors border-b border-white/10 last:border-b-0"
                    >
                      <Image
                        src={product.imageSrc}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md object-contain bg-white/10 flex-shrink-0"
                      />
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-white font-semibold text-sm line-clamp-1 truncate">
                          {product.name}
                        </p>
                        <p className="text-gray-300 text-xs line-clamp-1 truncate">
                          {product.description}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default Searchbar;
