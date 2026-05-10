import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchMovieDetail, fetchMoviesByGenre } from "@/lib/api";
import { buildImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EpisodeList } from "@/components/movie/EpisodeList";
import { MovieInfoPanel } from "@/components/movie/MovieInfoPanel";
import { MovieCarousel } from "@/components/movie/MovieCarousel";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import Link from "next/link";
import { Play } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { movie } = await fetchMovieDetail(slug);
    return {
      title: movie.name,
      description: movie.content?.replace(/<[^>]+>/g, "").slice(0, 160),
    };
  } catch {
    return { title: "Không tìm thấy" };
  }
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let data;
  try {
    data = await fetchMovieDetail(slug);
  } catch {
    notFound();
  }

  const { movie, episodes } = data;
  const posterUrl = buildImageUrl(movie.poster_url || movie.thumb_url);
  const thumbUrl = buildImageUrl(movie.thumb_url);

  const firstEpisode = episodes?.[0]?.server_data?.[0];

  const similarMovies =
    movie.category?.[0]?.slug
      ? (await fetchMoviesByGenre(movie.category[0].slug, 1).catch(() => ({ items: [] }))).items.filter(
          (m) => m.slug !== movie.slug
        )
      : [];

  return (
    <div>
      {/* Hero section */}
      <div className="relative w-full h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={posterUrl}
            alt=""
            fill
            className="object-cover scale-110 opacity-20"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/30 to-[#0d0d0d]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/30 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <div className="flex gap-6 items-end">
            {/* Thumbnail */}
            <div className="hidden sm:block shrink-0 w-32 md:w-40">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={thumbUrl}
                  alt={movie.name}
                  fill
                  className="object-cover"
                  sizes="160px"
                  priority
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 animate-fade-up">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {movie.quality && (
                  <Badge className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {movie.quality}
                  </Badge>
                )}
                {movie.lang && (
                  <Badge variant="secondary" className="text-xs">{movie.lang}</Badge>
                )}
                <Badge variant="outline" className="text-xs text-white/50 border-white/15">
                  {movie.year}
                </Badge>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-1">
                {movie.name}
              </h1>
              {movie.origin_name && movie.origin_name !== movie.name && (
                <p className="text-white/40 text-sm italic mb-4">{movie.origin_name}</p>
              )}

              <div className="flex flex-wrap gap-3 items-center">
                {firstEpisode && (
                  <Link
                    href={`/xem/${movie.slug}?tap=${firstEpisode.slug}`}
                    className="inline-flex items-center gap-2 bg-[#e8d5b7] text-[#0d0d0d] font-semibold px-5 py-2.5 rounded-xl hover:bg-white transition-colors text-sm"
                  >
                    <Play className="w-4 h-4" fill="currentColor" />
                    {movie.type === "single" ? "Xem phim" : "Xem tập 1"}
                  </Link>
                )}
                <FavoriteButton movie={movie} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-8">
            <MovieInfoPanel movie={movie} />
            <EpisodeList episodes={episodes} movieSlug={movie.slug} />
          </div>
        </div>

        {similarMovies.length > 0 && (
          <MovieCarousel title="Phim tương tự" movies={similarMovies.slice(0, 12)} />
        )}
      </div>
    </div>
  );
}
