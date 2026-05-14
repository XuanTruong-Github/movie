import { MovieCarousel } from "@/components/movie/MovieCarousel";
import { MovieHero } from "@/components/movie/MovieHero";
import { fetchCinema, fetchSeriesList, fetchStandaloneList } from "@/lib/api";
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
    <section className="container mx-auto px-4 py-10">
      <MovieCarousel title={title} movies={movies} viewAllHref={viewAllHref} />
    </section>
  );
}

export default async function HomePage() {
  const phimChieuRap = await fetchCinema();
  const phimBo = await fetchSeriesList(); // Thay bằng API thực tế cho phim bộ
  const phimLe = await fetchStandaloneList(); // Thay bằng API thực tế cho phim lẻ
  return (
    <>
      <MovieHero movies={phimChieuRap.items ?? []} />
      <HomeSection
        title="Phim Chiếu Rạp"
        movies={phimChieuRap.items ?? []}
        viewAllHref="/danh-sach/phim-chieu-rap"
      />
      <HomeSection
        title="Phim Bộ"
        movies={phimBo.items ?? []}
        viewAllHref="/danh-sach/phim-bo"
      />
      <HomeSection
        title="Phim Lẻ"
        movies={phimLe.items ?? []}
        viewAllHref="/danh-sach/phim-le"
      />
    </>
  );
}
