import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeftIcon } from "lucide-react";
import { getMovieDetail } from "@/lib/kkphim";
import { MoviePlayer } from "@/components/movie-player";
import { EpisodeSelector } from "@/components/episode-selector";
import { clampPage } from "@/lib/utils";

export const revalidate = 600;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ server?: string; episode?: string }>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { episode: epParam } = await searchParams;
  try {
    const { movie, episodes } = await getMovieDetail(slug);
    const epIndex = clampPage(epParam) - 1;
    const ep = episodes[0]?.serverData[epIndex];
    const epLabel = ep
      ? ` - ${ep.name.startsWith("Tập") ? ep.name : `Tập ${ep.name}`}`
      : "";
    return { title: `${movie.name}${epLabel}` };
  } catch {
    return { title: "Xem phim" };
  }
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { server: serverParam, episode: episodeParam } = await searchParams;

  let result;
  try {
    result = await getMovieDetail(slug);
  } catch {
    notFound();
  }

  const { movie, episodes } = result;
  if (!episodes.length) notFound();

  const serverIndex = Math.max(
    0,
    Math.min(Number(serverParam ?? 0) || 0, episodes.length - 1)
  );
  const server = episodes[serverIndex];
  const episodeIndex = Math.max(
    0,
    Math.min(Number(episodeParam ?? 0) || 0, server.serverData.length - 1)
  );
  const episode = server.serverData[episodeIndex];

  const nextEpisode =
    episodeIndex + 1 < server.serverData.length
      ? server.serverData[episodeIndex + 1]
      : null;
  const nextEpisodeHref = nextEpisode
    ? `/xem/${slug}?server=${serverIndex}&episode=${episodeIndex + 1}`
    : undefined;

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6">
        {/* Back link */}
        <Link
          href={`/phim/${slug}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white"
          style={{ color: "#8e8e93" }}
        >
          <ChevronLeftIcon className="size-4" />
          {movie.name}
        </Link>

        {/* Episode label */}
        <h1 className="mb-4 text-lg font-semibold text-white">
          {movie.name}
          {episode.name
          ? ` — ${episode.name.startsWith("Tập") ? episode.name : `Tập ${episode.name}`}`
          : ""}
        </h1>

        {/* Player */}
        <MoviePlayer
          episode={episode}
          movie={movie}
          movieSlug={slug}
          serverIndex={serverIndex}
          episodeIndex={episodeIndex}
          nextEpisodeHref={nextEpisodeHref}
          posterUrl={movie.thumbUrl ?? movie.posterUrl}
        />

        {/* Episode selector */}
        <div className="mt-6">
          <EpisodeSelector
            episodes={episodes}
            movieSlug={slug}
            activeServerIndex={serverIndex}
            activeEpisodeIndex={episodeIndex}
          />
        </div>
      </div>
    </div>
  );
}
