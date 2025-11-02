'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useSupabase } from '@/components/SupabaseProvider';

const slides = [
  { sport: 'Basketball', image: '/images/Basket.jpg' },
  { sport: 'Soccer', image: '/images/Football.jpg' },
  { sport: 'Track', image: '/images/Track.png' },
];

export default function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 8000, stopOnInteraction: true })
  );
  const supabase = useSupabase();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <section className="h-screen flex items-center justify-center text-center text-white">
      <Carousel
        plugins={[plugin.current]}
        className="absolute inset-0 w-full h-full"
        opts={{ loop: true }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div
                className="h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              ></div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10">
        <h1 className="text-5xl font-bold">
          Showcase Your
          <br />
          <span className="text-blue-400">Athletic Journey</span>
        </h1>
        <p className="mt-4 text-lg">
          Create stunning portfolios, stay updated with sports news, and
          discover events near you.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          {isLoggedIn ? (
            <Button asChild size="lg">
              <Link href="/create">Create Portfolio</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="/login">Get Started →</Link>
            </Button>
          )}
          <Button asChild size="lg" variant="secondary">
            <Link href="/athletes">View Portfolios</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}