import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Section from "@/components/Section";

export default function PricingSection() {
  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="text-5xl font-bold text-blue-500">$299</div>
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bold sm:text-4xl">
                    One-time portfolio setup
                  </h2>
                  <p className="mt-4 text-lg text-gray-600">
                    Includes design, setup, media upload, and a recruiter-ready
                    layout. 14-day tweak guarantee. No subscription.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg">
                  <Link href="/create">Create your portfolio</Link>
                </Button>
              </div>
              <div className="mt-8">
                <ul className="flex flex-wrap justify-center gap-4">
                  <li className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">
                    Highlights & stats pages
                  </li>
                  <li className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">
                    Mobile-first & fast
                  </li>
                  <li className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">
                    Shareable link & QR
                  </li>
                  <li className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">
                    Trust checks ready
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
