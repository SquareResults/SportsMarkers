import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Section from "@/components/Section";

const features = [
  {
    title: "Athlete Profiles That Stand Out",
    description: "Showcase your stats, highlights, and verified credentials in a format recruiters trust.",
    image: "/images/about/profiles.jpg",
  },
  {
    title: "Recruiter Access That Matters",
    description: "We partner with programs across divisions and regions to ensure your profile gets in front of decision-makers.",
    image: "/images/about/recruiters.webp",
  },
  {
    title: "Visibility Tools That Work",
    description: "From spotlight rankings to social-ready shareables, we help athletes build their brand and expand their reach.",
    image: "/images/about/visibility.webp",
  },
  {
    title: "Trust-First Verification",
    description: "Our ID and performance checks ensure every profile is real, accurate, and ready for recruitment.",
    image: "/images/about/verification.jpg",
  },
];

export default function WhatWeDo() {
  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center sm:text-4xl">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={400}
                    height={200}
                    className="rounded-t-lg object-cover w-full h-full"
                  />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
