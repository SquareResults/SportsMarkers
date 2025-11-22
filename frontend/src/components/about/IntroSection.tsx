import Image from "next/image";
import Section from "@/components/Section";

export default function IntroSection() {
  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Where Talent Meets Opportunity.</h2>

              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7zm6 2h8v10H10V9zm-2 8H6v-2h2v2zm0-4H6v-2h2v2z"/></svg>
                  <span>Clean, recruiter-ready layout</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4.2L18 21l-6-4-6 4 1.5-7.8L2 9h7z"/></svg>
                  <span>Story + stats together</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 1a11 11 0 100 22 11 11 0 000-22zm1 6v5.59l4 2.3-.9 1.54L11 13V7h2z"/></svg>
                  <span>Built for speed</span>
                </div>
              </div>

              {/* Justified paragraphs */}
              <p className="mt-4 text-lg text-gray-600 text-justify leading-relaxed">
                At SportsMarkers, we believe every athlete deserves to be seen—not just by scouts, but by the world. Visibility shouldn’t be reserved for the few with insider access or viral moments. It should be earned through grit, discipline, and performance—and that’s exactly what we spotlight. SportsMarkers is more than a recruitment tool; it’s a brand platform built to elevate rising talent and give them the credibility and prominence they’ve worked tirelessly to achieve. We’re here to level the playing field, ensuring that athletes from every background have a fair shot at being discovered.
              </p>
              <p className="mt-4 text-lg text-gray-600 text-justify leading-relaxed">
                Whether you&apos;re a high school standout, a college prospect, or an unsigned pro chasing your next opportunity, SportsMarkers is your launchpad. We connect athletes to recruiters, coaches, and programs that align with their goals—backed by verified profiles, performance data, and trust signals that move the needle. Our platform doesn’t just showcase stats; it tells your story. From highlight reels to verified ID checks, we ensure recruiters see the full picture—your skills, your character, and your potential.
              </p>
              <p className="mt-4 text-lg text-gray-600 text-justify leading-relaxed">
                We’ve built SportsMarkers with one goal in mind: to empower athletes to take control of their journey. That means giving you the tools to build your brand, track your progress, and engage with recruiters who are actively looking for talent like yours. It means creating a community where effort is celebrated, transparency is standard, and every connection is built on trust. Because when athletes are seen for who they truly are—on and off the field—doors open, opportunities multiply, and careers take flight.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Image
                  src="/images/about/intro-1.jpg"
                  alt="Athlete preparing for competition in locker room"
                  width={400}
                  height={600}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
              <div>
                <Image
                  src="/images/about/intro-2.jpg"
                  alt="Coach reviewing portfolio with athlete"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
              <div>
                <Image
                  src="/images/about/intro-3.jpg"
                  alt="Stadium lights and crowd energy during a game"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
