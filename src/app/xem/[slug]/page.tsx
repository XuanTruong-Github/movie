"use client";

import { useEffect, use, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchMovieDetail } from "@/lib/api";
import { buildImageUrl } from "@/lib/utils";
import { PlayerWrapper } from "@/components/player/PlayerWrapper";
import { EmbedPlayer } from "@/components/player/EmbedPlayer";
import { EpisodeList } from "@/components/movie/EpisodeList";
import { MovieInfoPanel } from "@/components/movie/MovieInfoPanel";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { usePlaybackPosition } from "@/hooks/usePlaybackPosition";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { MovieDetailResponse } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function WatchContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const tap = searchParams.get("tap") ?? "";
  const [data, setData] = useState<MovieDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToHistory } = useWatchHistory();
  const { savePosition, getPosition, clearPosition } = usePlaybackPosition();

  useEffect(() => {
    fetchMovieDetail(slug)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const episode = data?.episodes
    ?.flatMap((s) => s.server_data)
    .find((ep) => ep.slug === tap);

  useEffect(() => {
    if (data?.movie && episode) {
      const timer = setTimeout(() => {
        addToHistory({
          movieSlug: slug,
          movieName: data.movie.name,
          thumb_url: data.movie.thumb_url,
          episodeSlug: episode.slug,
          episodeName: episode.name,
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [slug, tap, data, episode, addToHistory]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="w-full rounded-xl bg-cinema-surface animate-pulse"
          style={{ aspectRatio: "16/9" }}
        />
      </div>
    );
  }

  if (!data || !episode) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-white/40">Không tìm thấy tập phim này.</p>
        {slug && (
          <Link href={`/phim/${slug}`} className="mt-4 inline-block text-cinema-accent hover:underline">
            ← Quay lại phim
          </Link>
        )}
      </div>
    );
  }

  const { movie, episodes } = data;
  const posterUrl = buildImageUrl(movie.poster_url || movie.thumb_url);
  const initialTime = getPosition(slug, episode.slug);

  const hasNoLinks = !episode.link_m3u8 && !episode.link_embed;
  const trailerEmbedUrl = hasNoLinks && movie.trailer_url
    ? movie.trailer_url.replace('watch?v=', 'embed/')
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Link
        href={`/phim/${movie.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        {movie.name}
      </Link>

      <div className="rounded-xl overflow-hidden shadow-2xl">
        {trailerEmbedUrl ? (
          <EmbedPlayer url={trailerEmbedUrl} title={movie.name} />
        ) : hasNoLinks ? (
          <div className="w-full flex items-center justify-center bg-cinema-surface rounded-xl text-white/40 text-sm" style={{ aspectRatio: "16/9" }}>
            Chưa có video để phát
          </div>
        ) : (
          <PlayerWrapper
            key={episode.slug}
            src={episode.link_m3u8}
            embedUrl={episode.link_embed}
            poster={posterUrl}
            title={`${movie.name} - Tập ${episode.name}`}
            initialTime={initialTime}
            onTimeUpdate={(t) => savePosition(slug, episode.slug, t)}
            onEnded={() => clearPosition(slug, episode.slug)}
          />
        )}
      </div>

      <div>
        <h1 className="font-display text-lg sm:text-xl font-semibold text-white/90">
          {movie.name}
        </h1>
        <p className="text-white/40 text-sm mt-0.5">
          {movie.type === "single" ? movie.time : `Tập ${episode.name}`}
          {episode.filename && ` · ${episode.filename}`}
        </p>
      </div>

      {episodes.length > 0 && movie.type !== "single" && (
        <EpisodeList
          episodes={episodes}
          movieSlug={movie.slug}
          currentEpisodeSlug={tap}
        />
      )}

      <div className="border-t border-white/6 pt-6">
        <MovieInfoPanel movie={movie} compact />
      </div>
    </div>
  );
}

export default function WatchPage({ params }: PageProps) {
  const { slug } = use(params);
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full rounded-xl bg-cinema-surface animate-pulse" style={{ aspectRatio: "16/9" }} />
        </div>
      }
    >
      <WatchContent slug={slug} />
    </Suspense>
  );
}
