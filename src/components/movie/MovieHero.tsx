"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { buildImageUrl, cn } from "@/lib/utils";
import type { MovieItem } from "@/lib/types";

interface MovieHeroProps {
  movies: MovieItem[];
}

export function MovieHero({ movies }: MovieHeroProps) {
  const slides = movies.slice(0, 5);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api]);

  // Autoplay every 5s
  React.useEffect(() => {
    if (!api) return;
    const id = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(id);
  }, [api]);

  if (!slides.length) return null;

  return (
    <section className="relative w-full mb-10">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((movie, i) => {
            const posterUrl = buildImageUrl(movie.poster_url);
            return (
              <CarouselItem key={movie._id} className="pl-0 basis-full">
                <div className="relative w-full h-[70vh] min-h-120 flex items-end overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-full pointer-events-none">
                    <Image
                      src={posterUrl}
                      alt={movie.name}
                      fill
                      className="object-cover object-center opacity-50"
                      sizes="50vw"
                      priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-[#0d0d0d] via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
                    <div className="max-w-2xl">
                      <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight mb-2">
                        {movie.name}
                      </h1>
                      {movie.origin_name && movie.origin_name !== movie.name && (
                        <p className="text-white/40 text-sm sm:text-base mb-3 italic">
                          {movie.origin_name}
                        </p>
                      )}
                      <p className="text-white/40 text-sm mb-6">{movie.year}</p>
                      <Link
                        href={`/phim/${movie.slug}`}
                        className="inline-flex items-center gap-2 bg-cinema-accent text-[#0d0d0d] font-semibold px-6 py-3 rounded-xl hover:bg-white transition-colors text-sm"
                      >
                        <Play className="w-4 h-4" fill="currentColor" />
                        Xem ngay
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Prev / Next */}
        <button
          onClick={() => api?.scrollPrev()}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 border border-white/10 text-white hover:bg-black/80 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => api?.scrollNext()}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 border border-white/10 text-white hover:bg-black/80 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "rounded-full transition-all duration-300",
                i === current
                  ? "w-6 h-2 bg-cinema-accent"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}
