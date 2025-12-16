// src/components/athletes/AthletesGrid.tsx
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";

type Athlete = {
  name: string;
  sport: string;
  position?: string;
  location?: string;
  url: string; // may be "/portfolio/<uuid>/" or full URL
  photo?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  education?: Array<{ school: string; graduationYear: string }>;
  portfolio: string;
};

const TRIAL_BASE = "https://trial.theradarlist.com";

// Match UUIDs like 91f74d6b-6c18-4a38-8e2b-c22b1d070b6b
const UUID_RE =
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;

function buildTrialHref(rawUrl?: string) {
  const u = (rawUrl ?? "").trim();

  // If data already has a full URL (http/https), use it as-is
  if (/^https?:\/\//i.test(u)) return u;

  // If empty, go to trial homepage
  if (!u) return `${TRIAL_BASE}/`;

  // If it looks like "/portfolio/<uuid>/" (or contains a UUID), avoid the 404 path:
  // route to "/" and pass the id as a query param
  const uuidMatch = u.match(UUID_RE);
  if (u.includes("/portfolio/") && uuidMatch?.[0]) {
    const id = uuidMatch[0];
    return `${TRIAL_BASE}/?portfolio=${encodeURIComponent(id)}`;
  }

  // Otherwise, safest fallback: just go to homepage (prevents random 404s)
  return `${TRIAL_BASE}/`;
}

export default function AthletesGrid({ athletes }: { athletes: Athlete[] }) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {athletes.map((athlete, i) => {
            const imgSrc =
              athlete.photo || athlete.avatar || "/images/placeholder.webp";

            const href = buildTrialHref(athlete.url);

            const educationArray = Array.isArray(athlete.education)
              ? athlete.education
              : [];
            const latestEducation =
              educationArray.length > 0 ? educationArray[0] : null;

            const skillsArray = Array.isArray(athlete.skills)
              ? athlete.skills
              : [];
            const topSkills = skillsArray.slice(0, 3);

            const bioExcerpt = athlete.bio
              ? athlete.bio.length > 80
                ? athlete.bio.substring(0, 80) + "..."
                : athlete.bio
              : null;

            return (
              <Card
                key={i}
                className="group overflow-hidden rounded-2xl border-0 shadow-lg ring-1 ring-black/5 transition-all hover:shadow-2xl hover:ring-primary/20"
              >
                <Link
                  href={href}
                  className="block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt={athlete.name}
                      fill
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={i < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                  </div>
                </Link>

                <div className="space-y-4 p-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">
                      <Link
                        href={href}
                        className="hover:text-primary transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {athlete.name}
                      </Link>
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="font-medium">
                        {athlete.sport}
                      </Badge>
                    </div>

                    {bioExcerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {bioExcerpt}
                      </p>
                    )}

                    {latestEducation && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span>
                          {latestEducation.school} &apos;
                          {latestEducation.graduationYear.slice(-2)}
                        </span>
                      </div>
                    )}

                    {topSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {topSkills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
