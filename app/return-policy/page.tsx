"use client";

import Contact from "@/components/Contact";
import React from "react";

const ReturnPolicy = () => {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white dark:bg-[#231A30] rounded-3xl shadow-2xl p-10 md:p-14 border border-purple-100 dark:border-[#2d2250]">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 tracking-tight">
              Return & Refund Policy
            </h1>
            <div className="space-y-8 text-gray-700 dark:text-gray-200 text-lg">
              <section>
                <h2 className="text-2xl font-semibold mb-2 ">
                  Eligibility for Returns
                </h2>
                <p>
                  Your item must be in its original unused condition to be
                  returned, unless there is a manufacturer defect. You must
                  return the item within{" "}
                  <span className="font-semibold">7 days</span> of your
                  purchase.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2 ">
                  How to Request a Return
                </h2>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    Email{" "}
                    <a
                      href="mailto:support@mtechdistributors.com"
                      className="text-purple-700 underline"
                    >
                      support@mtechdistributors.com
                    </a>{" "}
                    to request a refund. We will assign you a tracking #.
                  </li>
                  <li>
                    Mail your returned item to:
                    <br />
                    <span className="block mt-2 font-medium">
                      MTECH DISTRIBUTORS
                      <br />
                      Returns Department Tracking #
                      <br />
                      182 Bay Ridge Avenue
                      <br />
                      Brooklyn, NY 11220
                    </span>
                  </li>
                  <li>
                    Include in your package a signed letter stating the reason
                    for your return and the original receipt.
                  </li>
                </ol>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2 ">
                  Return Exceptions
                </h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    No returns on ATM Machine & Point of Sale System purchases.
                  </li>
                  <li>
                    Merchandise that has been worn, used, or altered will not be
                    accepted for return or exchange.
                  </li>
                </ul>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2 ">Restocking Fee</h2>
                <p>
                  All items are subject to a{" "}
                  <span className="font-semibold">25% restocking fee</span>,
                  which will be deducted from your refund. We also do not refund
                  the original shipping and handling that you paid on the order.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2 ">Exchanges</h2>
                <p>
                  You may exchange your item if it is dead on arrival, processed
                  in error by MTECH Distributors, or faulty (must provide
                  details to{" "}
                  <a
                    href="mailto:support@mtechdistributors.com"
                    className="text-purple-700 underline"
                  >
                    support@mtechdistributors.com
                  </a>
                  ). In these cases, you will not be subject to a restocking fee
                  and will not have to pay return shipping.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
};

export default ReturnPolicy;
