import { getMoviesByType } from "@/configs/api";
import MovieCard from "@/components/movie/movie-card";
import Link from "next/link";

type SectionMoviesProps = {
  type: "phim-le" | "phim-bo" | "hoat-hinh" | "tv-shows";
  className?: string;
};

const typeLabels: Record<string, string> = {
  "phim-le": "Phim Lẻ",
  "phim-bo": "Phim Bộ",
  "hoat-hinh": "Hoạt Hình",
  "tv-shows": "TV Shows",
};

export default async function SectionMovies({
  type,
  className = "",
}: SectionMoviesProps) {
  const data = await getMoviesByType(type, 1);
  const movies = data?.items?.slice(0, 8) ?? [];

  if (!movies.length) return null;

  return (
    <section className={`${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{typeLabels[type]}</h2>
          <Link
            href={`/danh-sach/${type}`}
            className="text-primary hover:underline text-sm font-medium"
          >
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.slug} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}
