import { CheckCircle2 } from "lucide-react";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { client } from "@/sanity/lib/client";



const components: PortableTextComponents = {
  list: {
    bullet: ({ children }) => (
      <ul className="space-y-3 sm:space-y-4 flex-grow">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="space-y-3 sm:space-y-4 flex-grow">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-2 sm:gap-3">
        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-white fill-[#662CB2] mt-0.5" />
        <span className="text-xs sm:text-sm leading-relaxed text-purple-100">
          {children}
        </span>
      </li>
    ),
    number: ({ children }) => (
      <li className="flex items-start gap-2 sm:gap-3">
        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-white fill-[#662CB2] mt-0.5" />
        <span className="text-xs sm:text-sm leading-relaxed text-purple-100">
          {children}
        </span>
      </li>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className="text-xs sm:text-sm leading-relaxed text-purple-100 mb-2">
        {children}
      </p>
    ),
  },
}
//list the pricing plan
const defPricingPlan = [
  {
    name: "Professional Plan",
    price: 50,
    priceSuffix: "Month Per Store",
    description:
      "It includes full access to core tools, detailed analytics, multi-user management.",
    ctaText: "Register",
    isFeatured: false,
    features: [
      "Company Wide Pricebook Management",
      "Product Scanning & Department Management",
      "Flexible Reporting Dashboard",
      "Advanced Reporting",
      "Mobile App",
    ],
  },
  {
    name: "Business Plan",
    price: 99,
    priceSuffix: "Month Per Store",
    description:
      "The Business Plan is designed for established companies that require robust functionality.",
    ctaText: "Register",
    isFeatured: true, // This highlights the card
    features: [
      "Everything in Professional",
      "Veeder-Root TLS Integration",
      "Store-Specific Pricing",
      "Store Inventory",
      "Clock In/Out & Payroll Calculation",
    ],
  },
  {
    name: "Additional Station",
    price: 15,
    priceSuffix: "Month Per Store",
    description:
      "It includes full access to core tools, detailed analytics, multi-user management.",
    ctaText: "More Service",
    isFeatured: false,
    features: [], // This plan has no feature list
  },
];

const PricingSection = ({ pricingPlans, header, description }: { pricingPlans?: any, header?: string, description?: string }) => {
  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white">
            {header}
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>

        {/* Responsive Grid for Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          { pricingPlans && pricingPlans.map((plan: any) => (
            <div
              key={plan.name}
              className={`
                p-8 rounded-2xl shadow-lg flex flex-col h-full
                transition-transform duration-300 lg:hover:scale-105
                ${
                  plan.isFeatured
                    ? "bg-gradient-to-b from-[#662CB2] to-[#2C134C]"
                    : "bg-[#231A30] border border-[#632BAD]"
                }
              `}
            >
              <h3
                className={`font-bold text-xl ${
                  plan.isFeatured ? "text-white" : "text-white"
                }`}
              >
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-medium text-white">
                  ${plan.price}
                </span>
                <span className="text-white">/ {plan.priceSuffix}</span>
              </div>

              <p
                className={`mt-4 text-sm ${
                  plan.isFeatured ? "text-purple-200" : "text-gray-300"
                }`}
              >
                {plan.description}
              </p>

              <button
                className={`
                w-full py-3 rounded-full font-semibold mt-6 transition-colors 
                ${
                  plan.isFeatured
                    ? "bg-[#EAEEFBCC] text-[#05070D] hover:bg-gray-200"
                    : "bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white"
                }
              `}
              >
                {plan.ctaText}
              </button>

              {/* Only show "Includes" and features list if features exist */}
              {plan.features && plan.features.length > 0 && (
                <>
                  <div className="flex items-center justify-between gap-4 my-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="84"
                      height="6"
                      viewBox="0 0 84 6"
                      fill="none"
                    >
                      <path
                        d="M77.8333 3C77.8333 4.47276 79.0272 5.66667 80.5 5.66667C81.9728 5.66667 83.1667 4.47276 83.1667 3C83.1667 1.52724 81.9728 0.333333 80.5 0.333333C79.0272 0.333333 77.8333 1.52724 77.8333 3ZM0 3V3.5H80.5V3V2.5H0V3Z"
                        fill="url(#paint0_linear_114_19581)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_114_19581"
                          x1="0"
                          y1="3"
                          x2="80.047"
                          y2="3.8274"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#231A30" />
                          <stop offset="1" stop-color="#662CB2" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="text-sm px-6 py-1 border border-[#793FC4] rounded-4xl text-white">
                      Includes
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="84"
                      height="6"
                      viewBox="0 0 84 6"
                      fill="none"
                    >
                      <path
                        d="M6.16667 3C6.16667 4.47276 4.97276 5.66667 3.5 5.66667C2.02724 5.66667 0.833333 4.47276 0.833333 3C0.833333 1.52724 2.02724 0.333333 3.5 0.333333C4.97276 0.333333 6.16667 1.52724 6.16667 3ZM84 3V3.5H3.5V3V2.5H84V3Z"
                        fill="url(#paint0_linear_114_19585)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_114_19585"
                          x1="84"
                          y1="3"
                          x2="3.95302"
                          y2="3.8274"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#231A30" />
                          <stop offset="1" stop-color="#662CB2" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-white fill-[#662CB2]" />
                        <span
                          className={
                            plan.isFeatured
                              ? "text-purple-100"
                              : "text-gray-300"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
