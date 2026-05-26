"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { usePlaybackPosition } from "@/hooks/usePlaybackPosition";
import { buildImageUrl } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Badge } from "../ui/badge";

export function ContinueWatching() {
  const { history } = useWatchHistory();
  const { getPositionInfo } = usePlaybackPosition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Filter history items that have a playback position saved (i.e. partially watched)
  const activeHistory = history
    .map((item) => {
      const info = getPositionInfo(item.movieSlug, item.episodeSlug);
      return {
        ...item,
        position: info.position,
        duration: info.duration,
      };
    })
    .filter((item) => item.position > 0);

  if (activeHistory.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-10 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-white/90 italic">
          Tiếp tục xem ({history.length})
        </h2>
      </div>
      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent className="-ml-3">
          {activeHistory.map((item) => {
            const progress =
              item.duration > 0 ? (item.position / item.duration) * 100 : 0;
            const linkHref = `/xem/${item.movieSlug}?tap=${item.episodeSlug}`;

            return (
              <CarouselItem
                key={`${item.movieSlug}-${item.episodeSlug}`}
                className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <Link
                  href={linkHref}
                  className="group relative block space-y-2"
                >
                  {/* Thumbnail container */}
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1a1a1a]">
                    <Image
                      src={buildImageUrl(item.thumb_url)}
                      alt={item.movieName}
                      fill
                      className="object-cover transition-all duration-300 group-hover:brightness-75"
                      sizes="(max-width: 640px) 200px, 250px"
                    />

                    {/* Play hover overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-cinema-accent text-black rounded-full p-2 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    {item.episodeName.toLowerCase() !== "full" && (
                      <Badge className="bg-red-600 text-white font-bold text-[10px] absolute top-1 left-1">
                        Tập {item.episodeName}
                      </Badge>
                    )}
                    {/* Progress Bar */}
                    {item.duration > 0 && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                        <div
                          className="h-full bg-red-500 transition-all duration-300"
                          style={{
                            width: `${Math.min(100, Math.max(0, progress))}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Title and Episode Info */}
                  <div className="px-0.5">
                    <p className="text-white/80 text-xs sm:text-sm font-medium line-clamp-1 group-hover:text-cinema-accent transition-colors">
                      {item.movieName}
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
