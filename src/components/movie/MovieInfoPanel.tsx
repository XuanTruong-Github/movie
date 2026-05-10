import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { MovieDetail } from "@/lib/types";

interface MovieInfoPanelProps {
  movie: MovieDetail;
  compact?: boolean;
}

export function MovieInfoPanel({ movie, compact = false }: MovieInfoPanelProps) {
  return (
    <div className="space-y-5">
      {!compact && movie.content && (
        <div>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-2">
            Nội dung
          </h3>
          <div
            className="text-white/70 text-sm leading-relaxed line-clamp-3"
            dangerouslySetInnerHTML={{ __html: movie.content }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        {movie.quality && (
          <span className="inline-flex items-center gap-1.5">
            <span className="text-white/30 text-xs uppercase tracking-wide">Chất lượng</span>
            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
              {movie.quality}
            </Badge>
          </span>
        )}
        {movie.lang && (
          <span className="inline-flex items-center gap-1.5">
            <span className="text-white/30 text-xs uppercase tracking-wide">Ngôn ngữ</span>
            <Badge variant="secondary" className="text-xs bg-[#252525] text-white/70 border-white/10">
              {movie.lang}
            </Badge>
          </span>
        )}
        {movie.status && (
          <span className="inline-flex items-center gap-1.5">
            <span className="text-white/30 text-xs uppercase tracking-wide">Trạng thái</span>
            <Badge
              variant="secondary"
              className={`text-xs border ${
                movie.status === "completed"
                  ? "bg-green-500/15 text-green-400 border-green-500/30"
                  : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
              }`}
            >
              {movie.status === "completed" ? "Hoàn tất" : "Đang chiếu"}
            </Badge>
          </span>
        )}
      </div>

      {movie.episode_current && (
        <div>
          <span className="text-white/30 text-xs uppercase tracking-wide">Tập phim: </span>
          <span className="text-white/70 text-sm">{movie.episode_current}</span>
          {movie.episode_total && (
            <span className="text-white/30 text-sm"> / {movie.episode_total}</span>
          )}
        </div>
      )}

      {movie.category && movie.category.length > 0 && (
        <div>
          <span className="text-white/30 text-xs uppercase tracking-wide block mb-2">
            Thể loại
          </span>
          <div className="flex flex-wrap gap-1.5">
            {movie.category.map((c) => (
              <Link key={c.slug} href={`/the-loai/${c.slug}`}>
                <Badge
                  variant="outline"
                  className="text-xs text-white/60 border-white/15 hover:border-[#e8d5b7]/50 hover:text-[#e8d5b7] transition-colors cursor-pointer"
                >
                  {c.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {movie.country && movie.country.length > 0 && (
        <div>
          <span className="text-white/30 text-xs uppercase tracking-wide block mb-2">
            Quốc gia
          </span>
          <div className="flex flex-wrap gap-1.5">
            {movie.country.map((c) => (
              <Link key={c.slug} href={`/quoc-gia/${c.slug}`}>
                <Badge
                  variant="outline"
                  className="text-xs text-white/60 border-white/15 hover:border-[#e8d5b7]/50 hover:text-[#e8d5b7] transition-colors cursor-pointer"
                >
                  {c.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!compact && movie.actor && movie.actor.length > 0 && (
        <div>
          <span className="text-white/30 text-xs uppercase tracking-wide block mb-1">
            Diễn viên
          </span>
          <p className="text-white/60 text-sm line-clamp-2">
            {movie.actor.join(", ")}
          </p>
        </div>
      )}

      {!compact && movie.director && movie.director.length > 0 && (
        <div>
          <span className="text-white/30 text-xs uppercase tracking-wide block mb-1">
            Đạo diễn
          </span>
          <p className="text-white/60 text-sm">{movie.director.join(", ")}</p>
        </div>
      )}

      {movie.time && (
        <div>
          <span className="text-white/30 text-xs uppercase tracking-wide">Thời lượng: </span>
          <span className="text-white/60 text-sm">{movie.time}</span>
        </div>
      )}
    </div>
  );
}
