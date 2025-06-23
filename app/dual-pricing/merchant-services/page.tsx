import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";

// --- Data for the feature list ---
const difference = [
  "BBB A+ Rating",
  "Next Day Funding",
  "Preferred American Express Pricing",
  "24/7 In-House Customer Service",
  "High-Risk Processing Options",
];

const productAndServices = [
  "Credit Card Terminals",
  "Credit Card Processing",
  "Point of Sale Systems",
  "ATM Machines",
  "Sell & Buy ATM Routes",
  "ATM Solution for Distributors",
  "ATMs for Large Businesses",
  "ATMs for Small and Midsize Businesses",
  "ATM Placement Programs",
  "ATM Cash Management",
  "Mobile & Wireless",
];

const MerchantServices = () => {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column: Text Content */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
                Merchant Services
              </h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Organizations use merchant services, which is a classification
                of financial institutions in the United States. They approved
                financial transactions that allow a company to accept credit
                card or bank platinum card transactions via web-based requests.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Merchant Service Provider (MSP) is a commonly used word to
                describe a company or association that provides exchange
                preparation solutions for dealers.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                A credit card transaction can be processed in a variety of ways.
                The classic method, in which you, the merchant, pay the fees
                every time someone uses a credit or debit card, or the new
                method, which we strongly advocate, in which the fee is passed
                on to the client, are our two favorite options. We provide
                appropriate signage that encourages clients to pay with cash.
                This translates to a higher bottom line and profits of up to 4%!
                We are so confident in our claim that you will notice an
                immediate rise in revenues that we provide a 60-day money-back
                guarantee.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                For the past 8 years, MTech has maintained an A+ rating with the
                Better Business Bureau for its commitment to excellent
                administration, development, and dependability.
              </p>
              <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-3">
                MTECH Difference
              </h3>
              <ul className="space-y-4">
                {difference.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-white fill-[#662CB2]" />
                    <span className="text-gray-700 dark:text-gray-200">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Image and Feature List */}
            <div className="space-y-12">
              <div>
                <Image
                  src="/merchant-services-collage.png"
                  alt="Collage of ATM machines and a business professional"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-2xl"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-3">
                MTECH Products and Services
              </h3>
              <ul className="space-y-4">
                {productAndServices.map((feature, index) => (
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

export default MerchantServices;
