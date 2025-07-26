import Image from "next/image";
import SanityImage from "../SanityImage";

const ModernPaymentsIntro = ({ header, subtext, image }: { header: string, subtext: string, image: string }) => {
  return (
    <section className="pt-16 sm:pt-24 pb-8 sm:pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Column 1: Text Content */}
          <div>
            <h1
              className="
              text-4xl md:text-5xl font-bold leading-tight
              text-gray-900 dark:text-white
            "
            >
              {header}
            </h1>
            <p
              className="
              mt-4 text-lg leading-relaxed
              text-gray-600 dark:text-gray-300 max-w-xl
            "
            >
              {subtext}
            </p>
          </div>

          {/* Column 2: Image with Highlight Border */}
          <div>
            {/* <Image
              src="/barista-payment.png"
              alt="A customer paying a barista with a tap-to-pay card"
              width={700}
              height={500}
              className="w-full h-auto rounded-2xl"
            /> */}
            <SanityImage image={image} width={700} height={500} alt="Modern Payments Intro" className="w-full h-auto rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernPaymentsIntro;
