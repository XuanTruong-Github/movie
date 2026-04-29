"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Movie } from "@/lib/types";
import { Button } from "@/components/ui/button";

type HeroSliderProps = {
  items: Movie[];
};

export default function HeroSlider({ items }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % (items.length || 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  const activeMovie = items[current];

  return (
    <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
      {/* Background Image */}
      {activeMovie.poster_url || activeMovie.thumb_url ? (
        <Image
          src={activeMovie.poster_url || activeMovie.thumb_url}
          alt={activeMovie.name}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-primary to-primary/50" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col justify-end">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 line-clamp-2">
          {activeMovie.name}
        </h1>
        {activeMovie.origin_name && (
          <p className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-1">
            {activeMovie.origin_name}
          </p>
        )}

        {/* Movie Info */}
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          {activeMovie.year && (
            <span className="text-sm bg-primary/20 px-2 py-1 rounded">
              {activeMovie.year}
            </span>
          )}
          {activeMovie.quality && (
            <span className="text-sm bg-primary px-2 py-1 rounded text-primary-foreground font-semibold">
              {activeMovie.quality}
            </span>
          )}
          {activeMovie.lang && (
            <span className="text-sm bg-secondary/30 px-2 py-1 rounded">
              {activeMovie.lang}
            </span>
          )}
        </div>

        <Link href={`/phim/${activeMovie.slug}`}>
          <Button size="lg" className="w-full sm:w-auto">
            Xem phim ngay
          </Button>
        </Link>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 flex gap-2">
        {items.slice(0, 6).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1 transition-all ${
              idx === current
                ? "bg-primary w-8"
                : "bg-primary/40 w-2 hover:bg-primary/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
