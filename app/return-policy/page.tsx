
import Contact from "@/components/Contact";
import { draftMode } from "next/headers";
import { sanityFetch } from "@/utils/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { PortableText, PortableTextComponents } from '@portabletext/react'

const ReturnPolicy_QUERY = defineQuery(`*[_type == 'ReturnPolicy']`)
const options = {
  next: {
    revalidate: 60,
  },
}

const components: PortableTextComponents = {
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-gray-700 dark:text-gray-200">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="text-gray-700 dark:text-gray-200">
        {children}
      </li>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-gray-700 dark:text-gray-200">
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {children}
      </h3>
    ),
  },
}


const ReturnPolicy = async () => {
  const { isEnabled } = await draftMode();
  const ReturnPolicyData: any = await sanityFetch({
    query: ReturnPolicy_QUERY,
    ...options,
  });
  //console.log(ReturnPolicyData.data[0].ReturnPolicy_Section[1]);
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white dark:bg-[#231A30] rounded-3xl shadow-2xl p-10 md:p-14 border border-purple-100 dark:border-[#2d2250]">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 tracking-tight">
              Return & Refund Policy
            </h1>
            <div className="space-y-8 text-gray-700 dark:text-gray-200 text-lg">
              {/* <section>
                <h2 className="text-2xl font-semibold mb-2 ">
                  Eligibility for Returns
                </h2>
                <p>
                  Your item must be in its original unused condition to be
                  returned, unless there is a manufacturer defect. You must
                  return the item within{" "}
                  <span className="font-semibold">30 days</span> of your
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
                      href="mailto:support@mtechdistributor.com"
                      className="text-purple-700 underline"
                    >
                      support@mtechdistributor.com
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
                    href="mailto:support@mtechdistributor.com"
                    className="text-purple-700 underline"
                  >
                    support@mtechdistributor.com
                  </a>
                  ). In these cases, you will not be subject to a restocking fee
                  and will not have to pay return shipping.
                </p>
              </section> */}

              {
                ReturnPolicyData.data[0].ReturnPolicy_Section.map((item: any) => (
                  <section key={item._key}>
                    <h2 className="text-2xl font-semibold mb-2 ">{item.ReturnPolicy_Section_Header}</h2>
                    <PortableText value={item.ReturnPolicy_Section_Body} components={components} />
                  </section>
                ))
              }
            </div>
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
};

export default ReturnPolicy;
