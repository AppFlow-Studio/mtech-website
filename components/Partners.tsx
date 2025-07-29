import Image from "next/image";
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";

// List of partners
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
    name: "nmi",
    logo: "/logos/nmi.png",
    width: 120,
    height: 40,
  },
  {
    name: "Converge",
    logo: "/logos/converge.png",
    width: 120,
    height: 40,
  },
  {
    name : 'Pax',
    logo : '/logos/pax_inc.png',
    width : 120,
    height : 40,
  },
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

const PartnerLogo = ({ partner }: { partner: (typeof partners)[0] }) => {
  return (
    <div
      className={cn(
        "flex-shrink-0 px-8 py-4",
      )}
    >
      <Image
        src={partner.logo}
        alt={`${partner.name} logo`}
        width={partner.width}
        height={partner.height}
        className="object-contain"
      />
    </div>
  );
};

const Partners = () => {
  return (
    <section className="py-16 sm:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our partners
        </h2>

        <div className="relative">
          <Marquee className="[--duration:20s]">
            {partners.map((partner) => (
              <PartnerLogo key={partner.name} partner={partner} />
            ))}
          </Marquee>

          {/* Gradient fade effects */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent dark:from-[#0B0119]"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent dark:from-[#0B0119]"></div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
