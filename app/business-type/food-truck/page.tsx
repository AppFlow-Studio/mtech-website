import FeatureSlider from "@/components/business-type/FeatureSlider";
import Contact from "@/components/Contact";
import { Slide } from "@/lib/types";

const sliderData: Slide[] = [
  {
    imageSrc: "/food-truck-success.jpg",
    title: "Fast, Flexible, Food Truck Success",
    description:
      "Managing a food truck is busy work. Equip your truck with a reliable POS system to smooth out operations and provide efficient service.",
    features: [
      {
        name: "Mobile Flexibility: Manage transactions and view real-time sales data from any location with Our mobile POS system.",
      },
      {
        name: "Customizable Hardware: Choose the hardware that fits your food truck's setup perfectly, offering both flexibility and room to grow.",
      },
      {
        name: "Easy-to-Use Software: With software designed for simplicity, taking orders and processing payments becomes effortless, helping new staff get up to speed quickly.",
      },
    ],
    cta: "Talk to an Expert",
  },
  {
    imageSrc: "/lightning-fast-checkout.jpg",
    title: "Lightning-Fast Checkout",
    description:
      "For food trucks where speed is essential, Our POS Solutions streamlines the checkout process, ensuring fast and effortless transactions.",
    features: [
      {
        name: "Multiple Payment Methods: Our POS accepts tap, dip, swipe, Apple Pay, and Google Pay—catering to all customer preferences.",
      },
      {
        name: "Quick Checkout Process: A wide range of payment options means faster transactions and a smoother checkout experience.",
      },
      {
        name: "Fast and User-Friendly: Handle large carts effortlessly with our POS solution, which boasts ample memory and lightning-fast processing.",
      },
    ],
    cta: "Request a Quote",
  },
  {
    imageSrc: "/pos-on-the-go.jpg",
    title:
      "Wherever you go, our POS system keeps your business running smoothly.",
    description:
      "With our food truck POS, serve customers quickly and stay connected wherever your next stop is. Whether you're in a truck, cart, or trailer, our mobile-friendly system keeps your business moving.",
    features: [],
    cta: "",
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
              Food Truck
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Our food truck brings mouthwatering, freshly-prepared dishes
              straight to your neighborhood. Whether you're craving gourmet
              burgers, loaded tacos, or fusion street food, we serve up bold
              flavors with fast, friendly service. Follow us for daily locations
              and let your next meal be a delicious adventure.
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
