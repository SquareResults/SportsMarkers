import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Section from "@/components/Section";

const testimonials = [
  {
    quote:
      "SportsMarker helped me get noticed by college recruiters. The portfolio was easy to create and looked amazing.",
    name: "Alex Carter",
    title: "Basketball Player",
  },
  {
    quote:
      "As a coach, I appreciate how easy it is to review a player's stats and highlights all in one place. It saves me a ton of time.",
    name: "Coach Johnson",
    title: "NCAA Recruiter",
  },
  {
    quote:
      "The best platform for any athlete looking to take their career to the next level. Highly recommended!",
    name: "Maria Rodriguez",
    title: "Soccer Player",
  },
];

export default function Testimonials() {
  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center sm:text-4xl">
            What they're saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <p className="text-lg">"{testimonial.quote}"</p>
                  <div className="mt-4 text-right">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
