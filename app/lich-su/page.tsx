"use client";

import Image from "next/image";
import Link from "next/link";
import { TrashIcon, XIcon, PlayIcon } from "lucide-react";
import { useWatchHistory } from "@/hooks/use-watch-history";
import { Empty } from "@/components/ui/empty";
import { timeAgo } from "@/lib/utils";

export default function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useWatchHistory();

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Lịch sử xem</h1>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
            style={{ color: "#8e8e93" }}
          >
            <TrashIcon className="size-4" />
            Xóa lịch sử
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <Empty
          title="Chưa có lịch sử xem"
          description="Những phim bạn đã xem sẽ xuất hiện ở đây."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-4">
          {history.map((entry) => {
            const poster = entry.movie.posterUrl ?? entry.movie.thumbUrl;
            const watchHref = `/xem/${entry.movie.slug}?server=${entry.serverIndex}&episode=${entry.episodeIndex}`;

            return (
              <div key={entry.movie.slug} className="group relative">
                <Link href={watchHref} className="block">
                  <div
                    className="relative aspect-[2/3] overflow-hidden rounded-xl"
                    style={{ background: "#1c1c1e" }}
                  >
                    {poster && (
                      <Image
                        src={poster}
                        alt={entry.movie.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-110"
                      />
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div
                        className="rounded-full p-3"
                        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
                      >
                        <PlayIcon className="size-6 text-white fill-white" />
                      </div>
                    </div>

                    {/* Episode badge */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-2">
                      <span
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        Tập {entry.episodeName}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Remove button */}
                <button
                  onClick={() => removeFromHistory(entry.movie.slug)}
                  className="absolute right-2 top-2 z-10 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
                  aria-label="Xóa khỏi lịch sử"
                >
                  <XIcon className="size-3 text-white" />
                </button>

                <div className="mt-2 space-y-0.5 px-0.5">
                  <Link href={`/phim/${entry.movie.slug}`}>
                    <p className="text-sm font-medium text-white line-clamp-2 leading-snug hover:opacity-70 transition-opacity">
                      {entry.movie.name}
                    </p>
                  </Link>
                  <p className="text-xs" style={{ color: "#8e8e93" }}>
                    {timeAgo(entry.watchedAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
