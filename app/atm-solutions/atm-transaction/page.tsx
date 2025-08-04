
import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import AtmSolutionHero from "../components/AtmSolutionHero";
import { client } from "@/sanity/lib/client";


async function AtmTransaction() {
  const atmTransaction = await client.fetch(
    `*[_type == "ATMSolutions" && ATM_Solutions_Link == "/atm-transaction"]`
  );

  return (
    <>
      <AtmSolutionHero
        title={atmTransaction[0]?.title}
        description={atmTransaction[0]?.ATM_Solutions_Description}
        image={atmTransaction[0]?.ATM_Solutions_Image}
        useSanityImage={true}
        usePortableText={true}
        features={atmTransaction[0]?.ATM_Solutions_Second_Section_Description}
      />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default AtmTransaction;
