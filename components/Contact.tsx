"use client";

import { Phone, Mail } from "lucide-react";

// --- Reusable Input Field Sub-component for cleaner code ---
const InputField = ({
  id,
  label,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <div className="mt-1">
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className="
          w-full px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white
          focus:ring-2 focus:ring-purple-500 focus:border-purple-500
          transition-all duration-200 outline-none
        "
      />
    </div>
  </div>
);

const Contact = () => {
  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* --- Section Header --- */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
            Let's Start a Conversation
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Have a question, need support, or just want to learn more about our
            services? We're here to help. Fill out the form below and a member
            of our team will get back to you promptly.
          </p>
        </div>

        {/* --- Main Content Grid (Form and Info) --- */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Column 1: Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Contact With Us
            </h2>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputField
                  id="first-name"
                  label="First Name"
                  placeholder="Jahidul Islam"
                />
                <InputField
                  id="last-name"
                  label="Last Name"
                  placeholder="Jidan"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputField
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="example@gmail.com"
                />
                <InputField
                  id="phone"
                  label="Phone"
                  type="tel"
                  placeholder="0123 456 789"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Type here"
                    className="w-full px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none"
                  ></textarea>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="
                    inline-flex items-center justify-center 
                    px-10 py-3 rounded-full font-semibold text-white
                    bg-gradient-to-b from-[#662CB2] to-[#2C134C]
                    hover:opacity-90 transition-opacity duration-300 shadow-lg
                  "
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Column 2: Company Info */}
          <div className="mt-12 lg:mt-0">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Company Contact Info
            </h2>
            <ul className="mt-8 space-y-4 text-lg">
              <li className="flex items-center gap-3">
                <Phone className="h-6 w-6" />
                <span className="text-gray-700 dark:text-gray-300">
                  888-411-7583
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-6 w-6" />
                <a
                  href="mailto:support@mtechdistributors.com"
                  className="text-gray-700 dark:text-gray-300 hover:underline"
                >
                  support@mtechdistributors.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
