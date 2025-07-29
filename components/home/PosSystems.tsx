
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { draftMode } from "next/headers";
import { sanityFetch } from "@/utils/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { PosSystemsQueryResult, PosSystemsQueryResultProps } from "@/lib/sanity-types";
import SanityImage from "../SanityImage";

// --- Data for the POS system cards ---
// This structure makes it easy to manage all content from one place.
const posSystemsData = [
  {
    name: "Supersonic POS",
    imageSrc: "/products/pos-supersonic.png",
    link: "/products/supersonic-pos",
    features: [
      "Supersonic Pos Bundle",
      "Supersonic Touch Screen",
      "Router",
      "POE Switch",
      "Cash Drawer",
      "More",
    ],
  },
  {
    name: "Figure POS",
    imageSrc: "/products/pos-figure.png",
    link: "/products/figure-pos",
    features: [
      "Receipt Printer",
      "Kitchen Printer",
      "Card Reader Option 1",
      "Card Reader Option 2",
      "Cash Drawer",
      "More",
    ],
  },
  {
    name: "On The Fly POS",
    imageSrc: "/products/pos-onthefly.png",
    link: "/products/on-the-fly-pos",
    features: [
      "Cash Drawer",
      "Pin Pad",
      "Receipt Printer",
      "Kitchen Printer",
      "Single Screen",
      "More",
    ],
  },
  {
    name: "Clover POS",
    imageSrc: "/products/pos-clover.png",
    link: "/products/clover",
    features: [
      "Clover Flex",
      "Clover Go",
      "Clover Mini",
      "Clover Station Duo",
      "Clover Station Solo",
      "More",
    ],
  },
];

const PosSystems_QUERY = defineQuery(`*[_type == 'POSSystems']`)

const options = { next: { revalidate: 30 } };

const  PosSystems = async () => {
  const { isEnabled } = await draftMode();
  const PosSystemsData : PosSystemsQueryResultProps = await sanityFetch({
    query: PosSystems_QUERY,
    ...options,
  });
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white">
          Our POS Systems
        </h2>

        {/* Responsive Grid for Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PosSystemsData.data[0].Pos_Systems.map((system) => (
            <div
              key={system.POS_System_Header}
              className="
              flex flex-col bg-[#E6E7E7] dark:bg-[#231A30] 
              rounded-2xl shadow-lg overflow-hidden
            "
            >
              {/* Image Container */}
              <div className="p-6 bg-white m-4 rounded-2xl">
                {/* <Image
                  src={system.POS_System_Image}
                  alt={`Image of ${system.POS_System_Header}`}
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain aspect-[4/3]"
                /> */}
                <SanityImage 
                  image={system.POS_System_Image}
                  alt={`Image of ${system.POS_System_Header}`}
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain aspect-[4/3]"
                />
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-2xl text-center text-gray-800 dark:text-gray-100">
                  {system.POS_System_Header}
                </h3>

                <Link
                  href={system.POS_System_Link}
                  className="inline-flex items-center justify-center gap-2 mt-4 w-full
                  px-6 py-3 rounded-full font-semibold bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white
                  transition-colors duration-300"
                >
                  Go to POS <ChevronRight className="h-5 w-5" />
                </Link>

                {/* Features List */}
                <p className="mt-6 space-y-3">
                  {system.POS_System_SubText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PosSystems;
