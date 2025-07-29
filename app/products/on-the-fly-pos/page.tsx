import HardwareSection from "@/components/HardwareSection";
import ProductGridLayout from "@/components/ProductGridLayout";
import PricingSection from "@/components/products/PricingSection";
import RatesComparison from "@/components/products/RatesComparison";
import { Product } from "@/lib/types";

const onTheFlyPosProducts: Product[] = [
  {
    name: "On The Fly POS",
    description:
      "On The Fly POS is a dynamic and intuitive point-of-sale system specifically tailored for fast-paced hospitality environments. It is the best choice for businesses such as bars, coffee shops, quick-service restaurants, and pizzerias where speed and accuracy are paramount. The system is designed to handle complex ordering, rapid payments, and efficient kitchen communication, helping to turn tables faster and improve customer service. With its user-friendly interface and industry-specific features, On The Fly POS helps streamline operations from the front of house to the back.",
    imageSrc: "/products/product-29.png",
    link: "on-the-fly-pos",
    inStock: true,
    tags: ["pos system"],
  },
];

function page() {
  return (
    <>
      <ProductGridLayout
        title="On the Fly POS"
        totalInitialProducts={onTheFlyPosProducts.length}
        initialProducts={onTheFlyPosProducts}
      />
      <PricingSection />
      <RatesComparison />
      <HardwareSection />
    </>
  );
}

export default page;
