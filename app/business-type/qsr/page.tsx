import FeatureSlider from "@/components/business-type/FeatureSlider";
import Contact from "@/components/Contact";
import { Slide } from "@/lib/types";

const sliderData: Slide[] = [
  {
    imageSrc: "/fast-food-restaurant-checkout.jpg",
    title: "Handle High Volumes with Payment Agility",
    description:
      "Handle High Volumes with Payment Agility From cash sales and card swipes to contactless wallets and online checkouts, our POS system keeps every transaction smooth",
    features: [
      {
        name: "Our POS system brings together cash, credit/debit, mobile wallets, and online payments into one seamless checkout experience.",
      },
      {
        name: "Handle diverse payment methods effortlessly—so you maintain peak efficiency during every shift.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    imageSrc: "/coffee-shop-customer.jpg",
    title: "Taste the Perks",
    description:
      "With our POS system, boba bars, cafés, and hookah lounges can set up and run rewards programs effortlessly—turning first-time guests into lifelong fans.",
    features: [
      {
        name: "Simplify Your Rewards Strategy",
        detail:
          "Our POS system puts loyalty program management at your fingertips, automating points, perks, and promotions for maximum impact.",
      },
      {
        name: "Incentivize Every Return",
        detail:
          "With our POS system’s built-in promo suite, you can quickly set up targeted offers and track their impact—driving customers back time after time.",
      },
      {
        name: "Build Loyalty That Lasts",
        detail:
          "Our POS system streamlines loyalty program setup and delivers personalized promotions—creating the kind of memorable experiences that inspire repeat visits.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    title: "Discover the Hospitality Hub",
    imageSrc: "/restaurant.jpg",
    description:
      "Aromatic coffees, fresh bagels, playful boba creations, and the mellow atmosphere of hookah lounges, all converge to create destinations where visitors can unwind, socialize, and treat themselves.",
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
              QSR / Food & Beverage
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              QSR (Quick Service Restaurants) and Food & Beverage businesses
              focus on delivering fast, convenient, and consistent meals,
              snacks, and drinks to customers on the go. This category includes
              fast food chains, cafés, food trucks, juice bars, and casual
              dining spots where speed, efficiency, and customer satisfaction
              are key.
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
