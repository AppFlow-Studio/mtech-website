"use client";

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

const productLinks = [
  { name: "POS Systems", href: "/products/pos" },
  { name: "Credit Card Terminals", href: "/products/terminals" },
  { name: "ATM Machines", href: "/products/atm" },
  { name: "Integrations", href: "/integrations" },
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

const Footer = () => {
  return (
    <footer className="bg-[#380D52] text-gray-300">
      <div className="container mx-auto pt-16 pb-8 px-4">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Logo, Description, Socials */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image src="/logo.png" alt="MTech" width={150} height={50} />
            </Link>
            <p className="mt-4 max-w-md">
              Teck Distributors delivers innovative payment solutions, including
              card processing, POS systems, and business support tools designed
              to help merchants grow.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Product Links */}
          <div>
            <h3 className="font-bold text-white text-lg">Product</h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources Links */}
          <div>
            <h3 className="font-bold text-white text-lg">Resources</h3>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="font-bold text-white text-lg">Contact Us</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>888-411-7583</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a
                  href="mailto:support@mtechdistributors.com"
                  className="hover:text-white transition-colors break-all"
                >
                  support@mtechdistributors.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Separator and Copyright */}
        <div className="mt-12 border-t border-white/20 pt-8">
          <p className=" text-[#F0F3FD]">
            © {new Date().getFullYear()} Teck Distributors
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
