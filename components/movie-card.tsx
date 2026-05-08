import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { MovieSummary } from "@/lib/types";

export function MovieCard({ movie, priority = false }: { movie: MovieSummary; priority?: boolean }) {
  const poster = movie.posterUrl ?? movie.thumbUrl;

  return (
    <Link href={`/phim/${movie.slug}`} className="group block overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-0.5 hover:border-primary/60">
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {poster ? (
          <Image
            src={poster}
            alt={movie.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition duration-300 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="grid size-full place-items-center px-4 text-center text-sm text-muted-foreground">Không có poster</div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3">
          <div className="flex flex-wrap gap-1">
            {movie.quality ? <Badge>{movie.quality}</Badge> : null}
            {movie.lang ? <Badge variant="outline">{movie.lang}</Badge> : null}
          </div>
        </div>
      </div>
      <div className="flex min-h-28 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-5">{movie.name}</h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{movie.originName}</p>
        <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{movie.year ?? "N/A"}</span>
          <span className="truncate">{movie.episodeCurrent ?? movie.time ?? "Đang cập nhật"}</span>
        </div>
      </div>
    </Link>
  );
}
