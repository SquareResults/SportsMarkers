"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Filters = {
  name: string;
  sport: string;
  position: string;
  year: string;
  location: string;
};

export default function FilterSection({
  onFilter,
  totalCount = 0,
}: {
  onFilter: (filters: Filters) => void;
  totalCount?: number;
}) {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("all");
  const [position, setPosition] = useState("all");
  const [year, setYear] = useState("all");
  const [location, setLocation] = useState("all");

  const filters: Filters = { name, sport, position, year, location };

  const handleSearch = () => onFilter(filters);

  const handleClear = () => {
    setName("");
    setSport("all");
    setPosition("all");
    setYear("all");
    setLocation("all");
    onFilter({ name: "", sport: "all", position: "all", year: "all", location: "all" });
  };

  // Shared “pill” classes
  const pill = "h-12 rounded-full";
  const pillInput = `${pill} px-5`;
  const pillSelect = `${pill} px-5 text-base`;

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border border-muted/40 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-4 sm:p-5">
            {/* Controls */}
            <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto_auto]">
              {/* Name */}
              <Input
                placeholder="Search by name…"
                className={pillInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* Sport */}
              <Select value={sport} onValueChange={setSport}>
                <SelectTrigger className={pillSelect}>
                  <SelectValue placeholder="All Sports" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="Basketball">Basketball</SelectItem>
                  <SelectItem value="Football">Football</SelectItem>
                  <SelectItem value="Track & Field">Track &amp; Field</SelectItem>
                </SelectContent>
              </Select>

              {/* Position */}
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className={pillSelect}>
                  <SelectValue placeholder="All Positions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  <SelectItem value="Guard">Guard</SelectItem>
                  <SelectItem value="Forward">Forward</SelectItem>
                  <SelectItem value="Quarterback">Quarterback</SelectItem>
                  <SelectItem value="Sprinter">Sprinter</SelectItem>
                </SelectContent>
              </Select>

              {/* Year */}
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className={pillSelect}>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>

              {/* Location */}
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className={pillSelect}>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                  <SelectItem value="Tempe, AZ">Tempe, AZ</SelectItem>
                  <SelectItem value="Phoenix, AZ">Phoenix, AZ</SelectItem>
                </SelectContent>
              </Select>

              {/* Buttons */}
              <Button
                onClick={handleSearch}
                className="h-12 rounded-full bg-[#2F62F5] px-6 text-white hover:bg-[#2a55d3]"
              >
                Search
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                className="h-12 rounded-full px-6"
              >
                Clear
              </Button>
            </div>

            {/* Count */}
            <div className="flex justify-end">
              <span className="text-sm text-muted-foreground">
                {totalCount} {totalCount === 1 ? "athlete" : "athletes"} found
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
