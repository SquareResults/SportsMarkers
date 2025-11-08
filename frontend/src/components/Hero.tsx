"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useSupabase } from "@/components/SupabaseProvider";

type Slide =
  | { kind: "logo"; sport: string; image: string }
  | { kind: "photo"; sport: string; image: string };

const slides: Slide[] = [
  // First slide = SportsMarkers logo
  { kind: "logo", sport: "SportsMarkers", image: "/images/logo.png" },
  // Other slides = regular photos
  { kind: "photo", sport: "Basketball", image: "/images/Basket.jpg" },
  { kind: "photo", sport: "Soccer", image: "/images/Football.jpg" },
  { kind: "photo", sport: "Track", image: "/images/Track.png" },
];

export default function Hero() {
  const plugin = useRef(Autoplay({ delay: 8000, stopOnInteraction: true }));
  const supabase = useSupabase();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // session state
  useEffect(() => {
    const run = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    run();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // embla events
  useEffect(() => {
    if (!api) return;

    setSelectedIndex(api.selectedScrollSnap());
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section
      className="relative h-screen min-h-[640px] w-screen overflow-hidden pt-0"
      style={{
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: -64,
      }}
    >
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="absolute inset-0 h-full w-full"
        opts={{ loop: true }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {slides.map((slide, i) => (
            <CarouselItem key={i}>
              {slide.kind === "photo" ? (
                <div
                  className="h-screen min-h-[640px] w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
              ) : (
                // Logo slide
                <div
                  className="relative flex h-screen min-h-[640px] w-full items-center justify-center
                                bg-[radial-gradient(110%_100%_at_20%_0%,#15294b_0%,#0b1530_55%,#0a1226_100%)]"
                >
                  {/* Simple <img> works fine for SVG logos */}
                  <img
                    src={slide.image}
                    alt="SportsMarkers logo"
                    className="h-auto w-[260px] sm:w-[360px] md:w-[480px] drop-shadow-[0_6px_28px_rgba(0,0,0,0.35)]"
                  />
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 z-20 h-10 w-10 rounded-full bg-black/35 text-white hover:bg-black/55" />
        <CarouselNext className="right-4 z-20 h-10 w-10 rounded-full bg-black/35 text-white hover:bg-black/55" />
      </Carousel>

      {/* overlays don't block clicks */}
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#102A4A]/60 via-transparent to-[#0e5f4f]/60" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-3 text-5xl font-extrabold leading-[1.05] text-white drop-shadow-md sm:text-6xl lg:text-7xl">
          Showcase Your
          <br />
          <span className="text-[#72D66A] drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
            Athletic Journey
          </span>
        </h1>

        <p className="mt-2 max-w-3xl text-lg text-white/90 sm:text-xl">
          Create stunning portfolios, stay updated with sports news, and
          discover events near you.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <Link
            href={isLoggedIn ? "/create" : "/login"}
            className="inline-flex items-center rounded-full bg-gradient-to-b from-[#32D071] to-[#20B85E] px-6 py-3 text-base font-semibold text-white shadow-md hover:opacity-95"
          >
            {isLoggedIn ? "Create Portfolio" : "Get Started →"}
          </Link>

          <Link
            href="/athletes"
            className="inline-flex items-center rounded-full border border-white/70 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
          >
            View Portfolios
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                selectedIndex === i ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
