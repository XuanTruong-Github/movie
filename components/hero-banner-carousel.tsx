"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayIcon, InfoIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { MovieSummary } from "@/lib/types";

export function HeroBannerCarousel({ movies }: { movies: MovieSummary[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  return (
    <div className="relative h-[72vh] min-h-[500px] max-h-[760px] w-full overflow-hidden">
      <Carousel opts={{ loop: true }} setApi={setApi} className="h-full">
        <CarouselContent className="!ml-0 h-full">
          {movies.map((movie, i) => {
            const backdrop = movie.thumbUrl ?? movie.posterUrl;
            return (
              <CarouselItem
                key={movie.slug}
                className="!pl-0 relative h-[72vh] min-h-[500px] max-h-[760px] overflow-hidden"
              >
                {backdrop && (
                  <Image
                    src={backdrop}
                    alt={movie.name}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover object-center"
                    style={{ objectPosition: "center 20%" }}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                <div className="absolute inset-0 flex items-end pb-16 sm:pb-20">
                  <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6">
                    <div className="max-w-lg">
                      <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                        {movie.name}
                      </h1>
                      {movie.originName && (
                        <p
                          className="mt-1 text-sm sm:text-base"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          {movie.originName}
                        </p>
                      )}

                      <div
                        className="mt-3 flex flex-wrap items-center gap-2 text-sm"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {movie.year && <span>{movie.year}</span>}
                        {movie.quality && (
                          <span
                            className="rounded px-1.5 py-0.5 text-xs font-semibold"
                            style={{
                              border: "1px solid rgba(255,255,255,0.4)",
                              color: "rgba(255,255,255,0.9)",
                            }}
                          >
                            {movie.quality}
                          </span>
                        )}
                        {movie.lang && <span>{movie.lang}</span>}
                        {movie.time && <span>{movie.time}</span>}
                        {movie.episodeCurrent && (
                          <span>{movie.episodeCurrent}</span>
                        )}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          href={`/xem/${movie.slug}?server=0&episode=0`}
                          className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
                          style={{ background: "#fff", color: "#000" }}
                        >
                          <PlayIcon className="size-4 fill-black stroke-none" />
                          Xem ngay
                        </Link>
                        <Link
                          href={`/phim/${movie.slug}`}
                          className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20"
                          style={{
                            background: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <InfoIcon className="size-4" />
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Arrow buttons */}
      <button
        onClick={scrollPrev}
        aria-label="Slide trước"
        className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full p-2 text-white transition-all duration-200 hover:bg-white/20 sm:flex"
        style={{
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
        }}
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Slide tiếp theo"
        className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full p-2 text-white transition-all duration-200 hover:bg-white/20 sm:flex"
        style={{
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
        }}
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 right-6 z-10 flex gap-1.5">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
