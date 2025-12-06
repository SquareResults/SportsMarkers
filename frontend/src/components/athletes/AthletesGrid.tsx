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
  url: string;
  photo?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  education?: Array<{ school: string; graduationYear: string }>;
  portfolio: string;
};

export default function AthletesGrid({ athletes }: { athletes: Athlete[] }) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {athletes.map((athlete, i) => {
            const imgSrc = athlete.photo || athlete.avatar || "/images/placeholder.webp";

            // Get latest education - ensure it's an array
            const educationArray = Array.isArray(athlete.education) ? athlete.education : [];
            const latestEducation = educationArray.length > 0 ? educationArray[0] : null;

            // Get top 3 skills - ensure it's an array
            const skillsArray = Array.isArray(athlete.skills) ? athlete.skills : [];
            const topSkills = skillsArray.slice(0, 3);

            // Truncate bio to ~80 characters
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
                {/* Full-bleed top image */}
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={athlete.name}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={i < 3}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                </div>

                {/* Content */}
                <div className="space-y-4 p-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">
                      {athlete.name}
                    </h3>

                    {/* Sport badge */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="font-medium">
                        {athlete.sport}
                      </Badge>
                    </div>

                    {/* Bio excerpt */}
                    {bioExcerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {bioExcerpt}
                      </p>
                    )}

                    {latestEducation && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4" />
                        <span>{latestEducation.school} &apos;{latestEducation.graduationYear.slice(-2)}</span>
                      </div>
                    )}

                    {/* Top skills */}
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
                    href={athlete.portfolio}
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
