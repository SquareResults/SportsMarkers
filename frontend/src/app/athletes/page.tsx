"use client";

import { useState } from "react";
import AthletesGrid from "@/components/athletes/AthletesGrid";
import AthletesHero from "@/components/athletes/AthletesHero";
import FilterSection from "@/components/athletes/FilterSection";

const allAthletes = [
  {
    name: "Alex Carter",
    sport: "Basketball",
    position: "Guard",
    location: "Los Angeles, CA",
    avatar: "/images/athlete-sample.jpg",
    url: "#",
  },
  {
    name: "Mark Burks",
    sport: "Football",
    position: "Quarterback",
    location: "Tempe, AZ",
    avatar: "/images/Mark.png",
    url: "#",
  },
  {
    name: "Sample",
    sport: "Track & Field",
    position: "Sprinter",
    location: "Phoenix, AZ",
    avatar: "/images/Sample.jpg",
    url: "#",
  },
];

export default function AthletesPage() {
  const [filteredAthletes, setFilteredAthletes] = useState(allAthletes);

  const handleFilter = (filters: any) => {
    let athletes = allAthletes;

    if (filters.name) {
      athletes = athletes.filter((athlete) =>
        athlete.name.toLowerCase().includes(filters.name.toLowerCase()),
      );
    }

    if (filters.sport && filters.sport !== "all") {
      athletes = athletes.filter(
        (athlete) =>
          athlete.sport.toLowerCase() === filters.sport.toLowerCase(),
      );
    }

    if (filters.position && filters.position !== "all") {
      athletes = athletes.filter(
        (athlete) =>
          athlete.position.toLowerCase() === filters.position.toLowerCase(),
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
