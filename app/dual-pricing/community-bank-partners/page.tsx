import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";

// --- Data for the feature list ---
const feature = [
  "Non-interest income.",
  "Increase deposits with our next – day funding",
  "Protect and leverage your brand through co-branded materials.",
  "Create more loyalty – stop the Nationals from soliciting your customers.",
  "Increase customer retention through a comprehensive suite of solutions – make your customer “sticky”.",
  "Add clients with our special program.",
];

const benefits = [
  "A-to-Z Sales support.",
  "Complete support, including marketing, for bank branches and branch managers.",
  "Quarterly payments with online reporting access.",
  "NEW! Customized online referral system & tracking",
  "24/7 Toll-Free Customer Service.",
  "Flexible equipment payments and training for client.",
  "Automatic deposit options within one business day – including American Express.",
  "Easy-to-Read Merchant Statements – paper or online.",
  "Support for all major credit cards.",
];

const communityBankPartners = () => {
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
              Community Bank partners
            </div>
          </div>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column: Text Content */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
                Partnering with Community Banks
              </h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Offer extra services to your clientele to keep them pleased
                while also bringing in more money.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                For community banks, MTech has a particular programme. We will
                assist your institution in expanding services without incurring
                new costs, increasing revenue, and maintaining client
                satisfaction. Our goal is to give your clients a cutting-edge
                array of products and services at a reasonable cost. We provide
                tailored relationship management by people that are familiar
                with your industry.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Over 40 banks with 300 branches have backed MTech. We belong to
                the Virginia and Maryland Bankers Associations, as well as the
                ATM Industry Association.
              </p>
              <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-3">
                Provide merchant services at no cost to your bank – save your
                clients money guaranteed!
              </h3>
              <ul className="space-y-4">
                {feature.map((feature, index) => (
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
                  src="/community-bank-partners-collage.png"
                  alt="Collage of ATM machines and a business professional"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-2xl"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-3">
                Some of the program benefits for your financial institution:
              </h3>
              <ul className="space-y-4">
                {benefits.map((feature, index) => (
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

export default communityBankPartners;
