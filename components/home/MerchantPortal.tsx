import Image from "next/image";
import { ChevronRight } from "lucide-react";

const MerchantPortal = () => {
  return (
    <section className="m-4 md:m-8 py-8 sm:py-12 bg-[conic-gradient(from_200deg_at_75.74%_58.66%,#FFF_0deg,#E4E1F8_90deg,#FFF_180.02deg,#DEE8FA_270.58deg,#FFF_360deg)] dark:bg-[conic-gradient(from_200deg_at_75.74%_58.66%,rgba(255,255,255,0.20)_0deg,rgba(228,225,248,0.20)_90deg,rgba(255,255,255,0.20)_180.02280950546265deg,rgba(222,232,250,0.20)_270.5781555175781deg,rgba(255,255,255,0.20)_360deg)] rounded-2xl">
      <div className="container mx-auto px-4">
        {/* 
          Main Grid Container:
          - Default (mobile): A single column with text on top, image on bottom.
          - Large screens (lg): Switches to a two-column grid.
          - items-center vertically aligns the content on desktop.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Column 1: Text Content */}
          {/* On mobile, text is centered. On desktop, it's left-aligned. */}
          <div className="text-center lg:text-left">
            <h1
              className="
              text-xl md:text-3xl lg:text-4xl font-bold leading-tight
              text-gray-900 dark:text-white
            "
            >
              Easy Merchant Cloud based portal, anywhere, anytime
            </h1>
            <p
              className="
              mt-6 text-base leading-relaxed
              text-gray-600 dark:text-gray-300
              max-w-2xl mx-auto lg:mx-0
            "
            >
              Analyze and optimize your business with MTech Distributors.
              Merchant Portal helps you run your business more efficiently and
              profitably. It is the central hub for analytical data, reporting
              services, customer engagement, reconciliation, chargebacks &
              dispute management services. Create a merchant account with us and
              track all the metrics at your fingertips. Get approval within
              48-72 hours and start accepting payments both at your retail
              locations or online platforms.
            </p>
            <div className="mt-8">
              <button
                className="
                inline-flex items-center justify-center gap-2 
                px-8 py-4 rounded-full font-semibold bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white transition-colors duration-300 shadow-lg"
              >
                Get Started
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Column 2: Image */}
          {/* On mobile, this will appear at the bottom. */}
          <div>
            <Image
              src="/merchant-portal-dashboard.png" // IMPORTANT: Update this path to your image
              alt="MTech Merchant Portal dashboard shown on a laptop screen"
              width={1200}
              height={750}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MerchantPortal;
