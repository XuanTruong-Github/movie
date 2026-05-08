import { Empty } from "@/components/ui/empty";
import { MovieCard } from "@/components/movie-card";
import type { MovieSummary } from "@/lib/types";

export function MovieGrid({ movies }: { movies: MovieSummary[] }) {
  if (!movies.length) {
    return <Empty title="Không có phim" description="Nguồn API chưa trả về nội dung phù hợp." />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie, index) => (
        <MovieCard key={movie.slug} movie={movie} priority={index < 6} />
      ))}
    </div>
  );
}
