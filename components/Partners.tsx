import Image from "next/image";

//list of partners
const partners = [
  {
    name: "SuperSonic POS",
    logo: "/logos/supersonic-pos.png",
    width: 120,
    height: 40,
  },
  { name: "Figure", logo: "/logos/figure.png", width: 100, height: 40 },
  { name: "On The Fly", logo: "/logos/on-the-fly.png", width: 130, height: 50 },
  { name: "Clover", logo: "/logos/clover.png", width: 120, height: 40 },
  {
    name: "Valor PayTech",
    logo: "/logos/valor-paytech.webp",
    width: 150,
    height: 50,
  },
  {
    name: "Authorize.Net",
    logo: "/logos/authorize-net.png",
    width: 180,
    height: 60,
  },
];

const Partners = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our partners
        </h2>
        <div
          className="
            flex items-center justify-start gap-x-12 overflow-x-auto pb-4
            lg:grid lg:grid-cols-6 lg:items-center lg:justify-items-center lg:gap-x-8 lg:overflow-x-visible
          "
        >
          {partners.map((partner) => (
            <div key={partner.name} className="flex-shrink-0">
              {/* Using Next.js Image component for optimization */}
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                width={partner.width}
                height={partner.height}
                className="object-contain" // Ensures the logo fits without distortion
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
