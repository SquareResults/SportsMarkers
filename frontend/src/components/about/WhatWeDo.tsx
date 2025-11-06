import { Card } from "@/components/ui/card";
import Image from "next/image";
import Section from "@/components/Section";

const features = [
  {
    title: "Athlete Profiles That Stand Out",
    description:
      "Showcase your stats, highlights, and verified credentials in a format recruiters trust.",
    image: "/images/about/profiles.jpg",
  },
  {
    title: "Recruiter Access That Matters",
    description:
      "We partner with programs across divisions and regions to ensure your profile gets in front of decision-makers.",
    image: "/images/about/recruiters.webp",
  },
  {
    title: "Visibility Tools That Work",
    description:
      "From spotlight rankings to social-ready shareables, we help athletes build their brand and expand their reach.",
    image: "/images/about/visibility.webp",
  },
  {
    title: "Trust-First Verification",
    description:
      "Our ID and performance checks ensure every profile is real, accurate, and ready for recruitment.",
    image: "/images/about/verification.jpg",
  },
];

export default function WhatWeDo() {
  return (
    <Section>
      <div className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              What We Do
            </h2>
            <p className="mt-3 text-slate-600">
              Everything you need to be discovered—beautifully packaged and recruiter-ready.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Card
                key={i}
                className="group h-full overflow-hidden rounded-2xl border-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.07)] ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.10)]"
              >
                {/* Image: fixed ratio for consistency + hover zoom */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={f.image}
                    alt={f.title}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={i < 2}
                  />
                  {/* subtle top gradient to add polish */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-70" />
                </div>

                {/* Text */}
                <div className="p-6">
                  <h3 className="text-lg font-bold leading-snug text-slate-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {f.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
