import Image from "next/image";
import Link from "next/link";
import { PlayIcon, InfoIcon } from "lucide-react";
import type { MovieSummary } from "@/lib/types";

export function HeroBanner({ movie }: { movie: MovieSummary }) {
  const backdrop = movie.thumbUrl ?? movie.posterUrl;

  return (
    <div className="relative h-[72vh] min-h-[500px] max-h-[760px] w-full overflow-hidden">
      {/* Backdrop */}
      {backdrop && (
        <Image
          src={backdrop}
          alt={movie.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{ objectPosition: "center 20%" }}
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6">
          <div className="max-w-lg">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {movie.name}
            </h1>
            {movie.originName && (
              <p className="mt-1 text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
                {movie.originName}
              </p>
            )}

            {/* Meta row */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              {movie.year && <span>{movie.year}</span>}
              {movie.quality && (
                <span
                  className="rounded px-1.5 py-0.5 text-xs font-semibold"
                  style={{ border: "1px solid rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.9)" }}
                >
                  {movie.quality}
                </span>
              )}
              {movie.lang && <span>{movie.lang}</span>}
              {movie.time && <span>{movie.time}</span>}
              {movie.episodeCurrent && <span>{movie.episodeCurrent}</span>}
            </div>

            {/* CTA buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/xem/${movie.slug}?server=0&episode=0`}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: "#fff", color: "#000" }}
              >
                <PlayIcon className="size-4 fill-black stroke-none" />
                Xem ngay
              </Link>
              <Link
                href={`/phim/${movie.slug}`}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <InfoIcon className="size-4" />
                Chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
