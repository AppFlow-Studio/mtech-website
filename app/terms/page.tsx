"use client";

import Contact from "@/components/Contact";
import React from "react";

const TermsAndConditions = () => {
  return (
    <>
      <section className="py-16 sm:py-24 min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Terms and Conditions
          </h1>
          <div className="bg-white dark:bg-[#231A30] rounded-2xl shadow-lg p-8 text-gray-700 dark:text-gray-200 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using this website, you agree to be bound by
                these Terms and Conditions. If you do not agree with any part of
                these terms, please do not use our website.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">2. Use of Website</h2>
              <p>
                The content provided on this website is for general
                informational purposes only. MTech Distributors LLC reserves the
                right to modify, suspend, or discontinue any part of the website
                at any time without notice.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">
                3. Intellectual Property
              </h2>
              <p>
                All content, trademarks, logos, and other intellectual property
                displayed on this website are the property of MTech Distributors
                LLC or its licensors. You may not reproduce, distribute, or use
                any content from this site without prior written permission.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">4. User Conduct</h2>
              <p>
                You agree not to use this website for any unlawful purpose or in
                any way that could harm, disable, or impair the website or
                interfere with any other party's use of the website.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">
                5. Third-Party Links
              </h2>
              <p>
                This website may contain links to third-party websites. MTech
                Distributors LLC is not responsible for the content or practices
                of any linked sites. Accessing third-party sites is at your own
                risk.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">
                6. Limitation of Liability
              </h2>
              <p>
                MTech Distributors LLC is not liable for any direct, indirect,
                incidental, or consequential damages arising from your use of
                this website or any content herein.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">
                7. Changes to Terms
              </h2>
              <p>
                We reserve the right to update or modify these Terms and
                Conditions at any time. Changes will be effective immediately
                upon posting. Your continued use of the website constitutes
                acceptance of the revised terms.
              </p>
            </section>
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
};

export default TermsAndConditions;
