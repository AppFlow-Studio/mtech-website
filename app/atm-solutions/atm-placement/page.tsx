import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import Image from "next/image";

const AtmPlacement = () => {
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
                ATM Installation Programs
              </h1>
              <p
                className="
                  mt-6 leading-relaxed
                  text-gray-600 dark:text-gray-300
                  max-w-xl mx-auto lg:mx-0
                "
              >
                At MTech Distributors, we provide ATM placement programs
                tailored to the needs and budget of businesses across the
                country. Our team of experienced professionals have developed
                top level relationships with processors and systems to bring our
                customers the best possible rates on their purchases and
                placements. We understand that when it comes to ATMs, the
                decision requires careful consideration
              </p>
              <h3
                className="
                  text-xl md:text-2xl mt-6 font-medium leading-tight
                  text-gray-900 dark:text-white
                "
              >
                Placement with Full Service
              </h3>
              <p
                className="
                  mt-6 leading-relaxed
                  text-gray-600 dark:text-gray-300
                  max-w-xl mx-auto lg:mx-0
                "
              >
                If you are considering the financial advantages of having an ATM
                at your business, MTech’s ATM Placement Program is the perfect
                solution for you. Our team of highly skilled technicians and
                customer care representatives will provide you with all the
                necessary tools to ensure that installing and running an ATM is
                as easy and rewarding for you as possible. We will provide A to
                Z Customer service. This way you can focus on your business
                while we insure to make sure that the ATM is utilized to the
                best of its abilities in your location. All while you collect a
                surcharge for simply having the ATM in your place of business
              </p>
              <h3
                className="
                  text-xl md:text-2xl mt-6 font-medium leading-tight
                  text-gray-900 dark:text-white
                "
              >
                Merchant Owned & Operated
              </h3>
              <p
                className="
                  mt-6 leading-relaxed
                  text-gray-600 dark:text-gray-300
                  max-w-xl mx-auto lg:mx-0
                "
              >
                At Mtech, we understand when our merchants prefer to invest in
                the upfront cost of an ATM and cash load the machine themselves.
                We’re proud to offer a high profit share for those willing to
                take on this responsibility as well as provide them with stellar
                after-sale services. Our team of talented professionals can give
                you the guidance and training required to own and operate your
                own ATM while maximizing profits. 
              </p>
            </div>
            <div>
              <Image
                src="/atm-placement-collage.png"
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

export default AtmPlacement;
