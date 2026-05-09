import Link from "next/link";
import { notFound } from "next/navigation";

import { MoviePlayer } from "@/components/movie-player";

export const revalidate = 600;
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMovieDetail } from "@/lib/kkphim";
import { ChevronLeft } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ server?: string; episode?: string }>;
};

function toIndex(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "0", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const { movie, episodes } = await getMovieDetail(slug);
  if (!movie.slug || !episodes.length) notFound();

  const serverIndex = Math.min(toIndex(query.server), episodes.length - 1);
  const server = episodes[serverIndex];
  const episodeIndex = Math.min(
    toIndex(query.episode),
    Math.max(server.serverData.length - 1, 0),
  );
  const episode = server.serverData[episodeIndex];
  if (!episode) notFound();

  const nextEpisode = server.serverData[episodeIndex + 1];
  const nextEpisodeHref = nextEpisode
    ? `/xem/${movie.slug}?server=${serverIndex}&episode=${episodeIndex + 1}`
    : undefined;

  return (
    <div className="container flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-2">
        <Button asChild variant="secondary" size="sm" className="w-fit mb-4">
          <Link href={`/phim/${movie.slug}`}>
            <ChevronLeft />
            Quay lại chi tiết
          </Link>
        </Button>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal md:text-4xl">
              {movie.name}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {server.serverName} · Tập {episode.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.quality ? <Badge variant={'default'}>{movie.quality}</Badge> : null}
            {movie.lang ? <Badge variant="outline">{movie.lang}</Badge> : null}
          </div>
        </div>
      </div>

      <MoviePlayer
        movieSlug={movie.slug}
        title={`${movie.name} - Tập ${episode.name}`}
        poster={movie.thumbUrl ?? movie.posterUrl}
        serverIndex={serverIndex}
        episode={episode}
        nextEpisodeHref={nextEpisodeHref}
      />

      <Card>
        <CardHeader>
          <CardTitle>Chọn tập</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {episodes.map((item, itemServerIndex) => (
            <div
              key={`${item.serverName}-${itemServerIndex}`}
              className="flex flex-col gap-3"
            >
              <h2 className="text-sm font-medium text-muted-foreground">
                {item.serverName}
              </h2>
              <div className="flex flex-wrap gap-2">
                {item.serverData.map((itemEpisode, itemEpisodeIndex) => {
                  const active =
                    itemServerIndex === serverIndex &&
                    itemEpisodeIndex === episodeIndex;
                  return (
                    <Button
                      key={`${itemEpisode.slug}-${itemEpisodeIndex}`}
                      asChild
                      variant={active ? "default" : "secondary"}
                      size="sm"
                    >
                      <Link
                        href={`/xem/${movie.slug}?server=${itemServerIndex}&episode=${itemEpisodeIndex}`}
                      >
                        Tập {itemEpisode.name}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
