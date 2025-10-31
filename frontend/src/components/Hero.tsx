import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  { sport: "Basketball", image: "/images/Basket.jpg" },
  { sport: "Soccer", image: "/images/Football.jpg" },
  { sport: "Track", image: "/images/Track.png" },
];

export default function Hero() {
  return (
    <section className="relative h-[560px] flex items-center justify-center text-center text-white">
      <Carousel className="absolute inset-0 w-full h-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div
                className="h-[560px] bg-cover bg-center"
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
          <Button asChild size="lg">
            <Link href="/create">Get Started →</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/athletes">View Portfolios</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
