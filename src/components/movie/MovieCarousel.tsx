"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MovieCard } from "./MovieCard";
import type { MovieItem } from "@/lib/types";

interface MovieCarouselProps {
  title: string;
  movies: MovieItem[];
}

export function MovieCarousel({ title, movies }: MovieCarouselProps) {
  if (!movies?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl sm:text-2xl font-semibold text-white/90 italic">
        {title}
      </h2>
      <Carousel
        opts={{ align: "start", dragFree: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {movies.map((movie, i) => (
            <CarouselItem
              key={movie._id}
              className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <MovieCard movie={movie} priority={i < 4} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
