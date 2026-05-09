import Link from "next/link";

import type { MovieSummary } from "@/lib/types";
import { MovieCard } from "@/components/movie-card";

interface MovieRowProps {
  title: string;
  movies: MovieSummary[];
  viewAllHref?: string;
  priority?: boolean;
}

export function MovieRow({ title, movies, viewAllHref, priority = false }: MovieRowProps) {
  if (!movies.length) return null;

  return (
    <section className="py-4">
      <div className="container">
        <div className="mb-3 flex items-center justify-between">
          <h2
            className="text-lg font-semibold tracking-wide text-white md:text-xl lg:text-2xl xl:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
          {viewAllHref && (
            <Link href={viewAllHref} className="text-xs text-[#46d369] transition hover:underline lg:text-lg">
              Xem tất cả
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 lg:gap-4">
          {movies.map((movie, i) => (
            <MovieCard key={movie.slug} movie={movie} priority={priority && i < 6} />
          ))}
        </div>
      </div>
    </section>
  );
}
