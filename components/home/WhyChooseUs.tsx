import Image from "next/image";
import SanityImage from "../SanityImage";

const WhyChooseUs = ({ header, subtext, image }: { header: string, subtext: string, image: string }) => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* 
          Main Grid Container:
          - Default (mobile): A single column grid with a gap between the text and image.
          - Large screens (lg): Switches to a two-column grid.
          - items-center vertically aligns the content in both columns on desktop.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Column 1: Text Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl leading-tight mb-6">
              {header}
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              {subtext}
            </p>
          </div>

          {/* Column 2: Image */}
          {/* On mobile, the image will appear below the text due to the grid stacking. */}
          <div>
            {/* <Image
              src={image} // IMPORTANT: Update this path to your image file
              alt="A customer paying with a credit card at a point-of-sale terminal"
              width={800} // This is for aspect ratio, not fixed size
              height={600} // This is for aspect ratio, not fixed size
              className="w-full h-auto rounded-xl shadow-lg"
            /> */}
            <SanityImage image={image} alt="Why Choose Us"  className="w-full h-auto rounded-xl shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
