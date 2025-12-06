"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Section from "@/components/Section";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Athlete {
  name: string;
  sport: string;
  avatar: string;
  url: string;
  portfolio: string;
}

export default function FeaturedAthletes() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  useEffect(() => {
    const fetchAthletes = async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("first_name, last_name, sport, profile_picture_url, portfolio_url")
        .limit(3);

      if (error) {
        console.error("Error fetching athletes:", error);
        return;
      }

      if (data) {
        const formattedAthletes = data.map((athlete) => ({
          name: `${athlete.first_name} ${athlete.last_name}`,
          sport: athlete.sport,
          avatar: athlete.profile_picture_url || "/images/athlete-sample.jpg",
          url: "#",
          portfolio: athlete.portfolio_url || "#",
        }));
        setAthletes(formattedAthletes);
      }
    };

    fetchAthletes();
  }, []);

  return (
    <Section>
      <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center sm:text-4xl">
            Featured Athletes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {athletes.map((athlete, index) => (
              <Card className="hover:shadow-lg transition-shadow" key={index}>
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
                  <Link href={athlete.portfolio} className="text-blue-500 hover:underline">
                    View Portfolio
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
