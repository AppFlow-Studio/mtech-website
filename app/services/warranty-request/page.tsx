'use server'
import Contact from "@/components/Contact";
import { UploadCloud } from "lucide-react";
import React from "react";
import { sanityFetch } from "@/utils/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { defaultPortableTextComponents } from "@/app/atm-solutions/components/AtmSolutionHero";
import WarrantyForm from "./form";
const options = {
  next: {
    revalidate: 60,
  },
}
// --- Main Warranty Form Component ---
const WarrantySection = async () => {
  const WarrantyData = await sanityFetch({
    query: defineQuery('*[_type == "Warranty"]'),
    ...options,
  })
  if (!WarrantyData.data || WarrantyData.data.length === 0) return null;
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
              {WarrantyData.data[0].Warranty_Header}
            </h2>
            <PortableText value={WarrantyData.data[0].Warranty_SubText} components={defaultPortableTextComponents} />
          </div>

          {/* Form Container */}
          <WarrantyForm />
        </div>
      </section>
      <Contact />
    </>
  );
};

export default WarrantySection;
