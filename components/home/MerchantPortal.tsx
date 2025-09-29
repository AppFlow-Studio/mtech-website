import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { sanityFetch } from "@/utils/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { defaultPortableTextComponents } from "@/app/atm-solutions/components/AtmSolutionHero";
import Link from "next/link";
import { urlFor } from "@/utils/sanity/lib/image";
const MerchantPortal = (MerchantPortalData: any) => {
  if (!MerchantPortalData) return null;
  return (
    <section className="m-4 md:m-8 py-8 sm:py-12 bg-[conic-gradient(from_200deg_at_75.74%_58.66%,#FFF_0deg,#E4E1F8_90deg,#FFF_180.02deg,#DEE8FA_270.58deg,#FFF_360deg)] dark:bg-[conic-gradient(from_200deg_at_75.74%_58.66%,rgba(255,255,255,0.20)_0deg,rgba(228,225,248,0.20)_90deg,rgba(255,255,255,0.20)_180.02280950546265deg,rgba(222,232,250,0.20)_270.5781555175781deg,rgba(255,255,255,0.20)_360deg)] rounded-2xl">
      <div className="container mx-auto px-4">
        {/* 
          Main Grid Container:
          - Default (mobile): A single column with text on top, image on bottom.
          - Large screens (lg): Switches to a two-column grid.
          - items-center vertically aligns the content on desktop.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Column 1: Text Content */}
          {/* On mobile, text is centered. On desktop, it's left-aligned. */}
          <div className="text-center lg:text-left">
            <h1
              className="
              text-xl md:text-3xl lg:text-4xl font-bold leading-tight
              text-gray-900 dark:text-white
            "
            >
              {MerchantPortalData?.MerchantPortalData?.Merchant_Portal_Title}
            </h1>
            <PortableText value={MerchantPortalData.MerchantPortalData.Merchant_Portal_SubText} components={defaultPortableTextComponents} />

            <div className="mt-8">
              <Link
                href={MerchantPortalData?.MerchantPortalData?.Merchant_Portal_Button_Link}
                className="
                inline-flex items-center justify-center gap-2 
                px-8 py-4 rounded-full font-semibold bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white transition-colors duration-300 shadow-lg"
              >
                {MerchantPortalData?.MerchantPortalData?.Merchant_Portal_Button_Text}
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Image */}
          {/* On mobile, this will appear at the bottom. */}
          <div>
            {MerchantPortalData?.MerchantPortalData?.Merchant_Portal_Image && <Image
              src={urlFor(MerchantPortalData?.MerchantPortalData?.Merchant_Portal_Image)?.url()}
              alt="MTech Merchant Portal dashboard shown on a laptop screen"
              width={1200}
              height={750}
              className="w-full h-auto"
            />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MerchantPortal;
