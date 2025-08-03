"use client";

import Contact from "@/components/Contact";
import React, { useState } from "react";

const faqs = [
  {
    question: "What products and services does MTech Distributors LLC offer?",
    answer:
      "We provide a wide range of POS systems, payment processing solutions, ATM services, and retail technology products tailored for businesses of all sizes.",
  },
  {
    question: "How do I get support if I have an issue with my POS or ATM?",
    answer:
      "You can contact our support team at support@mtechdistributor.com or call our customer service number. We offer remote and on-site support depending on your needs.",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Please refer to our Return & Refund Policy page for detailed information on eligibility, exceptions, and the return process.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Shipping times vary based on your location and the product ordered. Most orders are processed within 1-2 business days and shipped via reliable carriers.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes. We use SSL encryption and follow industry best practices to ensure your payment and personal information are protected.",
  },
  {
    question: "Do you offer installation and training?",
    answer:
      "Absolutely! We provide professional installation and training for all our POS and ATM solutions to ensure your team is confident and ready to use the system.",
  },
  {
    question: "Can I integrate your POS with my existing hardware?",
    answer:
      "Many of our solutions are compatible with a wide range of hardware. Contact us to discuss your current setup and integration options.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships, you will receive a tracking number via email. You can also contact our support team for updates.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 tracking-tight text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/80 dark:bg-[#231A30]/80 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-[#2d2250]"
              >
                <button
                  className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
                  onClick={() => toggle(idx)}
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-panel-${idx}`}
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-6 h-6 transition-transform duration-300 ${openIndex === idx ? "rotate-180" : "rotate-0"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  id={`faq-panel-${idx}`}
                  className={`overflow-hidden transition-all duration-300 px-6 ${openIndex === idx
                      ? "max-h-96 opacity-100 py-2"
                      : "max-h-0 opacity-0 py-0"
                    }`}
                  aria-hidden={openIndex !== idx}
                >
                  <p className="text-gray-700 dark:text-gray-200 text-base pb-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-200">
              Still have questions?{" "}
              <a
                href="mailto:support@mtechdistributor.com"
                className="underline"
              >
                Contact us
              </a>{" "}
              and our team will be happy to help.
            </p>
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
};

export default FAQ;
