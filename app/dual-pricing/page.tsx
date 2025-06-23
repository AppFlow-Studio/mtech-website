import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import PreferredPayment from "@/components/service/PreferredPayment";
import Image from "next/image";

const DualPricingInfo = () => {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          {/* 
          Main Grid Container:
          - Default (mobile): A single column with text on top, image on bottom.
          - Large screens (lg): Switches to a two-column grid.
          - items-center vertically aligns the content on desktop.
        */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Column 1: Text Content */}
            <div className="text-center lg:text-left">
              <h2
                className="
              text-4xl md:text-5xl font-bold leading-tight
              text-gray-900 dark:text-white
            "
              >
                What is Dual Pricing?
              </h2>
              <div className="mt-6 text-lg space-y-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                <p>
                  Dual Pricing is a pricing strategy where merchants display two
                  distinct prices—one for customers paying with cash and another
                  for those paying with a card. The system highlights a cash
                  discount, often around 4%, directly on the payment terminal
                  and PIN pad.
                </p>
                <p>
                  Customers using cards won’t get the 4% cash discount. That
                  means you’re not stuck paying the 4% average fee your current
                  processor charges. Our Dual Pricing program removes those fees
                  completely—no extra signs, no hassle. And yes, it’s 100% legal
                  and follows all card brand rules in every state.
                </p>
              </div>
            </div>

            {/* Column 2: Illustration - with theme-switching images */}
            <div className="p-8 rounded-2xl ">
              {/* Light Mode Image - Hidden in dark mode */}
              <Image
                src="/dual-pricing-light.png"
                alt="Illustration of dual pricing for light mode"
                width={600}
                height={500}
                className="w-full h-auto dark:hidden" // Key class: hidden in dark mode
              />
              {/* Dark Mode Image - Hidden by default, visible in dark mode */}
              <Image
                src="/dual-pricing-dark.png"
                alt="Illustration of dual pricing for dark mode"
                width={600}
                height={500}
                className="w-full h-auto hidden dark:block"
              />
            </div>
          </div>
        </div>
      </section>
      <PreferredPayment />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default DualPricingInfo;
