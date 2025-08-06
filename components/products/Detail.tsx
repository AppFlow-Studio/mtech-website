// components/Detail.tsx (or wherever this component is located)
"use client";

import { Product } from "@/lib/types";
import { ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useProductInfo } from "../actions/hooks/useProducts";
import { useQuoteCartStore } from "@/lib/quote-cart-store";
import { toast } from "sonner";
import { BrochureSection } from "./BrochureSection";

// --- Reusable Form Input Component ---
const FormInput = ({
  id,
  label,
  type = "text",
  value,
  disabled = false,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      defaultValue={value}
      disabled={disabled}
      required={required}
      className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
    />
  </div>
);

function Detail({ slug }: { slug: string }) {
  const { data: product, isLoading } = useProductInfo(slug)
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const { addItem } = useQuoteCartStore();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real application, you would handle the form submission here,
    // e.g., send the data to an API endpoint.
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Form submitted:", data);
    alert("Thank you for your inquiry! We will get back to you shortly.");
    e.currentTarget.reset();
  };

  const handleAddToQuoteCart = () => {
    if (!product) return;

    addItem(product, 1);
    toast.success(`${product.name} added to quote cart!`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-purple-500 mb-4"
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
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">
            Loading product details...
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* --- Column 1: Product Image --- */}
        <div className="relative">
          <div
            ref={imageRef}
            className="bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl cursor-zoom-in relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              alt={product.name}
              width={800}
              height={600}
              src={product.imageSrc}
              className="w-full h-auto object-contain aspect-square"
            />
            {isHovered && (
              <div
                className="absolute inset-0 pointer-events-none bg-slate-100 dark:bg-slate-800"
                style={{
                  backgroundImage: `url(${product.imageSrc})`,
                  backgroundPosition: `${position.x}% ${position.y}%`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "200%",
                }}
              />
            )}
          </div>
        </div>

        {/* --- Column 2: Product Details & Contact Form --- */}
        <div className="lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            {product.description}
          </p>

          {/* Brochure Section */}
          <BrochureSection
            brochureUrl={product?.brochureUrl}
            productName={product?.name}
          />

          <div className="mt-8">
            <Link href="tel:888-411-7063" className="mt-4">
              <button
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 font-semibold text-sm text-white rounded-full transition-colors duration-300 cursor-pointer ${product.inStock
                  ? "bg-gradient-to-b from-[#662CB2] to-[#2C134C] hover:from-[#7a3ac5] hover:to-[#3c1961]"
                  : "bg-[#382F44] cursor-not-allowed"
                  }`}
              >
                Call For Price
                <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
            <button
              onClick={handleAddToQuoteCart}
              disabled={!product.inStock}
              className={`w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-3 font-semibold text-sm text-white rounded-full transition-colors duration-300 cursor-pointer ${product.inStock
                ? "bg-gradient-to-b from-[#662CB2] to-[#2C134C] hover:from-[#7a3ac5] hover:to-[#3c1961]"
                : "bg-[#382F44] cursor-not-allowed"
                }`}
            >
              Add to Quote Cart
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      {/* --- CONTACT FORM --- */}
      <div className="mt-10 mx-auto md:w-1/2 pt-10 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Request a Quote
        </h2>
        <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
          <FormInput id="name" label="Name" />
          <FormInput id="email" label="Email" type="email" />
          <FormInput id="phone" label="Phone Number" type="tel" />
          <FormInput
            id="item"
            label="Item Interested In"
            value={product.name}
            disabled={true}
          />
          <div>
            <label
              htmlFor="comments"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              rows={4}
              className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className={` inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer ${product.inStock
                ? "bg-gradient-to-b from-[#662CB2] to-[#2C134C] hover:from-[#7a3ac5] hover:to-[#3c1961]"
                : "bg-[#382F44] cursor-not-allowed"
                }`}
            >
              Submit Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Detail;
