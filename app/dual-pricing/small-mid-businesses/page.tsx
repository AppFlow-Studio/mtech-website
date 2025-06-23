"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";

// --- Data for the feature list ---
const featureList = [
  "MTech provides guidelines for profit maximization.",
  "MTech's account management is focused on the needs of the customer.",
  "ATMs are monitored around the clock and marketing options are tailored to customer requirements.",
  "North America's first Nautilus Hyosung ATM distributor.",
  "A nationwide network of technicians is available for proactive technical help.",
];

const AtmForSmallMidBusiness = () => {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div
              className="inline-block px-5 py-2 rounded-full text-sm font-medium 
                        bg-purple-100 text-purple-700
                        dark:bg-purple-600/20 dark:text-white"
            >
              Small & Midsize Businesses
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column: Text Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Small and Midsize Businesses
              </h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                MTech Distributors is dedicated to providing ATM solutions for
                businesses of all sizes and types, ranging from small
                convenience stores to large restaurant chains. Our experienced
                team will be with you every step of the way, from start to
                finish, ensuring that your business has the best possible access
                to cash on hand for customers. In today's highly competitive
                world, it is essential for small businesses to find ways to
                offer their clients value-added services that help keep them
                loyal and content. An ATM machine is an ideal way to accomplish
                this goal.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                MTech provides a wide variety of options for business owners who
                want to take advantage of the benefits an ATM can bring their
                company. Whether you are a new business hoping to install your
                first ATM or an established one looking for more efficient
                management strategies, MTech will work closely with you
                throughout the entire process. From helping you decide which
                type of machine is right for your business needs, to training
                staff on how to use it correctly and troubleshoot any issues
                that may arise in the future, our team offers personalized
                service tailored just for you. We provide attentive customer
                care around the clock so you can always get help when necessary.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our pricing models are tailored depending on your individual
                needs so that even small businesses can access our
                top-of-the-line machines without breaking their budget. With
                MTech Distributors, tap into a full suite of ATM solutions and
                get ready to reap the rewards! We have years of experience in
                helping companies find success with their ATMs – let us help you
                join their ranks today!
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                MTech’s ATM Benefits
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We have an extensive coverage across the entire United States,
                and customer and technical support is available around the
                clock, 24 hours a day, 7 days a week. Our services offer
                numerous possibilities for ownership or placement, as well as
                affiliations with all major networks and processors. We provide
                a broad selection of branding possibilities that are tailored to
                meet any
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Flexible Options
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                At MTech, we understand the unique needs of each organization
                and have created customizable ATM programs to match. Our
                experienced and knowledgeable staff will provide you with
                tailored solutions that take into account the size of your
                employees and cash flow, so you can make the most out of our
                services. From machine pricing to installation, maintenance,
                cash services and processing DUAL PRICING STARTER KIT
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

export default AtmForSmallMidBusiness;
