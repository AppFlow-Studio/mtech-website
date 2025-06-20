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

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
      dropdownItems: ["Laptops", "Desktops", "Accessories", "wireless"],
    },
    { name: "Wireless Routers", href: "/wireless-routers" },
    {
      name: "Services",
      href: "/services",
      hasDropdown: true,
      dropdownItems: ["Tech Support", "Installation", "Maintenance"],
    },
    {
      name: "ATM Solutions",
      href: "/atm-solutions",
      hasDropdown: true,
      dropdownItems: ["ATM Hardware", "Software Solutions", "Support"],
    },
    {
      name: "Dual pricing",
      href: "/dual-pricing",
      hasDropdown: true,
      dropdownItems: ["Retail", "Wholesale", "Corporate"],
    },
    {
      name: "Partnership",
      href: "/partnership",
      hasDropdown: true,
      dropdownItems: ["Become Partner", "Partner Benefits", "Partner Portal"],
    },
    {
      name: "Business Type",
      href: "/business-type",
      hasDropdown: true,
      dropdownItems: ["Small Business", "Enterprise", "Government"],
    },
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <nav className="shadow-lg  duration-300">
        {/* Top bar with phone number */}
        <div className=" py-2 px-4">
          <div className="max-w-7xl mx-auto flex justify-end items-center">
            <div className="flex items-center space-x-2 text-sm">
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
            <div className="hidden xl:flex items-center space-x-8 bg-[#672AB21A] dark:bg-[#FFFFFF1A] backdrop-blur-md rounded-full px-4 py-2">
              {menuItems.map((item, index) => (
                <div key={index} className="relative group xl:mr-4">
                  <button
                    className={`flex items-center space-x-1 hover:text-purple-400 transition-colors duration-200 text-sm rounded-full  ${
                      isActive(item.href)
                        ? "bg-[#672AB21A] dark:bg-[#FFFFFF1A] px-2 py-1"
                        : ""
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && <ChevronDown size={14} />}
                  </button>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && (
                    <div className="absolute top-full left-0 mt-3 w-48 bg-white dark:bg-[#FFFFFF1A] rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        {item.dropdownItems?.map(
                          (dropdownItem, dropdownIndex) => (
                            <a
                              key={dropdownIndex}
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                            >
                              {dropdownItem}
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
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-[#672AB21A] dark:bg-[#FFFFFF1A] text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Register Button */}
              <button className="bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white px-4 py-2 rounded-full transition-colors duration-200">
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
          <div className="xl:hidden bg-white dark:bg-[#FFFFFF1A] border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-2 space-y-1">
              {/* Navigation Items */}
              {menuItems.map((item, index) => (
                <div key={index}>
                  <button
                    onClick={() =>
                      item.hasDropdown ? toggleMobileDropdown(index) : null
                    }
                    className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 rounded-md transition-colors duration-200"
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-200 ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Mobile Dropdown Items */}
                  {item.hasDropdown && activeDropdown === index && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.dropdownItems?.map(
                        (dropdownItem, dropdownIndex) => (
                          <a
                            key={dropdownIndex}
                            href="#"
                            className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 rounded-md transition-colors duration-200"
                          >
                            {dropdownItem}
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
                  onClick={toggleDarkMode}
                  className="flex items-center w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 rounded-md transition-colors duration-200"
                >
                  {darkMode ? (
                    <Sun size={20} className="mr-3" />
                  ) : (
                    <Moon size={20} className="mr-3" />
                  )}
                  <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>

                {/* Register Button */}
                <button className="flex items-center w-full px-3 py-2 text-left bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-md transition-colors duration-200">
                  <span>Register</span>
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
