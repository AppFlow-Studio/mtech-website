// components/PreferredPayment.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

// --- Data for the payment method cards ---
const paymentMethods = [
  {
    title: "Credit Card Terminals",
    imageSrc: "/payment-methods/credit-cards.png",
    link: "#",
  },
  {
    title: "Digital Wallets",
    imageSrc: "/payment-methods/digital-wallets.png",
    link: "#",
  },
  {
    title: "ACH & Bank Transfers",
    imageSrc: "/payment-methods/ach-transfers.png",
    link: "#",
  },
  {
    title: "Mobile Payments",
    imageSrc: "/payment-methods/mobile-payments.png",
    link: "#",
  },
  {
    title: "QR Codes & SMS Links",
    imageSrc: "/payment-methods/qr-codes.png",
    link: "#",
  },
  {
    title: "Recurring & E-Invoicing",
    imageSrc: "/payment-methods/e-invoicing.png",
    link: "#",
  },
];

const PreferredPayment = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Choose Your Preferred Payment
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            We make it easy for your customers to pay their way. Whether it's
            credit or debit cards, mobile wallets, contactless payments, or
            online invoicing.
          </p>
        </div>

        {/* Responsive Grid for Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paymentMethods.map((method) => (
            <Link key={method.title} href={method.link} className="group block">
              <div
                className="bg-[#E6E7E7] dark:bg-[#231A30] rounded-2xl shadow-lg overflow-hidden flex flex-col h-full
              "
              >
                <div className="m-4 rounded-lg bg-[#B8B9BB] dark:bg-[#4C4659]">
                  <Image
                    src={method.imageSrc}
                    alt={method.title}
                    objectFit="contain"
                    width={300}
                    height={200}
                    className="w-full h-auto object-contain aspect-[4/3]"
                  />
                </div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 px-5 py-2">
                  {method.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreferredPayment;
