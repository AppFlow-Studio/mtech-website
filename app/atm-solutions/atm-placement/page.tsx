import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import { client } from "@/sanity/lib/client";
import AtmSolutionHero from "../components/AtmSolutionHero";

async function AtmPlacement() {
  const atmPlacement = await client.fetch(
    `*[_type == "ATMSolutions" && ATM_Solutions_Link == "/atm-placement"]`
  );
  return (
    <>
     <AtmSolutionHero
        title={atmPlacement[0]?.title}
        description={atmPlacement[0]?.ATM_Solutions_Description}
        image={atmPlacement[0]?.ATM_Solutions_Image}
        useSanityImage={true}
        usePortableText={true}
        features={atmPlacement[0]?.ATM_Solutions_Second_Section_Description}
      />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default AtmPlacement;
