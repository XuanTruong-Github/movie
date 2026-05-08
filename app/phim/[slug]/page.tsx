import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMovieDetail } from "@/lib/kkphim";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MovieDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { movie, episodes } = await getMovieDetail(slug);
  if (!movie.slug) notFound();

  const poster = movie.posterUrl ?? movie.thumbUrl;
  const firstPlayable = episodes.flatMap((server, serverIndex) =>
    server.serverData.map((episode, episodeIndex) => ({ episode, serverIndex, episodeIndex })),
  )[0];

  return (
    <div className="container grid gap-8 py-8 lg:grid-cols-[320px_1fr]">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border bg-muted">
          {poster ? <Image src={poster} alt={movie.name} fill sizes="320px" className="object-cover" priority /> : null}
        </div>
        {firstPlayable ? (
          <Button asChild size="default">
            <Link href={`/xem/${movie.slug}?server=${firstPlayable.serverIndex}&episode=${firstPlayable.episodeIndex}`}>Xem phim</Link>
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal md:text-5xl">{movie.name}</h1>
            {movie.originName ? <p className="mt-2 text-lg text-muted-foreground">{movie.originName}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.year ? <Badge>{movie.year}</Badge> : null}
            {movie.quality ? <Badge>{movie.quality}</Badge> : null}
            {movie.lang ? <Badge variant="outline">{movie.lang}</Badge> : null}
            {movie.episodeCurrent ? <Badge variant="outline">{movie.episodeCurrent}</Badge> : null}
            {movie.time ? <Badge variant="secondary">{movie.time}</Badge> : null}
          </div>
          {movie.content ? (
            <div
              className="movie-content max-w-3xl text-sm leading-7 text-muted-foreground md:text-base"
              dangerouslySetInnerHTML={{ __html: movie.content }}
            />
          ) : null}
          <div className="flex flex-wrap gap-2">
            {movie.categories.map((category) => (
              <Button key={category.slug} asChild variant="outline" size="sm">
                <Link href={`/the-loai/${category.slug}`}>{category.name}</Link>
              </Button>
            ))}
            {movie.countries.map((country) => (
              <Button key={country.slug} asChild variant="ghost" size="sm">
                <Link href={`/quoc-gia/${country.slug}`}>{country.name}</Link>
              </Button>
            ))}
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách tập</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {episodes.length ? (
              episodes.map((server, serverIndex) => (
                <div key={`${server.serverName}-${serverIndex}`} className="flex flex-col gap-3">
                  <h2 className="text-sm font-medium text-muted-foreground">{server.serverName}</h2>
                  <div className="flex flex-wrap gap-2">
                    {server.serverData.map((episode, episodeIndex) => (
                      <Button key={`${episode.slug}-${episodeIndex}`} asChild variant="secondary" size="sm">
                        <Link href={`/xem/${movie.slug}?server=${serverIndex}&episode=${episodeIndex}`}>Tập {episode.name}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Phim chưa có tập phát.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
