import Image from "next/image";
import Section from "@/components/Section";

export default function Mission() {
  return (
    <Section>
      <div className="relative overflow-hidden bg-slate-50 py-14 sm:py-18 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Copy */}
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Our Mission
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                We level the playing field in sports recruitment—giving every
                athlete a fair shot at being seen, signed, and celebrated.
              </p>

              <dl className="mt-8 grid gap-4">
                <Pillar title="Access for All">
                  Visibility tools that don’t depend on zip code or status.
                </Pillar>
                <Pillar title="Recruiter-Ready">
                  Clean, credible portfolios built for fast evaluation.
                </Pillar>
                <Pillar title="Share Anywhere">
                  Mobile-first links and QR codes for instant exposure.
                </Pillar>
              </dl>
            </div>

            {/* Image */}
            <div className="relative">
              {/* soft neutral glow (fixed light) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-white/70 blur-sm"
              />
              <div className="overflow-hidden rounded-[2rem] ring-1 ring-slate-200 shadow-md">
                <Image
                  src="/images/Football.jpg"
                  alt="Football on field symbolizing opportunity"
                  width={1280}
                  height={960}
                  priority
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Pillar({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm">
      <dt className="text-base font-semibold text-slate-900">{title}</dt>
      <dd className="mt-1 text-slate-600">{children}</dd>
    </div>
  );
}
