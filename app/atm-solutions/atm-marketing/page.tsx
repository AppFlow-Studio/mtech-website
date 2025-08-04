import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import AtmSolutionHero from "../components/AtmSolutionHero";

async function AtmMaketing() {
  const atmMarketing = await client.fetch(
    `*[_type == "ATMSolutions" && ATM_Solutions_Link == "/atm-marketing"]`
  );
  return (
    <>
        <AtmSolutionHero
        title={atmMarketing[0]?.title}
        description={atmMarketing[0]?.ATM_Solutions_Description}
        image={atmMarketing[0]?.ATM_Solutions_Image}
        useSanityImage={true}
        usePortableText={true}
        features={atmMarketing[0]?.ATM_Solutions_Second_Section_Description}
      />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default AtmMaketing;
