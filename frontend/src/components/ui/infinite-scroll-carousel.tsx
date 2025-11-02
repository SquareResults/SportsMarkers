'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

interface InfiniteScrollCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
}

export function InfiniteScrollCarousel({ 
  children,
  direction = "left",
  speed = "normal",
  className,
  ...props
}: InfiniteScrollCarouselProps) {
  const duration = speed === "slow" ? "80s" : speed === "fast" ? "20s" : "40s";
  const animationDirection = direction === "left" ? "animate-scroll-left" : "animate-scroll-right";

  return (
    <div className={cn("overflow-hidden", className)} {...props}>
      <div className={cn("flex w-max", animationDirection)} style={{ animationDuration: duration }}>
        {React.Children.map(children, (child) => (
          <div className="flex-shrink-0">{child}</div>
        ))}
        {React.Children.map(children, (child) => (
          <div className="flex-shrink-0" aria-hidden="true">{child}</div>
        ))}
      </div>
    </div>
  );
}