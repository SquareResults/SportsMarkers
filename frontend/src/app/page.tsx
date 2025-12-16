import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CtaCards from "@/components/CtaCards";
import PricingSection from "@/components/PricingSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import FeaturedAthletes from "@/components/FeaturedAthletes";

export default function Home() {
  return (
    <div>
      <Hero />
      <AboutSection />
      <CtaCards />
      <FeaturedAthletes />
      <PricingSection />
      <HowItWorks />
      <Testimonials />
      <Faq />
    </div>
  );
}
