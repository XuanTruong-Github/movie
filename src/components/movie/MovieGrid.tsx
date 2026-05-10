import { MovieCard } from "./MovieCard";
import type { MovieItem } from "@/lib/types";

interface MovieGridProps {
  movies: MovieItem[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  if (!movies?.length) {
    return (
      <div className="text-center py-20 text-white/30">
        Không tìm thấy phim nào.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
      {movies.map((movie, i) => (
        <MovieCard key={movie._id} movie={movie} priority={i < 6} />
      ))}
    </div>
  );
}
