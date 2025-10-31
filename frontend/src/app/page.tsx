import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CtaCards from "@/components/CtaCards";
import PricingSection from "@/components/PricingSection";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <div>
      <Hero />
      <AboutSection />
      <CtaCards />
      <PricingSection />
      <HowItWorks />
    </div>
  );
}
