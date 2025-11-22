import Section from "@/components/Section";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function WhySportsMarkers() {
  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center sm:text-4xl">Why SportsMarkers?</h2>
          <p className="mt-4 text-lg text-center text-gray-600">
            Because talent alone isn’t enough. You need the right platform, the right exposure, and the right connections. SportsMarkers gives athletes the tools to:
          </p>
          <Card className="mt-8 max-w-md mx-auto border-emerald-100 shadow-sm">
            <CardContent className="p-6">
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-green-500" />
                  <span>Get noticed faster</span>
                </li>
                <li className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-green-500" />
                  <span>Build credibility with recruiters</span>
                </li>
                <li className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-green-500" />
                  <span>Track progress and engagement</span>
                </li>
                <li className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-green-500" />
                  <span>Join a community that celebrates effort and achievement</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
