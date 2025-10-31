import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutHero() {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/about/intro-1.jpg)" }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10">
        <h1 className="text-5xl font-bold">
          <span className="text-blue-400">Where Talent Meets Opportunity.</span>
        </h1>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/create">Create Your Portfolio →</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/athletes">Browse Athletes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
