import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import AtmSolutionHero from "../components/AtmSolutionHero";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const options = { next: { revalidate: 30 } };

async function AtmCashManagement() {
  const atmCashManagement = await sanityFetch({
    query: defineQuery(`*[_type == "ATMSolutions" && ATM_Solutions_Link == "/atm-cash-management"]`),
    ...options,
  });
  return (
    <>
      <AtmSolutionHero
        title={atmCashManagement.data[0]?.title}
        description={atmCashManagement.data[0]?.ATM_Solutions_Description}
        image={atmCashManagement.data[0]?.ATM_Solutions_Image}
        useSanityImage={true}
        usePortableText={true}
        features={atmCashManagement.data[0]?.ATM_Solutions_Second_Section_Description}
      />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default AtmCashManagement;
