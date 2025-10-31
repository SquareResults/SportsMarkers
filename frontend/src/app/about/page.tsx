import AboutHero from "@/components/about/AboutHero";
import IntroSection from "@/components/about/IntroSection";
import Join from "@/components/about/Join";
import Mission from "@/components/about/Mission";
import WhatWeDo from "@/components/about/WhatWeDo";
import WhySportsMarkers from "@/components/about/WhySportsMarkers";

export default function AboutPage() {
  return (
    <div>
      <AboutHero />
      <IntroSection />
      <WhatWeDo />
      <WhySportsMarkers />
      <Mission />
      <Join />
    </div>
  );
}
