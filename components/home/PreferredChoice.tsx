"use client";

import Image from "next/image";
import {
  FileText,
  BadgeDollarSign,
  Laptop,
  Smile,
  BarChart2,
  ShieldCheck,
  Settings,
  GitFork,
  Headphones,
  MessageSquare,
  XCircle,
  CheckCircle2,
} from "lucide-react";

const comparisonData = [
  { icon: FileText, feature: "Reliable contracts", mtech: true, others: false },
  {
    icon: BadgeDollarSign,
    feature: "Transparent pricing",
    mtech: true,
    others: false,
  },
  {
    icon: Laptop,
    feature: "Versatile hardware & software options",
    mtech: true,
    others: true,
  },
  {
    icon: Smile,
    feature: "User friendly interface",
    mtech: true,
    others: true,
  },
  {
    icon: BarChart2,
    feature: "Robust reporting & analytics",
    mtech: true,
    others: true,
  },
  {
    icon: ShieldCheck,
    feature: "Strong security measures",
    mtech: true,
    others: true,
  },
  {
    icon: Settings,
    feature: "Setup process complexity",
    mtech: true,
    others: false,
  },
  {
    icon: GitFork,
    feature: "Omni channel fulfillment",
    mtech: true,
    others: false,
  },
  {
    icon: Headphones,
    feature: "Support & resources",
    mtech: true,
    others: false,
  },
  {
    icon: MessageSquare,
    feature: "Retrieval, request & chargeback assistance",
    mtech: true,
    others: false,
  },
];

const CheckIcon = () => (
  <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={1.5} />
);
const PurpleCheckIcon = () => (
  <CheckCircle2 className="h-5 w-5 text-purple-600" strokeWidth={1.5} />
);
const RedCrossIcon = () => (
  <XCircle className="h-5 w-5 text-red-500" strokeWidth={1.5} />
);

const PreferredChoice = () => {
  return (
    <div className="m-4 md:m-8 py-8 sm:py-12 bg-[#05070D1A] dark:bg-[#231A30] rounded-2xl">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white">
            Why We're the Preferred Choice
          </h2>
          <p className="mt-8 text-lg text-gray-600 dark:text-gray-300">
            Choosing a partner who truly understands your business is essential.
            Our solutions streamline payment processing and enhance your
            financial performance — see how we compare to others.
          </p>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[700px] lg:min-w-full">
            {/* A. THE HEADERS - Separate from the table body, with NO background */}
            <div className="grid grid-cols-[2fr_1fr_1fr]">
              <div></div> {/* Empty space for alignment */}
              <div className="flex justify-center bg-purple-500 dark:bg-purple-600 rounded-t-2xl">
                <Image
                  src="/mtech-logo-white.svg"
                  alt="MTech Logo"
                  width={80}
                  height={30}
                  className="w-full h-auto"
                />
              </div>
              <div className="flex justify-center items-end">
                <h3 className="font-bold text-gray-600 dark:text-gray-300">
                  Others
                </h3>
              </div>
            </div>

            {/* B. THE TABLE BODY - This is the container with the shadow and rounded corners */}
            <div className="shadow-lg rounded-lg overflow-hidden">
              <div className="grid grid-cols-[2fr_1fr_1fr]">
                {/* Loop generates the data rows INSIDE the shadowed box */}
                {comparisonData.map((item, index) => (
                  <>
                    {/* Data Cell 1: Feature */}
                    <div
                      key={item.feature}
                      className={`p-4 flex items-center gap-3 bg-white  ${
                        index < comparisonData.length - 1
                          ? "border-b border-[#EEEEEE]"
                          : ""
                      }`}
                    >
                      <item.icon className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-[#05070D]">
                        {item.feature}
                      </span>
                    </div>

                    {/* Data Cell 2: MTech */}
                    <div
                      key={`${item.feature}-mtech`}
                      className="p-4 flex justify-center items-center bg-purple-500 dark:bg-purple-600"
                    >
                      {item.mtech ? <CheckIcon /> : null}
                    </div>

                    {/* Data Cell 3: Others */}
                    <div
                      key={`${item.feature}-others`}
                      className={`p-4 flex justify-center items-center bg-white  ${
                        index < comparisonData.length - 1
                          ? "border-b border-[#EEEEEE]"
                          : ""
                      }`}
                    >
                      {item.others ? <PurpleCheckIcon /> : <RedCrossIcon />}
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferredChoice;
