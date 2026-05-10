import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorite-button";
import type { MovieSummary } from "@/lib/types";

export function MovieCard({ movie }: { movie: MovieSummary }) {
  const poster = movie.posterUrl ?? movie.thumbUrl;

  return (
    <div className="group">
      <Link href={`/phim/${movie.slug}`} className="block">
        {/* Poster */}
        <div
          className="relative aspect-[2/3] overflow-hidden rounded-xl"
          style={{ background: "#1c1c1e" }}
        >
          {poster ? (
            <Image
              src={poster}
              alt={movie.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 220px"
              className="object-cover transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-110"
              loading="lazy"
            />
          ) : (
            <div
              className="grid size-full place-items-center px-4 text-center text-xs"
              style={{ color: "#8e8e93" }}
            >
              Không có poster
            </div>
          )}

          {/* Episode badge — top-left */}
          {movie.episodeCurrent && (
            <div className="absolute left-2 top-2 z-10">
              <Badge
                className="px-1.5 py-0.5 text-[10px] font-medium leading-none rounded"
                style={{
                  background: "rgba(0,0,0,0.72)",
                  color: "#fff",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {movie.episodeCurrent}
              </Badge>
            </div>
          )}

          {/* Quality + lang badges — bottom */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2 pb-2.5">
            <div className="flex flex-wrap gap-1">
              {movie.quality && (
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none"
                  style={{ background: "#fff", color: "#000" }}
                >
                  {movie.quality}
                </span>
              )}
              {movie.lang && (
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] leading-none"
                  style={{
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  {movie.lang}
                </span>
              )}
            </div>
          </div>

          {/* Favorite button */}
          <FavoriteButton movie={movie} />
        </div>
      </Link>

      {/* Text info */}
      <div className="mt-2 space-y-0.5 px-0.5">
        <Link href={`/phim/${movie.slug}`}>
          <h3
            className="text-sm font-medium line-clamp-2 leading-snug transition-colors duration-200 hover:opacity-70"
            style={{ color: "#fff" }}
          >
            {movie.name}
          </h3>
        </Link>
        {movie.originName && (
          <p className="text-xs line-clamp-1" style={{ color: "#8e8e93" }}>
            {movie.originName}
          </p>
        )}
      </div>
    </div>
  );
}
