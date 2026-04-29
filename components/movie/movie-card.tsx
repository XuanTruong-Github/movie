import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type MovieCardProps = {
  movie: Movie;
};

function getImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return url;
  return `https://img.phimapi.com/${url}`;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const imageSrc = getImageUrl(movie.poster_url || movie.thumb_url);

  return (
    <Link href={`/phim/${movie.slug}`}>
      <div className="group cursor-pointer overflow-hidden rounded-lg bg-card hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={movie.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="text-primary-foreground text-lg font-semibold">Xem phim</span>
          </div>

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {movie.quality && (
              <Badge variant="secondary" className="text-xs bg-primary/80">
                {movie.quality}
              </Badge>
            )}
            {movie.lang && (
              <Badge variant="outline" className="text-xs">
                {movie.lang}
              </Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-3 flex flex-col">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition">
            {movie.name}
          </h3>
          {movie.origin_name && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
              {movie.origin_name}
            </p>
          )}
          {movie.year && (
            <p className="text-xs text-muted-foreground mt-auto pt-2">
              {movie.year}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
