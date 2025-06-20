import HardwareSection from "@/components/HardwareSection";
import Partners from "@/components/Partners";
import PotentialSection from "@/components/service/PotentialSection";
import PreferredPayment from "@/components/service/PreferredPayment";

export default function ServicesPage() {
  return (
    <>
      <PotentialSection />
      <Partners />
      <PreferredPayment />
      <HardwareSection />
    </>
  );
}
