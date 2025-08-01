import FeatureSlider from "@/components/business-type/FeatureSlider";
import Contact from "@/components/Contact";
import { Slide } from "@/lib/types";

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

function page() {
  return (
    <>
      <section className="py-16 sm:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Bakeries and Delis
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Bakeries and Delis are specialty food service establishments that
              offer freshly prepared items such as breads, pastries, sandwiches,
              meats, cheeses, and ready-to-eat meals. Bakeries focus on baked
              goods like cakes, cookies, and artisan breads, while delis serve
              sliced meats, cheeses, salads, and made-to-order sandwiches.
            </p>
          </div>
        </div>
        <FeatureSlider sliderData={sliderData} />
      </section>
      <Contact />
    </>
  );
}

export default page;
