// app/testimonials/page.tsx  (or components/Testimonials.tsx)
"use client";

import { Card, CardContent } from "@/components/ui/card";
import Section from "@/components/Section";
import { InfiniteScrollCarousel } from "@/components/ui/infinite-scroll-carousel";

const testimonials = [
  {
    quote:
      "SportsMarkers helped me get noticed by college recruiters. The portfolio was easy to create and looked amazing.",
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
      "My son got a scholarship thanks to the portfolio we built on SportsMarkers. I can't thank them enough!",
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
      "SportsMarkers is the real deal. It connects you with opportunities you wouldn't find otherwise.",
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

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) => (
  <Card className="w-80 mx-4 h-64 flex flex-col justify-between rounded-3xl bg-white border border-slate-200 shadow-lg hover:shadow-2xl hover:border-emerald-300 transition-all duration-300">
    <CardContent className="p-6 flex-grow flex flex-col justify-between">
      <p className="text-base leading-relaxed text-slate-800 mb-4">
        <span className="text-3xl font-bold text-emerald-500">"</span>
        {testimonial.quote}
      </p>
      <div>
        <div className="h-px bg-gradient-to-r from-emerald-500 to-transparent mb-3" />
        <div className="text-right">
          <p className="font-bold text-slate-900 text-base drop-shadow-sm">
            {testimonial.name}
          </p>
          <p className="text-sm text-emerald-600 font-medium">
            {testimonial.title}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Testimonials() {
  const topRow = testimonials.slice(0, 5);
  const bottomRow = testimonials.slice(5, 10);

  return (
    <Section>
      <div className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-slate-900 mb-16">
            What they're saying
          </h2>

          <div className="space-y-12">
            {/* TOP ROW - SCROLL LEFT */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-0" />
              <InfiniteScrollCarousel direction="left" speed="slow">
                {topRow.map((t, i) => (
                  <TestimonialCard key={`top-${i}`} testimonial={t} />
                ))}
              </InfiniteScrollCarousel>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-0" />
            </div>

            {/* BOTTOM ROW - SCROLL RIGHT */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-0" />
              <InfiniteScrollCarousel direction="right" speed="slow">
                {bottomRow.map((t, i) => (
                  <TestimonialCard key={`bottom-${i}`} testimonial={t} />
                ))}
              </InfiniteScrollCarousel>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-0" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
