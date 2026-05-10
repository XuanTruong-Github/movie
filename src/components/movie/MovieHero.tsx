import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { buildImageUrl } from "@/lib/utils";
import type { MovieItem } from "@/lib/types";

interface MovieHeroProps {
  movie: MovieItem;
}

export function MovieHero({ movie }: MovieHeroProps) {
  const posterUrl = buildImageUrl(movie.poster_url || movie.thumb_url);

  return (
    <section className="relative w-full h-[70vh] min-h-[480px] flex items-end overflow-hidden">
      {/* Blurred background poster */}
      <div className="absolute inset-0">
        <Image
          src={posterUrl}
          alt=""
          fill
          className="object-cover scale-110 blur-sm opacity-25"
          priority
          sizes="100vw"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-[#0d0d0d]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/80 via-[#0d0d0d]/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight mb-2">
            {movie.name}
          </h1>
          {movie.origin_name && movie.origin_name !== movie.name && (
            <p className="text-white/40 text-sm sm:text-base mb-4 italic">
              {movie.origin_name}
            </p>
          )}
          <p className="text-white/40 text-sm mb-6">{movie.year}</p>
          <Link
            href={`/phim/${movie.slug}`}
            className="inline-flex items-center gap-2 bg-[#e8d5b7] text-[#0d0d0d] font-semibold px-6 py-3 rounded-xl hover:bg-white transition-colors text-sm"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            Xem ngay
          </Link>
        </div>
      </div>
    </section>
  );
}
