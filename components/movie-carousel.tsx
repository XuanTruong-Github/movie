import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MovieCard } from "@/components/movie-card";
import type { MovieSummary } from "@/lib/types";

interface MovieCarouselProps {
  title: string;
  movies: MovieSummary[];
  viewAllHref?: string;
}

export function MovieCarousel({ title, movies, viewAllHref }: MovieCarouselProps) {
  if (!movies.length) return null;

  return (
    <section className="py-6">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
            {title}
          </h2>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-sm transition-colors duration-200 hover:text-white"
              style={{ color: "#8e8e93" }}
            >
              Xem tất cả →
            </Link>
          )}
        </div>

        {/* Carousel */}
        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent className="-ml-3">
            {movies.map((movie, i) => (
              <CarouselItem
                key={movie.slug}
                className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <MovieCard movie={movie} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="left-0 border-white/10 text-white hover:text-white hover:bg-white/10"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          />
          <CarouselNext
            className="right-0 border-white/10 text-white hover:text-white hover:bg-white/10"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          />
        </Carousel>
      </div>
    </section>
  );
}
