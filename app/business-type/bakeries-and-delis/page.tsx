import FeatureSlider from "@/components/business-type/FeatureSlider";
import Contact from "@/components/Contact";
import { Slide } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import BusinessTypePage from "@/components/business-type/BusinessTypePage";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const sliderData: Slide[] = [
  {
    imageSrc: "/bakery-payment-counter.jpg",
    title: "Simple, Flexible Payments for Bakeries & Delis",
    description:
      "Our POS system offers versatile payment options built to meet the unique demands of bakeries, delis, and specialty food businesses. Whether you're managing a rush at the counter or taking phone orders for a catering event, we make payments simple and secure.",
    features: [
      {
        name: "Phone Orders",
        detail:
          "Keep it convenient, take secure payments right over the phone.",
      },
      {
        name: "Catering Events",
        detail:
          "Process payments on the spot or in advance for catering jobs, ensuring hassle-free transactions.",
      },
      {
        name: "In-Store Checkout",
        detail:
          "Accept contactless, chip, swipe, or digital wallet payments in-store.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    imageSrc: "/bakery-customers.jpg",
    title: "More Revenue. Same Great Service.",
    description:
      "With our POS system, you can lower your costs and raise your profits without changing how you serve your customers.",
    features: [
      {
        name: "Reduced Fees",
        detail: "Stop losing money to high rates.",
      },
      {
        name: "Boosted Profits",
        detail: "More earnings from every sale.",
      },
      {
        name: "Top-Quality Experience",
        detail: "Offer smooth, professional service without the high cost.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    title: "Your Bakery, Made Sweeter with Our POS System",
    imageSrc: "/busy-bakery.jpg",
    description:
      "Running a busy bakery takes heart and the right tools. Our POS system simplifies your daily workflow, helping you serve customers faster and keep your shelves full, all while growing your business.",
    features: [],
  },
];

const options = { next: { revalidate: 30 } };

async function page() {
  const bakeriesAndDelis = await sanityFetch({
    query: defineQuery(`*[_type == "BUSINESS_TYPES" && business_type_link == "/bakeries-and-delis"]`),
    ...options,
  });
  if (!bakeriesAndDelis) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bakeries and Delis not found
        </h1>
      </div>
    )
  }
  return (
    <BusinessTypePage businessType={bakeriesAndDelis.data[0]} />
  )
}

export default page;
