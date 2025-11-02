import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function AthletesGrid({ athletes }: { athletes: any[] }) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {athletes.map((athlete, index) => (
            <Link href={athlete.url} key={index}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={athlete.avatar} alt={athlete.name} />
                    <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle>{athlete.name}</CardTitle>
                  <p className="text-gray-600">
                    {athlete.sport} • {athlete.position} • {athlete.location}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
