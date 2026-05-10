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
    <section className="space-y-4">
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
  const [latest, series, standalone, comingSoon] = await Promise.all([
    fetchLatestMovies(1),
    fetchSeriesList(1),
    fetchStandaloneList(1),
    fetchComingSoon(1),
  ]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <HomeSection
          title="Phim Mới Cập Nhật"
          movies={latest.items ?? []}
          viewAllHref="/danh-sach/phim-moi"
        />
        <HomeSection
          title="Phim Lẻ"
          movies={standalone.items ?? []}
          viewAllHref="/danh-sach/phim-le"
        />
        <HomeSection
          title="Phim Bộ"
          movies={series.items ?? []}
          viewAllHref="/danh-sach/phim-bo"
        />
        {comingSoon.items?.length > 0 && (
          <HomeSection
            title="Phim Chiếu Rạp"
            movies={comingSoon.items}
            viewAllHref="/danh-sach/phim-sap-chieu"
          />
        )}
    </div>
  );
}
