import BusinessTypePage from "@/components/business-type/BusinessTypePage";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from '@/utils/sanity/lib/live'
import { defineQuery } from "next-sanity";

const options = { next: { revalidate: 30 } };

async function page() {
  // Fetch business type data from Sanity
  const businessType = await sanityFetch({
    query: defineQuery(`*[_type == "BUSINESS_TYPES" && business_type_link == "/business-type"]`),
    ...options,
  });

  // If no data found, you might want to handle this case
  if (!businessType) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Business type not found
        </h1>
      </div>
    );
  }   

  return <BusinessTypePage businessType={businessType.data[0]} />;
}

export default page;
