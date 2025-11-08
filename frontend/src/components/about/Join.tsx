import { Button } from "@/components/ui/button";
import Link from "next/link";
import Section from "@/components/Section";
import { ArrowRight, MessageSquare } from "lucide-react";

export default function Join() {
  return (
    <Section>
      <div className="py-14 sm:py-18 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
              Join the Movement
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Whether you're an athlete, coach, recruiter, or fan—SportsMarkers is
              your home for discovery, connection, and growth. When talent meets
              opportunity, greatness follows.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {/* Primary: light emerald */}
              <Button
                asChild
                size="lg"
                className="rounded-full px-7 h-12 shadow-sm
                           bg-emerald-300 hover:bg-emerald-400 text-emerald-900
                           dark:bg-emerald-400 dark:hover:bg-emerald-500 dark:text-slate-900"
              >
                <Link href="/create" aria-label="Start your profile">
                  Start Your Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {/* Secondary: very light emerald “outline” look */}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-7 h-12
                           border-emerald-300 text-emerald-700 hover:bg-emerald-50
                           dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
              >
                <Link href="/contact" aria-label="Talk to the team">
                  Talk to the Team
                  <MessageSquare className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Soft accent bar */}
            <div className="mt-6 mx-auto h-1 w-24 rounded-full bg-emerald-300/30 dark:bg-emerald-400/25" />
          </div>
        </div>
      </div>
    </Section>
  );
}
