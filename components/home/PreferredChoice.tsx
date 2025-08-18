'use client'
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
import { sanityFetch } from "@/utils/sanity/lib/live";
import { defineQuery, PortableText } from "next-sanity";
import IconRender from "@/sanity/lib/icon-render";

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
const options = {
  next: {
    revalidate: 60,
  },
};
const PreferredChoice = (ComparisonData: any) => {
  if (!ComparisonData) return null;
  return (
    <div className="m-4 md:m-8 py-8 sm:py-12 bg-[#05070D1A] dark:bg-[#231A30] rounded-2xl">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl space-y-2 mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white">
            {ComparisonData.ComparisonData.data[0].title}
          </h2>
          <PortableText value={ComparisonData.ComparisonData.data[0].description} />
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
            <div className="rounded-lg overflow-hidden">
              <div className="grid grid-cols-[2fr_1fr_1fr]">
                {/* Loop generates the data rows INSIDE the shadowed box */}
                {ComparisonData.ComparisonData.data[0].rows
                  .map((item: any, index: number) => (
                    <>
                      {/* Data Cell 1: Feature */}
                      <div
                        key={item.feature}
                        className={`p-4 flex items-center gap-3 bg-white  ${index < comparisonData.length - 1
                            ? "border-b border-[#EEEEEE]"
                            : ""
                          }`}
                      >
                        <IconRender icon={item.icon} />
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
                        className={`p-4 flex justify-center items-center bg-white  ${index < comparisonData.length - 1
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
