"use client";

import { useState, useEffect } from "react";
import AthletesGrid from "@/components/athletes/AthletesGrid";
import AthletesHero from "@/components/athletes/AthletesHero";
import FilterSection from "@/components/athletes/FilterSection";
import { useSupabase } from "@/components/SupabaseProvider";

type Athlete = {
  name: string;
  sport: string;
  position: string;
  location: string;
  avatar: string;
  url: string;
};

export default function AthletesPage() {
  const supabase = useSupabase();
  const [allAthletes, setAllAthletes] = useState<Athlete[]>([]);
  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      const { data: portfolios, error } = await supabase
        .from("portfolios")
        .select("*");
      if (error) {
        console.error("Error fetching portfolios:", error);
      } else {
        const athletes = portfolios.map((portfolio) => ({
          name: `${portfolio.first_name} ${portfolio.last_name}`,
          sport: portfolio.sport,
          position: "N/A", // The portfolios table does not have a position column
          location: "N/A", // The portfolios table does not have a location column
          avatar: portfolio.profile_picture_url,
          url: `/portfolio/${portfolio.id}`, // Assuming this is the URL structure
        }));
        setAllAthletes(athletes);
        setFilteredAthletes(athletes);
      }
    };
    fetchPortfolios();
  }, [supabase]);

  const handleFilter = (filters: { name?: string; sport?: string; position?: string }) => {
    let athletes = allAthletes;

    if (filters.name) {
      athletes = athletes.filter((athlete) =>
        athlete.name.toLowerCase().includes(filters.name?.toLowerCase() || ""),
      );
    }

    if (filters.sport && filters.sport !== "all") {
      athletes = athletes.filter(
        (athlete) =>
          athlete.sport.toLowerCase() === (filters.sport?.toLowerCase() || ""),
      );
    }

    if (filters.position && filters.position !== "all") {
      athletes = athletes.filter(
        (athlete) =>
          athlete.position.toLowerCase() === (filters.position?.toLowerCase() || ""),
      );
    }

    setFilteredAthletes(athletes);
  };

  return (
    <div>
      <AthletesHero />
      <FilterSection onFilter={handleFilter} />
      <AthletesGrid athletes={filteredAthletes} />
    </div>
  );
}
