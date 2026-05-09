import Image from "next/image";
import Link from "next/link";
import { PlayCircleIcon } from "lucide-react";

import type { MovieSummary } from "@/lib/types";

export function MovieCard({ movie, priority = false }: { movie: MovieSummary; priority?: boolean }) {
  const poster = movie.posterUrl ?? movie.thumbUrl;

  return (
    <div className="group relative shrink-0">
      <Link
        href={`/phim/${movie.slug}`}
        className="block rounded overflow-hidden"
        style={{ width: "100%" }}
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
                <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-primary text-white leading-none">
                  {movie.quality}
                </span>
              ) : null}
              {movie.lang ? (
                <span className="rounded border border-white/30 px-1.5 py-0.5 text-[10px] text-white/80 leading-none">
                  {movie.lang}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Hover info panel */}
        <div className="absolute inset-x-0 top-full z-20 translate-y-0 opacity-0 transition-all duration-200 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
          <div className="rounded-b bg-[#181818] shadow-2xl shadow-black/60 p-3 border border-[#333] border-t-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="grid size-8 place-items-center rounded-full bg-white text-black hover:bg-white/90 shrink-0">
                <PlayCircleIcon className="size-5 fill-black" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-white line-clamp-2 leading-5 mb-1">
              {movie.name}
            </h3>
            {movie.originName && (
              <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">{movie.originName}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {movie.year && <span className="text-[#46d369] font-semibold">{movie.year}</span>}
              {movie.episodeCurrent && <span>{movie.episodeCurrent}</span>}
              {movie.time && !movie.episodeCurrent && <span>{movie.time}</span>}
            </div>
            {movie.categories.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {movie.categories.slice(0, 2).map((cat) => (
                  <span key={cat.slug} className="text-[10px] text-muted-foreground">
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
