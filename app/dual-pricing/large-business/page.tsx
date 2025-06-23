"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";

// --- Data for the feature list ---
const featureList = [
  "MTech offers competitive and affordable rates.",
  "MTech provides guidelines for profit maximization.",
  "MTech's account management is focused on the needs of the customer.",
  "ATMs are monitored around the clock and marketing options are tailored to customer requirements.",
  "North America's first Nautilus Hyosung ATM distributor.",
  "A nationwide network of technicians is available for proactive technical help.",
];

const AtmForLargeBusiness = () => {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div
              className="inline-block px-5 py-2 rounded-full text-sm font-medium 
                        bg-purple-100 text-purple-700
                        dark:bg-purple-600/20 dark:text-purple-300"
            >
              Large Businesses
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column: Text Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                ATMs for Large Businesses
              </h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                At MTech Distributors, we truly understand the importance of
                having an ATM solution for large-scale businesses. Our team is
                made up of experts in the field who have extensive experience
                and knowledge when it comes to implementing ATM programs that
                can help our corporate clients manage their portfolios while
                keeping costs low.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We are proud to offer top of the line ATM services that provide
                maximum uptime, rapid response times, and impeccable service
                quality. Our clients have a wide variety of options when it
                comes to choosing the right program for their business. We make
                sure to tailor our solutions according to each individual’s
                needs in order to ensure complete customer satisfaction.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Thanks to our strong relationships with companies like Nautilus
                Hyosung and Genmega, we are able to offer custom-made solutions
                from leading industry names. From supermarkets and convenience
                stores to hospitals, nightclubs, bars, hotels, restaurant chains
                and more - we make sure that every client’s requirements are met
                with efficient and cost-effective solutions. Additionally, we
                guarantee utmost reliability as well as top tier maintenance
                services so that all elements of your ATM are taken care of
                without you having to worry about a thing.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our expert team here at MTech Distributors strives hard to
                provide perfect service quality every single time you choose us
                as your ATM service provider. With our unrivaled expertise in
                the field coupled with superior customer service standards, you
                can rest assured knowing that your business will run smoothly
                and profitably without any hiccups!
              </p>
            </div>

            {/* Right Column: Image and Feature List */}
            <div className="space-y-12">
              <div>
                <Image
                  src="/large-business-collage.png"
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

export default AtmForLargeBusiness;
