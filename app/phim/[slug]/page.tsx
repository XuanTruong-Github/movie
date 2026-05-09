import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayIcon } from "lucide-react";

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

  const backdrop = movie.thumbUrl ?? movie.posterUrl;
  const firstPlayable = episodes.flatMap((server, serverIndex) =>
    server.serverData.map((episode, episodeIndex) => ({ episode, serverIndex, episodeIndex })),
  )[0];

  return (
    <div style={{ background: "#141414" }}>
      {/* Hero backdrop */}
      <div className="relative h-[60vh] min-h-96 w-full overflow-hidden">
        {backdrop && (
          <Image
            src={backdrop}
            alt={movie.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />

        {/* Hero info overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container pb-10">
            <h1
              className="text-4xl text-white md:text-6xl"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}
            >
              {movie.name}
            </h1>
            {movie.originName && (
              <p className="mt-1 text-sm text-white/60 md:text-base">{movie.originName}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {movie.year && (
                <span className="text-sm font-semibold text-[#46d369]">{movie.year}</span>
              )}
              {movie.quality && <Badge>{movie.quality}</Badge>}
              {movie.lang && <Badge variant="outline">{movie.lang}</Badge>}
              {movie.episodeCurrent && <Badge variant="outline">{movie.episodeCurrent}</Badge>}
              {movie.time && <Badge variant="secondary">{movie.time}</Badge>}
            </div>
            {firstPlayable && (
              <div className="mt-5 flex gap-3">
                <Button asChild size="default" className="gap-2 bg-white text-black hover:bg-white/80">
                  <Link href={`/xem/${movie.slug}?server=${firstPlayable.serverIndex}&episode=${firstPlayable.episodeIndex}`}>
                    <PlayIcon className="size-4 fill-black" />
                    Xem phim
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content below hero */}
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar poster */}
          <div className="hidden lg:block">
            <div className="relative aspect-2/3 overflow-hidden rounded-lg border border-border bg-card">
              {(movie.posterUrl ?? movie.thumbUrl) ? (
                <Image
                  src={(movie.posterUrl ?? movie.thumbUrl)!}
                  alt={movie.name}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              ) : null}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            {movie.content && (
              <section>
                <h2 className="mb-3 text-lg font-semibold text-white">Nội dung</h2>
                <div
                  className="movie-content text-sm leading-7 text-muted-foreground md:text-base"
                  dangerouslySetInnerHTML={{ __html: movie.content }}
                />
              </section>
            )}

            {(movie.categories.length > 0 || movie.countries.length > 0) && (
              <section className="flex flex-wrap gap-2">
                {movie.categories.map((cat) => (
                  <Button key={cat.slug} asChild variant="outline" size="sm">
                    <Link href={`/the-loai/${cat.slug}`}>{cat.name}</Link>
                  </Button>
                ))}
                {movie.countries.map((country) => (
                  <Button key={country.slug} asChild variant="ghost" size="sm">
                    <Link href={`/quoc-gia/${country.slug}`}>{country.name}</Link>
                  </Button>
                ))}
              </section>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Danh sách tập</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                {episodes.length ? (
                  episodes.map((server, serverIndex) => (
                    <div key={`${server.serverName}-${serverIndex}`} className="flex flex-col gap-3">
                      <h3 className="text-sm font-medium text-muted-foreground">{server.serverName}</h3>
                      <div className="flex flex-wrap gap-2">
                        {server.serverData.map((episode, episodeIndex) => (
                          <Button key={`${episode.slug}-${episodeIndex}`} asChild variant="secondary" size="sm">
                            <Link href={`/xem/${movie.slug}?server=${serverIndex}&episode=${episodeIndex}`}>
                              Tập {episode.name}
                            </Link>
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
      </div>
    </div>
  );
}
