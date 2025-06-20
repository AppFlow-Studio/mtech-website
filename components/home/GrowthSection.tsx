import Image from "next/image";

const GrowthSection = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="lg:order-1">
            <Image
              src="/business-growth.png"
              alt="A man presenting a growth chart in a business meeting"
              width={800} // Defines the aspect ratio for Next.js Image
              height={600} // Defines the aspect ratio for Next.js Image
              className="w-full h-auto rounded-2xl"
            />
          </div>

          {/* Column 2: Text Content */}
          {/* On mobile, this will stack below the image. */}
          <div className="lg:order-2">
            <h2
              className="
              text-3xl md:text-4xl font-bold leading-tight
              text-gray-900 dark:text-white
            "
            >
              Customized solutions and strategies for business growth
            </h2>
            <p
              className="
              mt-4 text-lg leading-relaxed
              text-gray-600 dark:text-gray-300
            "
            >
              MTech Distributors provides an extensive array of valuable
              benefits designed to meet the diverse needs of businesses,
              regardless of their size or industry. Some of the standout
              advantages include:
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthSection;
