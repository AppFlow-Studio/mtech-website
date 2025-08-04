import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import { client } from "@/sanity/lib/client";
import AtmSolutionHero from "../components/AtmSolutionHero";
import { defineQuery } from "next-sanity";
import { sanityFetch } from '@/utils/sanity/lib/live'

const options = { next: { revalidate: 30 } };

async function AtmPlacement() {
  const atmPlacement = await sanityFetch({
    query: defineQuery(`*[_type == "ATMSolutions" && ATM_Solutions_Link == "/atm-placement"]`),
    ...options,
  });
  return (
    <>
      <AtmSolutionHero
        title={atmPlacement.data[0]?.title}
        description={atmPlacement.data[0]?.ATM_Solutions_Description}
        image={atmPlacement.data[0]?.ATM_Solutions_Image}
        useSanityImage={true}
        usePortableText={true}
        features={atmPlacement.data[0]?.ATM_Solutions_Second_Section_Description}
      />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default AtmPlacement;
