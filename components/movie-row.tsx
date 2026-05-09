"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import type { MovieSummary } from "@/lib/types";
import { MovieCard } from "@/components/movie-card";

interface MovieRowProps {
  title: string;
  movies: MovieSummary[];
  viewAllHref?: string;
  priority?: boolean;
}

export function MovieRow({ title, movies, viewAllHref, priority = false }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir === "right" ? 640 : -640, behavior: "smooth" });
  };

  if (!movies.length) return null;

  return (
    <section className="group/row relative py-4">
      <div className="container">
        <div className="mb-3 flex items-center justify-between">
          <h2
            className="text-lg font-semibold tracking-wide text-white md:text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs text-[#46d369] transition hover:underline"
            >
              Xem tất cả
            </Link>
          )}
        </div>
      </div>

      {/* Scroll arrows */}
      <button
        onClick={() => scroll("left")}
        aria-label="Cuộn trái"
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 opacity-0 transition-opacity group-hover/row:opacity-100 hidden md:grid place-items-center size-10 bg-black/60 hover:bg-black/90 rounded-r"
      >
        <ChevronLeftIcon className="size-6 text-white" />
      </button>
      <button
        onClick={() => scroll("right")}
        aria-label="Cuộn phải"
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 opacity-0 transition-opacity group-hover/row:opacity-100 hidden md:grid place-items-center size-10 bg-black/60 hover:bg-black/90 rounded-l"
      >
        <ChevronRightIcon className="size-6 text-white" />
      </button>

      {/* Scrollable row */}
      <div
        ref={rowRef}
        className="scrollbar-none flex gap-2 overflow-x-auto px-[max(1rem,_calc((100%-1180px)/2))]"
        style={{ paddingRight: "max(1rem, calc((100% - 1180px) / 2))" }}
      >
        {movies.map((movie, i) => (
          <div key={movie.slug} className="w-[150px] shrink-0 md:w-[180px] lg:w-[200px]">
            <MovieCard movie={movie} priority={priority && i < 6} />
          </div>
        ))}
      </div>
    </section>
  );
}
