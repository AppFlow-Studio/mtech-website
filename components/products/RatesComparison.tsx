"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

// --- Data for the two rate plans ---
const ratePlans = [
  {
    name: "Standard Rate Plan",
    rate: "2.69% + 10¢/txn",
    description: "Simple, Clear & Affordable pricing.",
    ctaText: "Register",
    isFeatured: false,
    features: [
      "Statement fee of $19/month",
      "Includes Next-Day Funding with 10 pm EST Cut-Off",
      "Does not include RTP & Weekend Funding (+ $10/month)",
    ],
  },
  {
    name: "Dual Pricing Plan",
    rate: "0%",
    description: "Virtually eliminate your processing bill.",
    ctaText: "Register",
    isFeatured: true, // This gives it the distinct purple background
    features: [
      "Statement fee of $29/month for accounts that process under $10k in credit card. Waived if over $10k.",
      "EBT is $0.07 transaction",
      "Most Heavily Discounted SuperSonic",
    ],
  },
];

// --- Reusable Pricing Card Sub-component ---
const PricingCard = ({ plan }: { plan: (typeof ratePlans)[0] }) => {
  const isFeatured = plan.isFeatured;

  return (
    <div
      className={`
                p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col h-full w-full
                transition-transform duration-300 lg:hover:scale-105
                ${
                  isFeatured
                    ? "bg-gradient-to-b from-[#662CB2] to-[#2C134C]"
                    : "bg-[#231A30] border border-[#632BAD]"
                }
              `}
    >
      <h3
        className={`font-bold text-xl ${
          isFeatured ? "text-white" : "text-white"
        }`}
      >
        {plan.name}
      </h3>

      <div className="mt-4">
        <span className="text-5xl font-bold text-white">{plan.rate}</span>
      </div>

      <p
        className={`mt-4 text-sm ${
          isFeatured ? "text-purple-200" : "text-gray-400"
        }`}
      >
        {plan.description}
      </p>

      <button
        className={`
        w-full py-3 rounded-full font-semibold mt-4 sm:mt-6 transition-colors text-sm sm:text-base
        ${
          isFeatured
            ? "bg-[#EAEEFBCC] text-[#05070D] hover:bg-gray-200"
            : "bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white"
        }
      `}
      >
        {plan.ctaText}
      </button>

      <div className="flex items-center justify-between my-6 sm:my-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="6"
          viewBox="0 0 84 6"
          fill="none"
          className="sm:w-[84px] flex-shrink-0"
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
              <stop stopColor="#231A30" />
              <stop offset="1" stopColor="#662CB2" />
            </linearGradient>
          </defs>
        </svg>
        <span className="text-xs sm:text-sm px-4 sm:px-6 py-1 border border-[#793FC4] rounded-4xl text-white mx-4 sm:mx-8 whitespace-nowrap">
          Includes
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="6"
          viewBox="0 0 84 6"
          fill="none"
          className="sm:w-[84px] flex-shrink-0"
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
              <stop stopColor="#231A30" />
              <stop offset="1" stopColor="#662CB2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Features list with flex-grow to push content to fill remaining space */}
      <ul className="space-y-3 sm:space-y-4 flex-grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 sm:gap-3">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-white fill-[#662CB2] mt-0.5" />
            <span
              className={`text-xs sm:text-sm leading-relaxed ${
                isFeatured ? "text-purple-100" : "text-gray-300"
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RatesComparison = () => {
  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Rates
          </h2>
        </div>

        {/* Main Layout Container - Added items-stretch to ensure equal heights */}
        <div className="mt-16 flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-8 lg:gap-0">
          {/* Card 1 */}
          <div className="w-full lg:w-2/5 flex">
            <PricingCard plan={ratePlans[0]} />
          </div>

          {/* VS Separator */}
          <div className="w-full lg:w-1/5 flex justify-center items-center lg:-mx-8">
            <Image
              src="/vs-separator.svg"
              alt="Versus separator"
              width={150}
              height={75}
              className="w-40 h-auto lg:w-auto dark:invert dark:brightness-0 dark:contrast-100"
            />
          </div>

          {/* Card 2 */}
          <div className="w-full lg:w-2/5 flex">
            <PricingCard plan={ratePlans[1]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RatesComparison;
