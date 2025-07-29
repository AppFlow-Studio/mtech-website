import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import Image from "next/image";

const AtmMaketing = () => {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Column 1: Text Content */}
            <div className="text-center lg:text-left">
              <h1
                className="
                  text-3xl md:text-4xl font-medium leading-tight
                  text-gray-900 dark:text-white
                "
              >
                Wraps around ATMs and Advertisements on Screens
              </h1>
              <p
                className="
                  mt-6 leading-relaxed
                  text-gray-600 dark:text-gray-300
                  max-w-xl mx-auto lg:mx-0
                "
              >
                At MTech, we understand that ATM marketing is an effective way
                to attract business and increase revenue. Our team of
                professionals will work closely with you to create visually
                appealing ATM advertisement that will not only target your
                customer's attention but also help you maximize your profits.
              </p>
              <p
                className="
                  mt-6 leading-relaxed
                  text-gray-600 dark:text-gray-300
                  max-w-xl mx-auto lg:mx-0
                "
              >
                We provide high-quality signage for all our ATM sites, helping
                increase revenue. We can provide ATM Coroplast signage, lit up
                LED Signs and wraps that will cover your ATM with any
                advertisement of your liking.
              </p>
            </div>
            <div>
              <Image
                src="/atm-marketing-collage.png"
                alt="A collage of modern payment processing images"
                width={800} // Defines the aspect ratio
                height={550} // Defines the aspect ratio
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default AtmMaketing;
