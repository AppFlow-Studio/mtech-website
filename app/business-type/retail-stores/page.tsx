import BusinessTypePage from "@/components/business-type/BusinessTypePage";
import FeatureSlider from "@/components/business-type/FeatureSlider";
import Contact from "@/components/Contact";
import { Slide } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const sliderData: Slide[] = [
  {
    imageSrc: "/retail-store-inventory.jpg",
    title: "Take Control of Your Inventory",
    description:
      "Our POS system is designed to simplify inventory management, helping you stay stocked, stay organized, and stay ready.",
    features: [
      {
        name: "Real-Time Tracking",
        detail:
          "Keep an eye on inventory levels and product movement effortlessly.",
      },
      {
        name: "Automated Reordering",
        detail: "Prevent out-of-stock issues with automated restock triggers.",
      },
      {
        name: "Custom Alerts",
        detail:
          "Set up low-stock, expiry, and fast-seller alerts tailored to your needs.",
      },
      {
        name: "Improve Accuracy",
        detail: "Reduce human error and optimize inventory performance.",
      },
      {
        name: "Stay in Control",
        detail:
          "Proactively manage inventory and avoid unnecessary disruptions.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    imageSrc: "/smart-scales.jpg",
    title: "Fortify Your Retail Defense with Advanced Loss Prevention",
    description:
      "Safeguard your store from theft, fraud, and shrinkage with the powerful security features built into our POS system.",
    features: [
      {
        name: "Staff Controls",
        detail: "Manage who can do what with customizable access levels.",
      },
      {
        name: "Real-Time Tracking",
        detail: "Keep tabs on every transaction as it happens.",
      },
      {
        name: "Security Camera Integration",
        detail: "Sync surveillance systems with your POS for full visibility.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    title: "Turning Cents into Success",
    imageSrc: "/butcher-shop-pos.jpg",
    description:
      "In today’s budget‑focused market, dollar and hardware stores are go‑to destinations for value‑seeking shoppers. To turn each transaction into a smooth experience and keep customers coming back, you need a partner who understands your pace, your margins, and your mission.",
    features: [],
  },
];

const options = { next: { revalidate: 30 } };

async function page() {
  const retailStores = await sanityFetch({
    query: defineQuery(`*[_type == "BUSINESS_TYPES" && business_type_link == "/retail-stores"]`),
    ...options,
  });
  if (!retailStores) {
    return <div>No data found</div>;
  }
  return (
    <BusinessTypePage businessType={retailStores.data[0]} />
  );
}

export default page;
