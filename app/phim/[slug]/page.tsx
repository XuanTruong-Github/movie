import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PlayIcon } from "lucide-react";
import { getMovieDetail } from "@/lib/kkphim";
import { EpisodeSelector } from "@/components/episode-selector";

export const revalidate = 600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { movie } = await getMovieDetail(slug);
    return {
      title: movie.name,
      description: movie.content?.replace(/<[^>]*>/g, "").slice(0, 160),
    };
  } catch {
    return { title: "Phim không tồn tại" };
  }
}

export default async function MoviePage({ params }: PageProps) {
  const { slug } = await params;

  let result;
  try {
    result = await getMovieDetail(slug);
  } catch {
    notFound();
  }

  const { movie, episodes } = result;
  if (!movie.slug) notFound();

  const backdrop = movie.thumbUrl ?? movie.posterUrl;
  const watchHref = `/xem/${slug}?server=0&episode=0`;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero backdrop */}
      {backdrop && (
        <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
          <Image
            src={backdrop}
            alt={movie.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>
      )}

      {/* Content */}
      <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 -mt-32 pb-16">
        <div className="flex gap-6 lg:gap-10">
          {/* Sidebar poster */}
          {movie.posterUrl && (
            <div className="hidden lg:block shrink-0 w-44 xl:w-52">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
                <Image
                  src={movie.posterUrl}
                  alt={movie.name}
                  fill
                  sizes="220px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-white leading-tight md:text-4xl">
              {movie.name}
            </h1>
            {movie.originName && (
              <p className="mt-1 text-sm" style={{ color: "#8e8e93" }}>
                {movie.originName}
              </p>
            )}

            {/* Meta */}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: "#8e8e93" }}>
              {movie.year && <span>{movie.year}</span>}
              {movie.quality && (
                <span
                  className="rounded px-1.5 py-0.5 text-xs font-semibold"
                  style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#fff" }}
                >
                  {movie.quality}
                </span>
              )}
              {movie.lang && <span>{movie.lang}</span>}
              {movie.time && <span>{movie.time}</span>}
              {movie.episodeCurrent && <span>{movie.episodeCurrent}</span>}
              {movie.episodeTotal && movie.episodeCurrent !== movie.episodeTotal && (
                <span>/ {movie.episodeTotal} tập</span>
              )}
            </div>

            {/* Categories */}
            {movie.categories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {movie.categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/the-loai/${cat.slug}`}
                    className="rounded-full px-3 py-1 text-xs transition-colors hover:bg-white/20"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {cat.name}
                  </Link>
                ))}
                {movie.countries.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/quoc-gia/${c.slug}`}
                    className="rounded-full px-3 py-1 text-xs transition-colors hover:bg-white/20"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#8e8e93",
                    }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Watch CTA */}
            <div className="mt-6 flex gap-3">
              <Link
                href={watchHref}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "#fff", color: "#000" }}
              >
                <PlayIcon className="size-4 fill-black stroke-none" />
                Xem phim
              </Link>
            </div>

            {/* Description */}
            {movie.content && (
              <div className="mt-6">
                <h2 className="mb-2 text-sm font-semibold" style={{ color: "#8e8e93" }}>
                  Nội dung
                </h2>
                <div
                  className="movie-content text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                  dangerouslySetInnerHTML={{ __html: movie.content }}
                />
              </div>
            )}

            {/* Episodes */}
            {episodes.length > 0 && (
              <div className="mt-8">
                <EpisodeSelector
                  episodes={episodes}
                  movieSlug={slug}
                  activeServerIndex={-1}
                  activeEpisodeIndex={-1}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
