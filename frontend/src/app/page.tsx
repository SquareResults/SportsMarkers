import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import CtaCards from "@/components/CtaCards";
import PricingSection from "@/components/PricingSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FeaturedAthletes from "@/components/FeaturedAthletes";
import Faq from "@/components/Faq";

export default function Home() {
  return (
    <div>
      <Hero />
      <AboutSection />
      <CtaCards />
      <PricingSection />
      <HowItWorks />
      <Testimonials />
      <FeaturedAthletes />
      <Faq />
    </div>
  );
}
