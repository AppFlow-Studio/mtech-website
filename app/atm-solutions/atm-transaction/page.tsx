
import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import AtmSolutionHero from "../components/AtmSolutionHero";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const options = { next: { revalidate: 30 } };


async function AtmTransaction() {
  const atmTransaction = await sanityFetch({
    query: defineQuery(`*[_type == "ATMSolutions" && ATM_Solutions_Link == "/atm-transaction"]`),
    ...options,
  });

  return (
    <>
      <AtmSolutionHero
        title={atmTransaction.data[0]?.title}
        description={atmTransaction.data[0]?.ATM_Solutions_Description}
        image={atmTransaction.data[0]?.ATM_Solutions_Image}
        useSanityImage={true}
        usePortableText={true}
        features={atmTransaction.data[0]?.ATM_Solutions_Second_Section_Description}
      />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default AtmTransaction;
