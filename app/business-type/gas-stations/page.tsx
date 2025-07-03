import FeatureSlider from "@/components/business-type/FeatureSlider";
import SolutionsGrid from "@/components/business-type/SolutionsGrid";
import StationManagement from "@/components/business-type/StationManagement";
import Contact from "@/components/Contact";
import { Slide } from "@/lib/types";

const sliderData: Slide[] = [
  {
    imageSrc: "/gas-station.jpg",
    title: "The Origin Story of Our Brand.",
    description:
      "Petro Outlet was conceived at the heart of the fueling industry by operators who knew exactly what works (and what doesn’t). With innovation as our engine and simplicity as our compass, we’ve created a POS solution that streamlines operations, uncovers growth opportunities, and puts profitability firmly in your hands.",
    features: [
      {
        name: "Born from Gas Station DNA We focused exclusively on fueling operations so you get solutions tailored to your world.",
      },
      {
        name: "By Operators, For Operators: Crafted by veteran operators who understood what off‑the‑shelf tools were missing.",
      },
      {
        name: "Passion‑Fueled Progress A deep love for solving real problems drives our continuous innovation cycle.",
      },
      {
        name: "Accessible Innovation Complex backend technology made simple, so anyone on your team can use it confidently.",
      },
      {
        name: "Power to Perform Petro Outlet gives you the insights and automation you need to save hours and boost margins.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    imageSrc: "/fuel-inventory.jpg",
    title: "Smarter Fuel Management for Gas Stations",
    description:
      "Veeder‑Root sets the industry standard in fuel‑tank monitoring—providing gas station operators with cutting‑edge hardware and software to streamline inventory, ensure regulatory compliance, and boost efficiency.",
    features: [
      {
        name: "Accurate Level Tracking",
        detail:
          "Continuous monitoring of fuel volume, temperature, and water presence keeps your data rock‑solid.",
      },
      {
        name: "Boosted Profits",
        detail:
          "Precision Probe TechnologyAdvanced sensors reduce measurement errors and protect your margins.",
      },
      {
        name: "Ordering Intelligence",
        detail:
          "Use historical analytics to plan fill‑ups proactively and reduce emergency orders.",
      },
      {
        name: "Built‑In Spill Defense",
        detail:
          "Early leak detection and alarms help you protect the environment and your bottom line.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    title: "Drive More Revenue with Car Wash & Service Bay Integration",
    imageSrc: "/car-wash-gas-station.jpg", // Update this path to your chosen image
    description:
      "Expand your gas station’s offerings with seamless car wash and service bay management. Our POS system lets you track sales, manage appointments, and offer bundled promotions—all from one platform.",
    features: [
      {
        name: "Car Wash Sales Tracking",
        detail: "Monitor car wash usage and revenue in real time.",
      },
      {
        name: "Service Bay Scheduling",
        detail: "Easily book and manage oil changes, tire rotations, and more.",
      },
      {
        name: "Bundled Promotions",
        detail:
          "Encourage customers to fuel up and get a wash with special deals.",
      },
      {
        name: "Customer Notifications",
        detail: "Send reminders and updates for scheduled services.",
      },
    ],
    cta: "Talk to an Expert",
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
              Gas Stations
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Gas Stations are essential service locations that provide fuel,
              automotive products, and convenience items for drivers on the go.
              In addition to dispensing gasoline and diesel, many gas stations
              also offer air pumps, car washes, and basic vehicle maintenance
              supplies.
            </p>
            <SolutionsGrid />
          </div>
        </div>
        <FeatureSlider sliderData={sliderData} />
        <StationManagement />
      </section>
      <Contact />
    </>
  );
}

export default page;
