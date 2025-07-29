
import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Phone,
  Mail,
} from "lucide-react";
import { sanityFetch } from '@/utils/sanity/lib/live'
import { defineQuery } from 'next-sanity'
import { FooterQueryResultProps } from "@/lib/sanity-types";
import { draftMode } from "next/headers";
import SanityImage from "./SanityImage";

const productLinks = [
  {
    name: "POS Systems",
    href: `/products?data=${encodeURIComponent(
      JSON.stringify({ tags: ["pos system"] })
    )}`,
  },
  {
    name: "Credit Card Terminals",
    href: `/products?data=${encodeURIComponent(
      JSON.stringify({ tags: ["credit card terminals"] })
    )}`,
  },
  {
    name: "ATM Machines",
    href: `/products?data=${encodeURIComponent(
      JSON.stringify({ tags: ["atm machines"] })
    )}`,
  },
  {
    name: "Integrations",
    href: `/products?data=${encodeURIComponent(
      JSON.stringify({ tags: ["integrations"] })
    )}`,
  },
];

const resourceLinks = [
  { name: "Return Policy", href: "/return-policy" },
  { name: "Terms and Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "FAQs", href: "/faq" },
];

const socialLinks = [
  { icon: Facebook, href: "#", name: "Facebook" },
  { icon: Twitter, href: "#", name: "Twitter" },
  { icon: Linkedin, href: "#", name: "LinkedIn" },
  { icon: Instagram, href: "#", name: "Instagram" },
];

const Footer_Query = defineQuery(`*[_type == 'Footer']`)

const options = { next: { revalidate: 30 } };

const  Footer = async () => {
  const { isEnabled } = await draftMode();
  const FooterData : FooterQueryResultProps = await sanityFetch({
    query: Footer_Query,
    ...options,
  });
  return (
    <footer className="bg-[#380D52] text-gray-300">
      <div className="container mx-auto pt-16 pb-8 px-4">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Logo, Description, Socials */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              {/* <Image src="/logo.png" alt="MTech" width={150} height={50} /> */}
              <SanityImage
                image={FooterData.data[0].Footer_Logo}
                alt="MTech"
                width={150}
                height={50}
              />
            </Link>
            <p className="mt-4 max-w-md">
              {FooterData.data[0].Footer_Description}
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Product Links */}
          <div>
            <h3 className="font-bold text-white text-lg">Product</h3>
            <ul className="mt-4 space-y-3">
              {FooterData.data[0].Footer_Product_Links.map((link) => (
                <li key={link.Footer_Product_Link_Name}>
                  <Link
                    href={link.Footer_Product_Link_Url}
                    className="hover:text-white transition-colors"
                  >
                    {link.Footer_Product_Link_Name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources Links */}
          <div>
            <h3 className="font-bold text-white text-lg">Resources</h3>
            <ul className="mt-4 space-y-3">
              {FooterData.data[0].Footer_Resource_Links.map((link) => (
                <li key={link.Footer_Resource_Link_Name}>
                  <Link
                    href={link.Footer_Resource_Link_Url}
                    className="hover:text-white transition-colors"
                  >
                    {link.Footer_Resource_Link_Name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="font-bold text-white text-lg">Contact Us</h3>
            <ul className="mt-4 space-y-3">
              {FooterData.data[0].Footer_Contact_Links.map((link) => (
                <li key={link.Footer_Contact_Link_Name} className="flex items-center gap-2">
                  {link.Footer_Resource_Link_Icon == "phone" ? <Phone className="h-5 w-5 flex-shrink-0" /> : <Mail className="h-5 w-5 flex-shrink-0" />}
                  <a href={link.Footer_Resource_Link_Icon == "phone" ? `tel:${link.Footer_Contact_Link_Url}` : `mailto:${link.Footer_Contact_Link_Url}`} className="hover:text-white transition-colors break-all">{link.Footer_Contact_Link_Name}</a>
                </li>
              ))}
              {/* <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <Link
                  href="mailto:support@mtechdistributors.com"
                  className="hover:text-white transition-colors break-all"
                >
                  support@mtechdistributors.com
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Separator and Copyright */}
        <div className="mt-12 border-t border-white/20 pt-8">
          <p className=" text-[#F0F3FD]">
            © {new Date().getFullYear()} MTech Distributors
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
