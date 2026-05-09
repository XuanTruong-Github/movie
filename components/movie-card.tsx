import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { MovieSummary } from "@/lib/types";

export function MovieCard({
  movie,
  priority = false,
}: {
  movie: MovieSummary;
  priority?: boolean;
}) {
  const poster = movie.posterUrl ?? movie.thumbUrl;

  return (
    <div className="group">
      <Link
        href={`/phim/${movie.slug}`}
        className="block rounded overflow-hidden"
      >
        {/* Poster */}
        <div className="relative aspect-2/3 bg-card overflow-hidden rounded">
          {poster ? (
            <Image
              src={poster}
              alt={movie.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 220px"
              className="object-cover transition duration-300 group-hover:scale-110"
              priority={priority}
            />
          ) : (
            <div className="grid size-full place-items-center px-4 text-center text-xs text-muted-foreground">
              Không có poster
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/90 to-transparent p-2">
            <div className="flex flex-wrap gap-1">
              {movie.quality ? (
                <Badge
                  variant="default"
                  className="text-[10px] leading-none px-1.5 py-0.5"
                >
                  {movie.quality}
                </Badge>
              ) : null}
              {movie.lang ? (
                <Badge
                  variant="outline"
                  className="text-[10px] leading-none px-1.5 py-0.5 border-white/30 text-white/80"
                >
                  {movie.lang}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </Link>

      {/* Info — always visible */}
      <div className="mt-1.5 px-0.5">
        <Link href={`/phim/${movie.slug}`} className="inline-block mb-1">
          <h3 className="text-sm font-medium text-white line-clamp-2 leading-5 hover:text-primary transition-colors">
            {movie.name}
          </h3>
        </Link>
        <p className="text-xs/normal text-muted-foreground">
          {movie.originName}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          {movie.episodeCurrent && <Badge variant={'secondary'}>{movie.episodeCurrent}</Badge>}
        </div>
      </div>
    </div>
  );
}
