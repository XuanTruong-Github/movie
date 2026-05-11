import { MovieGrid } from "@/components/movie/MovieGrid";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  fetchComingSoon,
  fetchLatestMovies,
  fetchSeriesList,
  fetchStandaloneList,
} from "@/lib/api";
import type { MovieItem } from "@/lib/types";

function HomeSection({
  title,
  movies,
  viewAllHref,
}: {
  title: string;
  movies: MovieItem[];
  viewAllHref?: string;
}) {
  if (!movies?.length) return null;
  return (
    <section className="container mx-auto px-4 space-y-4 py-10">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-white/90 italic">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm text-cinema-accent/70 hover:text-cinema-accent transition-colors"
          >
            Xem thêm
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <MovieGrid movies={movies} />
    </section>
  );
}

export default async function HomePage() {
  const latest = await fetchLatestMovies(1);

  return (
    <HomeSection
      title="Phim Mới Cập Nhật"
      movies={latest.items ?? []}
      viewAllHref="/danh-sach/phim-moi"
    />
  );
}
