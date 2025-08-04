import DualPricingKit from "@/components/business-type/DualPricingKit";
import Contact from "@/components/Contact";
import { client } from "@/sanity/lib/client";
import AtmSolutionHero from "../components/AtmSolutionHero";
async function AtmCashManagement() {
  const atmCashManagement = await client.fetch(
    `*[_type == "ATMSolutions" && ATM_Solutions_Link == "/atm-cash-management"]`
  );
  return (
    <>
      <AtmSolutionHero
        title={atmCashManagement[0]?.title}
        description={atmCashManagement[0]?.ATM_Solutions_Description}
        image={atmCashManagement[0]?.ATM_Solutions_Image}
        useSanityImage={true}
        usePortableText={true}
        features={atmCashManagement[0]?.ATM_Solutions_Second_Section_Description}
      />
      <DualPricingKit />
      <Contact />
    </>
  );
};

export default AtmCashManagement;
