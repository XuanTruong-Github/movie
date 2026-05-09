import Image from "next/image";
import Link from "next/link";
import { PlayIcon, InfoIcon } from "lucide-react";

import { MovieRow } from "@/components/movie-row";
import { getLatestMovies, getMoviesByType } from "@/lib/kkphim";

export default async function HomePage() {
  const [latest, single, series, anime] = await Promise.allSettled([
    getLatestMovies(1),
    getMoviesByType("phim-le", 1),
    getMoviesByType("phim-bo", 1),
    getMoviesByType("hoat-hinh", 1),
  ]);

  const latestMovies = latest.status === "fulfilled" ? latest.value.items : [];
  const singleMovies = single.status === "fulfilled" ? single.value.items : [];
  const seriesMovies = series.status === "fulfilled" ? series.value.items : [];
  const animeMovies = anime.status === "fulfilled" ? anime.value.items : [];

  const hero = latestMovies[0];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#141414" }}>
      {/* Hero Banner */}
      {hero && (
        <section className="relative h-[70vh] min-h-120 w-full overflow-hidden md:h-[85vh]">
          {/* Backdrop */}
          {(hero.thumbUrl ?? hero.posterUrl) && (
            <Image
              src={(hero.thumbUrl ?? hero.posterUrl)!}
              alt={hero.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 to-transparent h-32" />

          {/* Content */}
          <div className="absolute inset-0 flex items-end pb-16 md:items-center md:pb-0">
            <div className="container max-w-2xl">
              <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                Phim mới nhất
              </p>
              <h1
                className="mb-3 text-4xl leading-tight text-white md:text-6xl"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}
              >
                {hero.name}
              </h1>
              {hero.originName && (
                <p className="mb-4 text-sm text-white/60 md:text-base">{hero.originName}</p>
              )}
              <div className="mb-6 flex flex-wrap gap-2 text-xs text-white/70">
                {hero.year && <span className="text-[#46d369] font-semibold">{hero.year}</span>}
                {hero.quality && (
                  <span className="rounded border border-white/30 px-1.5 py-0.5">{hero.quality}</span>
                )}
                {hero.lang && (
                  <span className="rounded border border-white/30 px-1.5 py-0.5">{hero.lang}</span>
                )}
                {hero.episodeCurrent && <span>{hero.episodeCurrent}</span>}
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/phim/${hero.slug}`}
                  className="flex items-center gap-2 rounded px-6 py-2.5 text-sm font-semibold text-black bg-white transition hover:bg-white/80"
                >
                  <PlayIcon className="size-4 fill-black" />
                  Xem ngay
                </Link>
                <Link
                  href={`/phim/${hero.slug}`}
                  className="flex items-center gap-2 rounded px-6 py-2.5 text-sm font-semibold text-white bg-white/20 backdrop-blur transition hover:bg-white/30"
                >
                  <InfoIcon className="size-4" />
                  Chi tiết
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Movie Rows — overlap hero slightly */}
      <div className="relative z-10 -mt-16 flex flex-col gap-2 pb-12">
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
      </div>
    </div>
  );
}
