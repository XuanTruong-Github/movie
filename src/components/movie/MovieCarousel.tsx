"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { MovieCard } from "./MovieCard";
import type { MovieItem } from "@/lib/types";

interface MovieCarouselProps {
  title: string;
  movies: MovieItem[];
  viewAllHref?: string;
}

export function MovieCarousel({
  title,
  movies,
  viewAllHref,
}: MovieCarouselProps) {
  if (!movies?.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-white/90 italic">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm text-cinema-accent/70 hover:text-cinema-accent transition-colors"
          >
            Xem thêm
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent className="-ml-3">
          {movies.map((movie, i) => (
            <CarouselItem
              key={movie._id}
              className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <MovieCard movie={movie} priority={i < 2} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
