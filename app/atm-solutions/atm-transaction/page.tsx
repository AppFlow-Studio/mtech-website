"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";

// --- Data for the feature list ---
const featureList = [
  "Manage Settlement Distribution",
  "Instantly Create New Terminal IDs",
  "ATMs are monitored around the clock and marketing options are tailored to customer requirements.",
  "Monitor Cash Balances",
  "Track Terminal Errors",
  "Automated Report Delivery",
  "Vault Cash Forecasting",
  "Real-time ATM Health Alerts",
  "And Much More!",
];

const AtmTransaction = () => {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column: Text Content */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
                ATM transaction processing
              </h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                At MTech, we've been providing transaction processing services
                to ATM ISOs for years. Our team of experts have the expertise
                and experience to handle transactions from New York all
                throughout the country with precision and accuracy.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                ATM Transaction Delivery is an ISO-registered Independent Sales
                Organization that offers a comprehensive range of ATM handling
                solutions. Every day, our Vault Cash is settled. This includes
                EBT cash as well as access to all national and local system. Our
                management solutions provide you with real-time reporting of
                terminal data, cash settlements, and more...
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
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our ATM transaction management system ensures that all actions
                in a single money transfer are completed without error. If some
                of the tasks are completed but an unexpected issue occurs during
                the money withdrawal, our ATM parameters help restore the
                recorded transactions from before the failed exchange was
                handled. If all exchange actions are completed successfully, the
                exchange is completed by our ATM exchange preparation framework,
                and the money is paid to the client.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                System sponsorship; money stock repayment; charge-back warning;
                guideline E guarantee targets; itemized month to month
                disclosing; and the best possible appropriation of additional
                charge pay are all included in our packaged ATM exchange
                handling administrations.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                It really doesn't matter! MTech Distributors can provide you
                with trustworthy swift handling no matter where you are located
                or what type of business you own.
              </p>
            </div>

            {/* Right Column: Image and Feature List */}
            <div className="space-y-12">
              <div>
                <Image
                  src="/atm-transaction-collage.png"
                  alt="Collage of ATM machines and a business professional"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-2xl"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-3">
                Contact MTech Today!
              </h3>
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

export default AtmTransaction;
