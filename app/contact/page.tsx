import Contact from "@/components/Contact";
import Image from "next/image";

const ContactPage = () => {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* 
          Main Grid Container:
          - Default (mobile): A single column with text on top, image on bottom.
          - Large screens (lg): Switches to a two-column grid.
          - items-center vertically aligns the content on desktop.
        */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Column 1: Text Content */}
            <div className="text-center lg:text-left">
              <h1
                className="
              text-3xl md:text-4xl lg:text-5xl font-bold leading-tight
              text-gray-900 dark:text-white"
              >
                Compliance
              </h1>
              <p
                className="
              mt-6 leading-relaxed
              text-gray-600 dark:text-gray-300
              max-w-xl mx-auto lg:mx-0
            "
              >
                We take compliance seriously to protect your business and your
                customers. Our solutions are fully aligned with industry
                standards and regulatory requirements, including PCI DSS, EMV,
                and GDPR.
              </p>
              <div className="mt-8">
                <button
                  className="
                inline-flex items-center justify-center 
                px-8 py-4 rounded-full font-semibold text-white
                bg-gradient-to-r from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600
                hover:opacity-90 transition-opacity duration-300 shadow-lg
              "
                >
                  Buy Our Products
                </button>
              </div>
            </div>

            {/* Column 2: Image */}
            {/* On mobile, this will appear below the text. */}
            <div>
              <Image
                src="/compliance-handshake.png"
                alt="Business professionals shaking hands over a contract"
                width={800} // Defines the aspect ratio
                height={500} // Defines the aspect ratio
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
};

export default ContactPage;
