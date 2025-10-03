"use client";

import { Product } from "@/lib/types";
import { SlidersHorizontal, X } from "lucide-react";
import { useTags } from "@/app/(master-admin)/master-admin/actions/hook/useTagHooks";

interface CheckboxProps {
  id: string;
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}

const Checkbox = ({ id, label, count, checked, onChange }: CheckboxProps) => (
  <div className="flex items-center">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 focus:ring-offset-0"
      style={{
        accentColor: "#672AB2",
        backgroundColor: "transparent",
      }}
    />
    <label
      htmlFor={id}
      className="ml-3 text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
    >
      {label} {count !== undefined && `(${count})`}
    </label>
  </div>
);

interface FilterSidebarProps {
  onClose?: () => void;
  onStockFilterChange: (inStock: boolean | null) => void;
  onSortChange: (option: string | null) => void;
  onTagFilterChange: (tags: string[]) => void;
  onReset: () => void;
  currentStockFilter: boolean | null;
  currentSortOption: string | null;
  currentTagFilters: string[];
  inStockCount: number;
  outOfStockCount: number;
  products: Product[];
}

const FilterSidebar = ({
  onClose,
  onStockFilterChange,
  onSortChange,
  onTagFilterChange,
  onReset,
  currentStockFilter,
  currentSortOption,
  currentTagFilters,
  inStockCount,
  outOfStockCount,
  products,
}: FilterSidebarProps) => {
  const { data: tagsData, isLoading: tagsLoading } = useTags();

  const handleStockToggle = (value: boolean) => {
    if (currentStockFilter === value) {
      onStockFilterChange(null); // Uncheck if already checked
    } else {
      onStockFilterChange(value); // Check the option
    }
  };

  const handleSortToggle = (option: string) => {
    if (currentSortOption === option) {
      onSortChange(null); // Uncheck if already checked
    } else {
      onSortChange(option); // Check the option
    }
  };

  const handleTagToggle = (tag: string) => {
    const newTags = currentTagFilters.includes(tag)
      ? currentTagFilters.filter((t) => t !== tag)
      : [...currentTagFilters, tag];
    onTagFilterChange(newTags);
  };


  return (
    <aside>
      {/* Header with optional close button for mobile */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          Filter <SlidersHorizontal className="h-5 w-5" />
        </h2>
        {/* Only show the close button if onClose function is provided (i.e., on mobile) */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1">
            <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>

      <div className="mt-6 space-y-6">
        {/* Product Type Section */}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            Product Type
          </h3>
          <div className="mt-3 space-y-2">
            {tagsLoading ? (
              <p>Loading tags...</p>
            ) : (
              tagsData?.map((tag: any) => (
                <Checkbox
                  key={tag.id}
                  id={tag.id}
                  label={tag.name}
                  count={
                    products.filter((p) => p.product_tags?.some((pt) => pt.tag_id === tag.id)).length
                  }
                  checked={currentTagFilters.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Availability Section */}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            Availability
          </h3>
          <div className="mt-3 space-y-2">
            <Checkbox
              id="in-stock"
              label="In Stock"
              count={inStockCount}
              checked={currentStockFilter === true}
              onChange={() => handleStockToggle(true)}
            />
            <Checkbox
              id="out-of-stock"
              label="Out of Stock"
              count={outOfStockCount}
              checked={currentStockFilter === false}
              onChange={() => handleStockToggle(false)}
            />
          </div>
        </div>

        {/* Sort by Section */}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            Sort by
          </h3>
          <div className="mt-3 space-y-2">
            <Checkbox
              id="alpha-az"
              label="Alphabetical, A-Z"
              checked={currentSortOption === "alpha-az"}
              onChange={() => handleSortToggle("alpha-az")}
            />
            <Checkbox
              id="alpha-za"
              label="Alphabetical, Z-A"
              checked={currentSortOption === "alpha-za"}
              onChange={() => handleSortToggle("alpha-za")}
            />
          </div>
        </div>
      </div>
      <button
        onClick={onReset}
        className="mt-6 text-sm text-[#F04438] hover:underline"
      >
        Clear all
      </button>
    </aside>
  );
};

export default FilterSidebar;
