import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { buildImageUrl, cn } from "@/lib/utils";
import type { MovieItem } from "@/lib/types";

interface MovieCardProps {
  movie: MovieItem;
  priority?: boolean;
}

const qualityColors: Record<string, string> = {
  FHD: "bg-blue-500/80 text-white",
  HD: "bg-green-600/80 text-white",
  SD: "bg-yellow-600/80 text-white",
  CAM: "bg-amber-600/80 text-white",
};

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  const thumbUrl = buildImageUrl(movie.thumb_url);
  const isTrailer = movie.episode_current?.toLowerCase() === "trailer";
  const qualityKey = movie.quality?.toUpperCase();

  return (
    <Link
      href={`/phim/${movie.slug}`}
      className="group relative flex-shrink-0 block"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a1a]">
        <Image
          src={thumbUrl}
          alt={movie.name}
          fill
          className="object-cover transition-all duration-300 group-hover:brightness-75"
          sizes="(max-width: 640px) 150px, 170px"
          priority={priority}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges - top-left, always visible */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isTrailer ? (
            <Badge className="bg-red-600/90 text-white text-[9px] px-1.5 py-0 leading-5">
              TRAILER
            </Badge>
          ) : (
            <>
              {qualityKey && qualityColors[qualityKey] && (
                <Badge className={cn(qualityColors[qualityKey], "text-[9px] px-1.5 py-0 leading-5")}>
                  {qualityKey}
                </Badge>
              )}
              {movie.episode_current && (
                <Badge className="bg-black/70 text-white/80 text-[9px] px-1.5 py-0 leading-5">
                  {movie.episode_current}
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Favorite button - visible on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <FavoriteButton movie={movie} />
        </div>

        {/* Bottom info - slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-xs font-medium line-clamp-2 leading-snug">
            {movie.name}
          </p>
          <p className="text-white/50 text-xs mt-0.5">{movie.origin_name}</p>
        </div>
      </div>

      {/* Title below card */}
      <div className="mt-2 px-0.5 lg:hidden">
        <p className="text-white/80 text-xs font-medium line-clamp-2 leading-snug group-hover:text-white transition-colors">
          {movie.name}
        </p>
        <p className="text-white/35 text-xs mt-0.5">{movie.origin_name}</p>
      </div>
    </Link>
  );
}
