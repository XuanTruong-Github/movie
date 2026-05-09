import { MovieRow } from "@/components/movie-row";
import { getLatestMovies, getMoviesByType } from "@/lib/kkphim";

export const revalidate = 180;

export default async function HomePage() {
  const [latest, single, series, anime, cinema] = await Promise.allSettled([
    getLatestMovies(1),
    getMoviesByType("phim-le", 1),
    getMoviesByType("phim-bo", 1),
    getMoviesByType("hoat-hinh", 1),
    getMoviesByType("phim-chieu-rap", 1),
  ]);

  const latestMovies = latest.status === "fulfilled" ? latest.value.items : [];
  const singleMovies = single.status === "fulfilled" ? single.value.items : [];
  const seriesMovies = series.status === "fulfilled" ? series.value.items : [];
  const animeMovies = anime.status === "fulfilled" ? anime.value.items : [];
  const cinemaMovies = cinema.status === "fulfilled" ? cinema.value.items : [];

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#141414" }}
    >
      {latestMovies.length > 0 && (
        <MovieRow
          title="Phim mới cập nhật"
          movies={latestMovies.slice(0, 20)}
          viewAllHref="/danh-sach/phim-moi-cap-nhat"
          priority
        />
      )}
      {singleMovies.length > 0 && (
        <MovieRow
          title="Phim lẻ nổi bật"
          movies={singleMovies.slice(0, 20)}
          viewAllHref="/danh-sach/phim-le"
        />
      )}
      {seriesMovies.length > 0 && (
        <MovieRow
          title="Phim bộ mới"
          movies={seriesMovies.slice(0, 20)}
          viewAllHref="/danh-sach/phim-bo"
        />
      )}
      {animeMovies.length > 0 && (
        <MovieRow
          title="Hoạt hình"
          movies={animeMovies.slice(0, 20)}
          viewAllHref="/danh-sach/hoat-hinh"
        />
      )}
      {cinemaMovies.length > 0 && (
        <MovieRow
          title="Phim chiếu rạp"
          movies={cinemaMovies.slice(0, 20)}
          viewAllHref="/danh-sach/phim-chieu-rap"
        />
      )}
    </div>
  );
}
