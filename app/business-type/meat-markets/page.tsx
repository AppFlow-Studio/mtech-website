import BusinessTypePage from "@/components/business-type/BusinessTypePage";
import { client } from "@/sanity/lib/client";
import { Slide } from "@/lib/types";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const sliderData: Slide[] = [
  {
    title: "Streamlined Store Management",
    imageSrc: "/inventory-management.jpg",
    description: "Our POS system makes running a busy butcher shop effortless.",
    features: [
      {
        name: "Manage orders from everywhere using one system, whether it's your counter, phone, or online.",
      },
      {
        name: "Quick and on-demand access to all your businesses metrics.",
      },
      {
        name: "Smart order management sends orders straight to where they're needed, letting you focus on delivering the perfect experience for your customers.",
      },
    ],
    cta: "Get a Demo",
  },
  {
    title: "Empowering your inventory",
    imageSrc: "/inventory-empowerment.jpg",
    description:
      "Inventory for your butcher shop doesn't have to be overwhelming. Our POS system is designed to organize your meat market stress-free.",
    features: [
      {
        name: "With live inventory tracking, you'll always know exactly which - and how much of - your products you have in stock.",
      },
      {
        name: "Use automated stock notifications to stay on top of which products need to be restocked.",
      },
      {
        name: "Enable automated reordering based on criteria you define to ensure a steady supply of products.",
      },
      {
        name: "Vendor management is made easy with one dashboard to track your invoices and communications.",
      },
    ],
    cta: "Request a Quote",
  },
  {
    title: "Elevate Your Butcher Shop with our POS solutions",
    imageSrc: "/butcher-shop-pos.jpg",
    description:
      "Your butcher shop is so much more than just a business, it's a community staple where customers find the best cuts of meat. Take it to the next level with a POS that streamlines your operations without removing your authentic charm. Experience the perfect blend of tradition and modern efficiency with a POS system that simplifies sales, enhances customer service, and keeps your business running smoothly.",
    features: [],
  },
];

const options = { next: { revalidate: 30 } };

async function page() {
  const meatMarkets = await sanityFetch({
    query: defineQuery(`*[_type == "BUSINESS_TYPES" && business_type_link == "/meat-markets"]`),
    ...options,
  });
  if (!meatMarkets) {
    return <div>No data found</div>;
  }
  return (
    <BusinessTypePage businessType={meatMarkets.data[0]} />
  );
}

export default page;
