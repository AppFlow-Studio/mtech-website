'use server'
import Contact from "@/components/Contact";
import ImageLinkCard from "@/components/ImageLinkCard";
import { ImageLinkCardProps } from "@/lib/types";
import { sanityFetch } from "@/utils/sanity/lib/live";
import { PortableText } from "@portabletext/react";
import { defineQuery } from "next-sanity";
import { defaultPortableTextComponents } from "@/app/atm-solutions/components/AtmSolutionHero";
const repairCenterCards: ImageLinkCardProps[] = [
  {
    title: "House Of Wings Testimonial",
    imageSrc: "/repair-house-of-wings.png",
    link: "/review",
  },
  {
    title: "Osos Pet Supply Testimonial",
    imageSrc: "/repair-pet-supply.png",
    link: "/review",
  },
];

{/* Responsive Grid for Cards */}
{/* <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
{repairCenterCards.map((card) => (
  // Use the new component here
  <ImageLinkCard key={card.title} {...card} />
))}
</div> */}
const options = {
  next: {
    revalidate: 60,
  },
}
const RepairCenter = async() => {
  const RepairCenterData = await sanityFetch({
    query: defineQuery('*[_type == "RepairCenter"]'),
    ...options,
  })
  if (!RepairCenterData.data || RepairCenterData.data.length === 0) return null;
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
              {RepairCenterData.data[0].Repair_Center_Header}
            </h2>
            <PortableText value={RepairCenterData.data[0].Repair_Center_SubText} components={defaultPortableTextComponents} />
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
};

export default RepairCenter;
