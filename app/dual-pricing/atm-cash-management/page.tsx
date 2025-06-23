import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import Image from "next/image";

const AtmCashManagement = () => {
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
                ATM Cash Management
              </h1>
              <p
                className="
                  mt-6 leading-relaxed
                  text-gray-600 dark:text-gray-300
                  max-w-xl mx-auto lg:mx-0
                "
              >
                Large banking institutions have been in charge of ATM cash
                management for a period of time now; however, their competition
                with smaller ATM operators has caused an array of problems for
                the ATM industry. The private ATM market has seen an increase in
                prices over recent years and many businesses have had to close
                their accounts because of these heightened costs. To help you
                overcome these challenges, our cash management optimization
                software can help you determine when and how much money to
                restock your ATM machine with.
              </p>
              <h3
                className="
                  text-xl md:text-2xl font-medium leading-tight
                  text-gray-900 dark:text-white mt-6
                "
              >
                Benefits with ATM Cash Management
              </h3>
              <p
                className="
                  mt-6 leading-relaxed
                  text-gray-600 dark:text-gray-300
                  max-w-xl mx-auto lg:mx-0
                "
              >
                Increasing accessibility to both cash and ATMs is a crucial
                aspect of solving problems associated with ATM cash management
                in the field. Ways to do this include providing more machines in
                areas where they are needed, as well as ensuring that ATMs are
                stocked with ample amounts of money to meet customer needs. Cost
                reduction is also important, and can be prevented by processing
                through us and avoiding a high interest rate and increased fees
                from other banking institutions
              </p>
            </div>
            <div>
              <Image
                src="/atm-cash-management-collage.png"
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

export default AtmCashManagement;
