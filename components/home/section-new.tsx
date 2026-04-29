import { getNewMovies } from "@/configs/api";
import MovieCard from "@/components/movie/movie-card";
import Link from "next/link";

type SectionNewProps = {
  className?: string;
};

export default async function SectionNew({ className = "" }: SectionNewProps) {
  const data = await getNewMovies(1);
  const movies = data?.items?.slice(0, 8) ?? [];

  if (!movies.length) return null;

  return (
    <section className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Phim Mới Cập Nhật</h2>
          <Link
            href="/danh-sach/phim-moi-cap-nhat"
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
