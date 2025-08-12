import Contact from "@/components/Contact";
import AgentForm from "@/components/partnership/AgentForm";
import FeaturesList from "@/components/partnership/FeaturesList";
import { sanityFetch } from '@/utils/sanity/lib/live'
import { defineQuery } from "next-sanity";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { CheckCircle2 } from "lucide-react";

//used for feature list
const mtechOffers = [
  "Custom Compensation Schedules",
  "Referral Program with a monthly residual income",
  "Multiple Platforms to meet your processing needs",
  "Dual Pricing and Traditional Pricing with exceptional rates",
  "Lifetime Residuals on active processing accounts",
  "Access to Capital and Residual Buyouts",
  "Information on Countless POS Systems",
  "Access to an online office to view your merchant’s progress",
  "E-Commerce (websites)",
  "Virtual Terminals and Gateway Merchant Integration",
  "POS Integrations",
  "Mobile Terminals (Wireless)",
];
const options = { next: { revalidate: 30 } };

const PartnershipPage = async () => {
  const partnership = await sanityFetch({
    query: defineQuery(`*[_type == "PARTNERSHIP_TYPE"][0]`),
    ...options,
  })
  const defaultPortableTextComponents: PortableTextComponents = {
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
          <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 flex-shrink-0 text-white fill-[#662CB2] mt-0.5" />
          <span className="text-xs sm:text-sm leading-relaxed">
            {children}
          </span>
        </li>
      ),
      number: ({ children }) => (
        <li className="flex items-start gap-2 sm:gap-3">
          <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 flex-shrink-0 text-white fill-[#662CB2] mt-0.5" />
          <span className="text-xs sm:text-sm leading-relaxed">
            {children}
          </span>
        </li>
      ),
    },
    block: {
      normal: ({ children }) => (
        <p className="leading-relaxed mb-2 mt-2">
          {children}
        </p>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900 dark:text-white mt-6">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-xl md:text-2xl font-medium leading-tight text-gray-900 dark:text-white mt-6">
          {children}
        </h3>
      ),
    },
  };

  return (
    <>
      <div className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {partnership.data.title}
            </h1>
            {/* <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Our ATM solutions are designed to provide reliable, secure, and
              convenient cash access for your customers while generating
              additional revenue for your business.
            </p> */}
            <PortableText value={partnership.data.description} components={defaultPortableTextComponents} />
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-3">
              <div className="space-y-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {partnership.data.Section_Header}
                  </h2>
                  <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-300">
                    {/* <p>
                      Are you a business owner or freelancer looking to expand
                      your horizons in the payment processing industry? MTech
                      Distributors offers an exciting opportunity to become an
                      Independent Sales Organization (ISO), where you can
                      leverage our powerful resources to build strong business
                      relationships, enhance your competitive edge, and improve
                      client retention.
                    </p>
                    <p>
                      Join our team and start accelerating your monthly profits
                      today! By partnering with MTech, you can earn a
                      substantial residual income each month, helping you
                      achieve your financial dreams.
                    </p>
                    <p>
                      Our ISO enrollment program is designed to provide you with
                      the tools and support you need to succeed. Whether you're
                      new to the industry or an experienced professional, we're
                      here to help you thrive.
                    </p>
                    <p>
                      Don't miss this chance to make a significant impact on
                      your financial future. Contact our team of experts at
                      MTech Distributors by phone or email, or simply fill out
                      the form below, and we'll get back to you promptly.
                    </p>
                    <p>
                      Take the first step towards boosting your income with just
                      one phone call. Join MTech Distributors and be part of a
                      dynamic team that's transforming the payment processing
                      landscape.
                    </p> */}
                    <PortableText value={partnership.data.Section_Description} components={defaultPortableTextComponents} />
                  </div>
                </div>

                {/* <FeaturesList title="MTech Offers:" features={mtechOffers} /> */}
              </div>
              <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-center text-gray-700 dark:text-gray-300">
                  White Glove Services, Dedicated, Experienced, Account Managers
                  at your fingertips!
                </p>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-2">
              <AgentForm />
            </div>
          </div>

          {/* Final Tagline */}
        </div>
      </div>
      <Contact />
    </>
  );
};

export default PartnershipPage;
