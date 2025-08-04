import BusinessTypePage from "@/components/business-type/BusinessTypePage";
import { Slide } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

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

const options = { next: { revalidate: 30 } };

async function page() {
  const qsr = await sanityFetch({
    query: defineQuery(`*[_type == "BUSINESS_TYPES" && business_type_link == "/qsr"]`),
    ...options,
  });
  if (!qsr) {
    return <div>No data found</div>;
  }
  return (
    <BusinessTypePage businessType={qsr.data[0]} />
  );
}

export default page;
