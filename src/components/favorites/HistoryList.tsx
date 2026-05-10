"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { buildImageUrl, formatEpisodeName } from "@/lib/utils";

export function HistoryList() {
  const { history, clearHistory } = useWatchHistory();

  if (!history.length) {
    return (
      <div className="text-center py-16 text-white/30">
        Bạn chưa xem phim nào gần đây.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-white/90 italic">
          Đã xem gần đây
        </h2>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Xóa lịch sử
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {history.map((entry) => (
          <Link
            key={`${entry.movieSlug}-${entry.episodeSlug}`}
            href={`/xem/${entry.movieSlug}?tap=${entry.episodeSlug}`}
            className="group space-y-2"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a1a]">
              <Image
                src={buildImageUrl(entry.thumb_url)}
                alt={entry.movieName}
                fill
                className="object-cover group-hover:scale-105 group-hover:brightness-75 transition-all duration-300"
                sizes="170px"
              />
              <div className="absolute bottom-1.5 right-1.5 bg-black/70 rounded-md px-1.5 py-0.5 text-xs text-white/80">
                {formatEpisodeName(entry.episodeName)}
              </div>
            </div>
            <p className="text-xs text-white/70 line-clamp-2 group-hover:text-white transition-colors">
              {entry.movieName}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
