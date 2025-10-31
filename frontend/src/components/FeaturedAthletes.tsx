import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Section from "@/components/Section";

const athletes = [
  {
    name: "Alex Carter",
    sport: "Basketball",
    avatar: "/images/athlete-sample.jpg",
    url: "#",
  },
  {
    name: "Mark Burks",
    sport: "Football",
    avatar: "/images/Mark.png",
    url: "#",
  },
  {
    name: "Sample",
    sport: "Track & Field",
    avatar: "/images/Sample.jpg",
    url: "#",
  },
];

export default function FeaturedAthletes() {
  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center sm:text-4xl">
            Featured Athletes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {athletes.map((athlete, index) => (
              <Link href={athlete.url} key={index}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage src={athlete.avatar} alt={athlete.name} />
                      <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{athlete.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{athlete.sport}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
