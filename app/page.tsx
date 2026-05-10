import { HeroBanner } from "@/components/hero-banner";
import { MovieCarousel } from "@/components/movie-carousel";
import { getLatestMovies, getMoviesByType } from "@/lib/kkphim";

export const revalidate = 180;

export default async function HomePage() {
  const [latestRes, cinemaRes, animeRes] = await Promise.allSettled([
    getLatestMovies(1),
    getMoviesByType("phim-chieu-rap", 1),
    getMoviesByType("hoat-hinh", 1),
  ]);

  const latest = latestRes.status === "fulfilled" ? latestRes.value.items : [];
  const cinema = cinemaRes.status === "fulfilled" ? cinemaRes.value.items : [];
  const anime = animeRes.status === "fulfilled" ? animeRes.value.items : [];

  const heroMovie = cinema[0] ?? latest[0] ?? null;

  return (
    <div className="min-h-screen bg-black">
      {heroMovie && <HeroBanner movie={heroMovie} />}

      <div className="pb-10">
        {cinema.length > 0 && (
          <MovieCarousel
            title="Phim Chiếu Rạp"
            movies={cinema.slice(0, 24)}
            viewAllHref="/danh-sach/phim-chieu-rap"
          />
        )}
        <MovieCarousel
          title="Phim Mới Nhất"
          movies={latest.slice(0, 24)}
          viewAllHref="/danh-sach/phim-moi-cap-nhat"
        />
        <MovieCarousel
          title="Hoạt Hình"
          movies={anime.slice(0, 24)}
          viewAllHref="/danh-sach/hoat-hinh"
        />
      </div>
    </div>
  );
}
