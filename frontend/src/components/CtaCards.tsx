import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Section from "@/components/Section";

export default function CtaCards() {
  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/create">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl">🏗️</div>
                  <CardTitle>Build Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Create and showcase your athletic achievements.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/athletes">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl">🗂️</div>
                  <CardTitle>View Portfolios</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Browse athletes by sport, position, year, and location.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/contact">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl">✉️</div>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Questions or partnerships? We’d love to hear from you.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
