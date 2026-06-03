"use client";

import { cn } from "@/lib";
import { useEffect, useRef, useState } from "react";

export type CarouselProps = {
  slides: React.ReactNode[];
  autoPlay?: boolean;
  duration?: number;
  pauseOnHover?: boolean;
  className?: string;
  classNameFunction?: (isActive: boolean) => string;
};

export function Carousel({
  slides,
  autoPlay = true,
  duration = 5000,
  pauseOnHover = true,
  className,
  classNameFunction,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalId = useRef<number | null>(null);

  const startAutoplay = () => {
    if (intervalId.current !== null) {
      window.clearInterval(intervalId.current);
    }

    intervalId.current = window.setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= slides.length - 1 ? 0 : prevIndex + 1,
      );
    }, duration);
  };

  useEffect(() => {
    if (autoPlay) {
      startAutoplay();
    }

    return () => {
      if (intervalId.current !== null) {
        window.clearInterval(intervalId.current);
      }
    };
  }, [slides.length, duration, autoPlay]);

  const handleIndicatorClick = (idx: number) => {
    setCurrentIndex(idx);
    startAutoplay();
  };

  const handleMouseEnter = () => {
    if (pauseOnHover && intervalId.current !== null) {
      window.clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && autoPlay) {
      startAutoplay();
    }
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="z-1 flex min-h-full transition-transform duration-500"
        style={{ transform: `translateX(${currentIndex * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="min-w-full flex-none">
            {slide}
          </div>
        ))}
      </div>

      <div
        id="indicators"
        className="absolute bottom-0 left-0 z-2 flex h-8 w-full justify-center p-2"
      >
        {slides.map((_, idx) => {
          const isActive = idx === currentIndex;
          const cls = classNameFunction?.(isActive);
          return (
            <div
              key={idx}
              className={cn(
                "mx-1 h-1.5 w-9 cursor-pointer rounded-full transition-all duration-300",
                {
                  "bg-accent": isActive,
                  "bg-accent/60 hover:bg-accent/80": !isActive,
                },
                className,
                cls,
              )}
              onClick={() => handleIndicatorClick(idx)}
            />
          );
        })}
      </div>
    </div>
  );
}
