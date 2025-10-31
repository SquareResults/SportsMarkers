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

export default function FilterSection({
  onFilter,
}: {
  onFilter: (filters: any) => void;
}) {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("all");
  const [position, setPosition] = useState("all");

  const handleSearch = () => {
    onFilter({ name, sport, position });
  };

  const handleClear = () => {
    setName("");
    setSport("all");
    setPosition("all");
    onFilter({ name: "", sport: "all", position: "all" });
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
          <Input
            placeholder="Search by name…"
            className="lg:col-span-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger>
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="Basketball">Basketball</SelectItem>
              <SelectItem value="Football">Football</SelectItem>
              <SelectItem value="Track & Field">Track & Field</SelectItem>
            </SelectContent>
          </Select>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger>
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
          <Button onClick={handleSearch}>Search</Button>
          <Button variant="ghost" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
    </section>
  );
}
