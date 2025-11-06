// src/components/athletes/AthletesGrid.tsx
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

type Athlete = {
  name: string;
  sport: string;
  position: string;
  location: string;
  url: string;
  photo?: string;   // large image for the card
  avatar?: string;  // smaller headshot - we'll use this if photo is missing
};

export default function AthletesGrid({ athletes }: { athletes: Athlete[] }) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {athletes.map((athlete, i) => {
            const imgSrc = athlete.photo || athlete.avatar || "/images/placeholder.webp";
            return (
              <Card
                key={i}
                className="group overflow-hidden rounded-2xl border-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition-all hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
              >
                {/* Full-bleed top image */}
                <Link href={athlete.url} className="block">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-2xl">
                    <Image
                      src={imgSrc}
                      alt={athlete.name}
                      fill
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={i < 3}
                    />
                  </div>
                </Link>

                {/* Text + CTA */}
                <div className="space-y-3 p-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-foreground">
                      <Link href={athlete.url} className="hover:underline">
                        {athlete.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {athlete.sport} • {athlete.position} • {athlete.location}
                    </p>
                  </div>

                  <Link
                    href={athlete.url}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1E49C4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]"
                  >
                    View Portfolio
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
