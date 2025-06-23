"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";

// --- Data for the feature list ---
const featureList = [
  "Take advantage of MTech's top-tier hardware purchase rate to get the greatest deal on your ATM equipment.",
  "Reliable service at a reasonable price",
  "Personalized ATM merchandising arrangements",
  "Customized ATM showcasing arrangements.",
  "Collaborates with all major processors and manufacturers.",
  "Increased profit.",
  "Nationwide ATM services.",
];

const EMVPage = () => {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column: Text Content */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
                EMV
              </h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                At MTech, we've been providing transaction processing services
                to ATM ISOs for years. Our team of experts have the expertise
                and experience to handle transactions from New York all
                throughout the country with precision and accuracy.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                EMV stands for Europay, MasterCard, and Visa; it is a
                collaborative effort to ensure client security and cross-border
                compatibility. Eighty countries, including Canada and countries
                in Europe, Latin America, and Asia, are at various stages of EMV
                chip integration. Leading card brand industries in the United
                States have been focusing on card strip innovation for a while,
                the transition to EMV chips was the utmost effective
                alternative.
              </p>
              <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white">
                How EMV Cards Are Differ From Card Strips?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                EMV chip cards add an extra degree of security; according to
                experts, it's incredibly easy to recreate strip cards using
                stolen user data. The new cards will still have the card strip
                to allow them to be used with a non-EMV card per user, but the
                smaller scale chip will require further verification when used
                with an EMV card per user. However, EMV mix will not fully
                guarantee prevention of all forms of extortion. While these
                extra security precautions are performed with in-store
                purchases, they will not protect customer financial information
                during online transactions.
              </p>
              <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white">
                Benefits of using EMV Cards
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                At MTech, we can provide you with the lowest rates due to our
                strong business relationships and MTech's top-level customer
                support with both hardware providers and processors
              </p>
            </div>

            {/* Right Column: Image and Feature List */}
            <div className="space-y-12">
              <div>
                <Image
                  src="/emv-collage.png"
                  alt="Collage of ATM machines and a business professional"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-2xl"
                />
              </div>
              <ul className="space-y-4">
                {featureList.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-white fill-[#662CB2]" />
                    <span className="text-gray-700 dark:text-gray-200">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default EMVPage;
