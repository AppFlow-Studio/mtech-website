import FeatureSlider from "@/components/business-type/FeatureSlider";
import Contact from "@/components/Contact";
import { Slide } from "@/lib/types";

const sliderData: Slide[] = [
  {
    imageSrc: "/hair-salon.jpg",
    title: "Simplified Management",
    description:
      "Simplify Bookings and Inventory, Our POS system streamlines appointment scheduling and stock tracking, so you can focus on styling, not spreadsheets.",
    features: [
      {
        name: "Real-Time Tracking",
        detail:
          "Keep an eye on inventory levels and product movement effortlessly.",
      },
      {
        name: "Instant Inventory & Schedule Updates",
        detail:
          "With our POS system, you’ll get immediate updates on stock counts and appointment bookings to ensure seamless service.",
      },
      {
        name: "Flexible Feature Configuration",
        detail:
          "Our POS system lets you turn features on or off and arrange workflows to mirror your salon’s exact process.",
      },
      {
        name: "Optimize Your Workflow",
        detail:
          "Automate supply management and appointment workflows with our POS system for effortless, efficient operations every day.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    imageSrc: "/salon-client.jpg",
    title: "All-Inclusive Feature Suite",
    description:
      "Transform your salon with our POS system’s seamless promotion builder, centralized client and team management, and live stock-level syncing.",
    features: [
      {
        name: "Personalized Promo Toolkit",
        detail:
          "Use our POS system to craft and schedule promotions that align with your service menu and audience preferences.",
      },
      {
        name: "Comprehensive Client Profiles",
        detail:
          "Our POS system captures appointment history, service preferences, and purchase records to tailor each visit.",
      },
      {
        name: "Team Management Made Simple",
        detail:
          "Our POS system handles shift assignments, captures productivity stats, and simplifies staff alerts, so you can focus on customer service.",
      },
      {
        name: "Instant Inventory Sync",
        detail:
          "Our POS system tracks every item in real time, giving you the clarity to prevent stockouts and maximize sales.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    title: "Empower Your Beauty Business with Our POS System",
    imageSrc: "/salon-pos.jpg",
    description:
      "Small beauty and hair shops foster personal connections but struggle with time-heavy checkouts. Tracking several services per appointment by hand becomes a bottleneck. Our POS system solves this by placing every service on its own button, turning complex tabs into instant, accurate payments.",
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
              Beauty Salon
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Beauty Salons are professional service establishments dedicated to
              enhancing personal appearance and well-being through a range of
              cosmetic and grooming treatments. Services often include haircuts,
              styling, coloring, manicures, pedicures, facials, waxing, and
              skincare treatments
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
