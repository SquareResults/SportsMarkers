import { Button } from "@/components/ui/button";
import Link from "next/link";
import Section from "@/components/Section";

export default function Join() {
  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Join the Movement</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're an athlete, coach, recruiter, or fan—SportsMarkers is
            your home for discovery, connection, and growth. Because when talent
            meets opportunity, greatness follows.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/create">Start Your Profile</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Talk to the Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
