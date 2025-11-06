import Image from "next/image";
import Section from "@/components/Section";

export default function AboutSection() {
  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/images/athletes-action.jpg"
                alt="Athletes training on track"
                width={600}
                height={400}
                className="rounded"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">About</h2>

              {/* Main paragraph - justified */}
              <p className="mt-4 text-lg text-gray-600 text-justify leading-relaxed">
                We help athletes turn their story into a standout digital
                portfolio—blending media, stats, and achievements in a single
                link. Built for students and pros alike, SportsMarkers makes it
                effortless to showcase highlights, milestones, and personality
                in a clean, shareable format that coaches and recruiters can
                explore anywhere.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-blue-500"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      Clean, fast, mobile-first pages
                    </h3>
                    {/* Justified */}
                    <p className="text-gray-600 text-justify leading-relaxed">
                      Optimized for any device; loads instantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-blue-500"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      Highlights, stats, and milestones
                    </h3>
                    {/* Justified */}
                    <p className="text-gray-600 text-justify leading-relaxed">
                      Showcase your best moments in one place.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-blue-500"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      Shareable profile link
                    </h3>
                    {/* Justified */}
                    <p className="text-gray-600 text-justify leading-relaxed">
                      Easy for recruiters and coaches to access.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
