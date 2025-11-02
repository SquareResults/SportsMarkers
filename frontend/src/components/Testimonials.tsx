'use client';

import { Card, CardContent } from "@/components/ui/card";
import Section from "@/components/Section";
import { InfiniteScrollCarousel } from "@/components/ui/infinite-scroll-carousel";

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
  {
    quote:
      "A game-changer for amateur athletes. The exposure I got from my portfolio was incredible.",
    name: "David Chen",
    title: "Football Player",
  },
  {
    quote:
      "The analytics and insights are top-notch. I can track my performance and share it with scouts effortlessly.",
    name: "Emily White",
    title: "Track & Field Athlete",
  },
  {
    quote:
      "My son got a scholarship thanks to the portfolio we built on SportsMarker. I can't thank them enough!",
    name: "Sarah Lee",
    title: "Parent of an Athlete",
  },
  {
    quote:
      "The user interface is so intuitive. I had my professional portfolio ready in less than an hour.",
    name: "Michael Brown",
    title: "Swimmer",
  },
  {
    quote:
      "SportsMarker is the real deal. It connects you with opportunities you wouldn't find otherwise.",
    name: "Jessica Green",
    title: "Volleyball Player",
  },
  {
    quote:
      "I love the community aspect. It's great to connect with other athletes and share our journeys.",
    name: "Kevin Harris",
    title: "Tennis Player",
  },
  {
    quote:
      "The customer support is fantastic. They were so helpful in getting my portfolio just right.",
    name: "Laura Martinez",
    title: "Golfer",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <Card className="w-80 mx-4 h-64 flex flex-col justify-between">
    <CardContent className="p-6 flex-grow">
      <p className="text-lg">"{testimonial.quote}"</p>
    </CardContent>
    <div className="p-6 pt-0 text-right">
      <p className="font-semibold">{testimonial.name}</p>
      <p className="text-sm text-gray-500">{testimonial.title}</p>
    </div>
  </Card>
);

export default function Testimonials() {
  const topRow = testimonials.slice(0, 5);
  const bottomRow = testimonials.slice(5, 10);

  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-12">
            What they're saying
          </h2>
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-0 w-1/4 bg-gradient-to-r from-white to-transparent z-10"></div>
              <InfiniteScrollCarousel direction="left" speed="slow">
                {topRow.map((testimonial, index) => (
                  <TestimonialCard key={index} testimonial={testimonial} />
                ))}
              </InfiniteScrollCarousel>
              <div className="absolute top-0 bottom-0 right-0 w-1/4 bg-gradient-to-l from-white to-transparent z-10"></div>
            </div>
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-0 w-1/4 bg-gradient-to-r from-white to-transparent z-10"></div>
              <InfiniteScrollCarousel direction="right" speed="slow">
                {bottomRow.map((testimonial, index) => (
                  <TestimonialCard key={index} testimonial={testimonial} />
                ))}
              </InfiniteScrollCarousel>
              <div className="absolute top-0 bottom-0 right-0 w-1/4 bg-gradient-to-l from-white to-transparent z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}