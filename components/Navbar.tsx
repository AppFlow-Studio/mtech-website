"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ShoppingCart,
  Phone,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const pathname = usePathname();

  // Check if current path matches or is a child of the href
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Handle mobile dropdown toggle
  const toggleMobileDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const menuItems = [
    { name: "Home", href: "/" },
    {
      name: "Products",
      href: "/products",
      hasDropdown: true,
      dropdownItems: [
        { name: "All Products", href: "/products" },
        { name: "ATM Topper", href: "/products/atm-topper" },
        { name: "Clover", href: "/products/clover" },
        { name: "Dejavoo", href: "/products/dejavoo" },
        { name: "Figure POS", href: "/products/figure-pos" },
        { name: "Genmega ATM", href: "/products/genmega-atm" },
        { name: "Hysoung", href: "/products/hysoung" },
        { name: "Ingenico", href: "/products/ingenico" },
        { name: "On The Fly POS", href: "/products/on-the-fly-pos" },
        { name: "Parts", href: "/products/parts" },
        { name: "PAX", href: "/products/pax" },
        { name: "Pops Parts", href: "/products/pops-parts" },
        { name: "Stands", href: "/products/stands" },
        { name: "Supersonic POS", href: "/products/supersonic-pos" },
        { name: "Valor", href: "/products/valor" },
        { name: "Wireless", href: "/products/wireless" },
      ],
    },
    {
      name: "Services",
      href: "/services",
      hasDropdown: true,
      dropdownItems: [
        { name: "All Services", href: "/services" },
        { name: "Repair Center", href: "/services/repair-center" },
        { name: "Warranty Request", href: "/services/warranty-request" },
      ],
    },
    {
      name: "ATM Solutions",
      href: "/atm-solutions",
      hasDropdown: false,
    },
    {
      name: "Dual Pricing",
      href: "/dual-pricing",
      hasDropdown: true,
      dropdownItems: [
        {
          name: "ATM Cash Management",
          href: "/dual-pricing/atm-cash-management",
        },
        { name: "ATM Marketing", href: "/dual-pricing/atm-marketing" },
        { name: "ATM Placement", href: "/dual-pricing/atm-placement" },
        { name: "ATM Transaction", href: "/dual-pricing/atm-transaction" },
        {
          name: "Community Bank Partners",
          href: "/dual-pricing/community-bank-partners",
        },
        {
          name: "Credit Card Processing",
          href: "/dual-pricing/credit-card-processing",
        },
        { name: "EMV", href: "/dual-pricing/emv" },
        { name: "Large Business", href: "/dual-pricing/large-business" },
        { name: "Merchant Services", href: "/dual-pricing/merchant-services" },
        {
          name: "Small/Mid Businesses",
          href: "/dual-pricing/small-mid-businesses",
        },
      ],
    },
    {
      name: "Partnership",
      href: "/partnership",
      hasDropdown: false,
    },
    {
      name: "Business Type",
      href: "/business-type",
      hasDropdown: true,
      dropdownItems: [
        { name: "Bakeries & Delis", href: "/business-type/bakeries-and-delis" },
        { name: "Beauty Salon", href: "/business-type/beauty-salon" },
        { name: "Convenience Store", href: "/business-type/convenience-store" },
        { name: "Dollar Stores", href: "/business-type/dollar-stores" },
        { name: "Food Truck", href: "/business-type/food-truck" },
        { name: "Gas Stations", href: "/business-type/gas-stations" },
        { name: "Hardware Stores", href: "/business-type/hardware-stores" },
        { name: "Meta Markets", href: "/business-type/meta-markets" },
        { name: "QSR", href: "/business-type/qsr" },
        { name: "Retail Stores", href: "/business-type/retail-stores" },
        { name: "Smoke Shop", href: "/business-type/smoke-shop" },
      ],
    },
  ];

  return (
    <div>
      <nav className="shadow-lg duration-300">
        {/* Top bar with phone number */}
        <div className="py-2 px-4">
          <div className="max-w-7xl mx-auto flex justify-end items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <Phone size={16} />
              <span>888-411-7063</span>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden xl:flex items-center space-x-8 bg-[#672AB21A] dark:bg-[#FFFFFF1A] backdrop-blur-md rounded-full px-4 py-2 z-50">
              {menuItems.map((item, index) => (
                <div key={index} className="relative group xl:mr-4">
                  <div className="flex items-center">
                    <a
                      href={item.href}
                      className={`flex items-center space-x-1 hover:text-purple-400 transition-colors duration-200 text-sm rounded-full ${
                        isActive(item.href)
                          ? "bg-[#672AB21A] dark:bg-[#FFFFFF1A] px-2 py-1"
                          : ""
                      }`}
                    >
                      <span>{item.name}</span>
                    </a>
                    {item.hasDropdown && (
                      <ChevronDown
                        size={14}
                        className="ml-1 cursor-pointer hover:text-purple-400"
                      />
                    )}
                  </div>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && (
                    <div className="absolute left-0 mt-3 w-56 bg-[#f0e9f7] dark:bg-[#241b30] rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200 dark:border-gray-700">
                      <div className="py-2">
                        {item.dropdownItems?.map(
                          (dropdownItem, dropdownIndex) => (
                            <a
                              key={dropdownIndex}
                              href={dropdownItem.href}
                              className={`block px-4 py-2 text-sm ${
                                isActive(dropdownItem.href)
                                  ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/50"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400"
                              } transition-colors duration-200`}
                            >
                              {dropdownItem.name}
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right side buttons - Desktop only */}
            <div className="hidden xl:flex items-center space-x-4">
              {/* Shopping Cart */}
              <button className="p-2 rounded-full text-gray-700 dark:text-gray-300 bg-[#672AB21A] dark:bg-[#FFFFFF1A] hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                <ShoppingCart size={20} />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-[#672AB21A] dark:bg-[#FFFFFF1A] text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Register Button */}
              <button className="bg-gradient-to-b from-[#662CB2] to-[#2C134C] hover:from-[#7a35d1] hover:to-[#3c1963] text-white px-4 py-2 rounded-full transition-colors duration-200">
                Register
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#672AB21A] dark:bg-[#FFFFFF1A] border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-2 space-y-1">
              {/* Navigation Items */}
              {menuItems.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <a
                      href={item.href}
                      className={`flex-1 px-3 py-2 text-left rounded-md transition-colors duration-200 ${
                        isActive(item.href)
                          ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/50"
                          : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400"
                      }`}
                    >
                      {item.name}
                    </a>
                    {item.hasDropdown && (
                      <button
                        onClick={() => toggleMobileDropdown(index)}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                      >
                        <ChevronDown
                          size={16}
                          className={`transform transition-transform duration-200 ${
                            activeDropdown === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Mobile Dropdown Items */}
                  {item.hasDropdown && activeDropdown === index && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.dropdownItems?.map(
                        (dropdownItem, dropdownIndex) => (
                          <a
                            key={dropdownIndex}
                            href={dropdownItem.href}
                            className={`block px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                              isActive(dropdownItem.href)
                                ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/50"
                                : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400"
                            }`}
                          >
                            {dropdownItem.name}
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Bottom Buttons */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
                {/* Shopping Cart */}
                <button className="flex items-center w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 rounded-md transition-colors duration-200">
                  <ShoppingCart size={20} className="mr-3" />
                  <span>Cart</span>
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 rounded-md transition-colors duration-200"
                >
                  {theme === "dark" ? (
                    <Sun size={20} className="mr-3" />
                  ) : (
                    <Moon size={20} className="mr-3" />
                  )}
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </button>

                {/* Register Button */}
                <button className="flex justify-center w-full px-3 py-2 bg-gradient-to-b from-[#662CB2] to-[#2C134C] hover:from-[#7a35d1] hover:to-[#3c1963] text-white rounded-md transition-colors duration-200">
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
