import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import AtmSolutionHero from "../components/AtmSolutionHero";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const options = { next: { revalidate: 30 } };

async function AtmMaketing() {
  const atmMarketing = await sanityFetch({
    query: defineQuery(`*[_type == "ATMSolutions" && ATM_Solutions_Link == "/atm-marketing"]`),
    ...options,
  });
  return (
    <>
      <AtmSolutionHero
        title={atmMarketing.data[0]?.title}
        description={atmMarketing.data[0]?.ATM_Solutions_Description}
        image={atmMarketing.data[0]?.ATM_Solutions_Image}
        useSanityImage={true}
        usePortableText={true}
        features={atmMarketing.data[0]?.ATM_Solutions_Second_Section_Description}
      />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default AtmMaketing;
