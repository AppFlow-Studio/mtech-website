"use client";

import Image from "next/image";

const PotentialSection = () => {
  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Column 1: Text Content */}
          <div className="text-center lg:text-left">
            <h1
              className="
              text-3xl md:text-4xl font-medium leading-tight
              text-gray-900 dark:text-white
            "
            >
              Unlock a universe of potential
            </h1>
            <p
              className="
              mt-6 leading-relaxed
              text-gray-600 dark:text-gray-300
              max-w-xl mx-auto lg:mx-0
            "
            >
              At MTech Distributors, we offer end-to-end payment solutions that
              enhance transaction security, improve operational efficiency, and
              provide tailored integration to meet the unique needs of your
              business. Experience seamless payment processing with added value
              beyond the basics.
            </p>
            <div className="mt-8">
              <button
                className="
                inline-flex items-center justify-center 
                px-4 py-2 rounded-full font-semibold text-white
                bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600
                hover:opacity-90 transition-opacity duration-300 shadow-lg
              "
              >
                Buy Our Products
              </button>
            </div>
          </div>
          <div>
            <Image
              src="/potential-collage.png"
              alt="A collage of modern payment processing images"
              width={800} // Defines the aspect ratio
              height={550} // Defines the aspect ratio
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PotentialSection;
