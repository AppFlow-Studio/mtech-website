"use client";

import { SlidersHorizontal, X } from "lucide-react";

const Checkbox = ({
  id,
  label,
  count,
}: {
  id: string;
  label: string;
  count?: number;
}) => (
  <div className="flex items-center">
    <input
      id={id}
      type="checkbox"
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
}

const FilterSidebar = ({ onClose }: FilterSidebarProps) => {
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
        {/* Availability Section */}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            Availability
          </h3>
          <div className="mt-3 space-y-2">
            <Checkbox id="in-stock" label="In Stock" count={213} />
            <Checkbox id="out-of-stock" label="Out of Stock" count={0} />
          </div>
        </div>

        {/* Sort by Section */}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            Sort by
          </h3>
          <div className="mt-3 space-y-2">
            <Checkbox id="featured" label="Featured" />
            <Checkbox id="best-selling" label="Best selling" />
            <Checkbox id="alpha-az" label="Alphabetical, A-Z" />
            <Checkbox id="alpha-za" label="Alphabetical, Z-A" />
            <Checkbox id="price-low-high" label="Price, low to high" />
            <Checkbox id="price-high-low" label="Price, high to low" />
            <Checkbox id="date-old-new" label="Date, old to new" />
            <Checkbox id="date-new-old" label="Date, new to old" />
          </div>
        </div>
      </div>
      <button className="mt-6 text-sm text-[#F04438] hover:underline">
        Clear all
      </button>
    </aside>
  );
};

export default FilterSidebar;
