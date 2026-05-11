"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { cn } from "@/lib/utils";
import type { EpisodeServer } from "@/lib/types";
import { Check } from "lucide-react";

interface EpisodeListProps {
  episodes: EpisodeServer[];
  movieSlug: string;
  currentEpisodeSlug?: string;
}

export function EpisodeList({
  episodes,
  movieSlug,
  currentEpisodeSlug,
}: EpisodeListProps) {
  const router = useRouter();
  const { isWatched } = useWatchHistory();

  if (!episodes?.length) return null;

  const defaultServer = episodes[0]?.server_name;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-semibold text-white/90 italic">
        Danh sách tập
      </h3>
      <Tabs defaultValue={defaultServer}>
        <TabsList className="bg-[#1a1a1a] border border-white/[0.08] h-auto p-1 flex-wrap">
          {episodes.map((server) => (
            <TabsTrigger
              key={server.server_name}
              value={server.server_name}
              className="text-xs data-[state=active]:bg-[#e8d5b7] data-[state=active]:text-[#0d0d0d] data-[state=active]:font-semibold"
            >
              {server.server_name}
            </TabsTrigger>
          ))}
        </TabsList>

        {episodes.map((server) => (
          <TabsContent key={server.server_name} value={server.server_name}>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
              {server.server_data.map((ep, index) => {
                const isActive = ep.slug === currentEpisodeSlug;
                const watched = isWatched(movieSlug, ep.slug);
                return (
                  <button
                    key={index}
                    onClick={() =>
                      router.push(`/xem/${movieSlug}?tap=${ep.slug}`)
                    }
                    className={cn(
                      "relative flex items-center justify-center rounded-lg py-2 px-1 text-xs font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#e8d5b7] text-[#0d0d0d] font-bold"
                        : watched
                        ? "bg-white/8 text-white/40 hover:bg-white/12 hover:text-white/70"
                        : "bg-white/5 text-white/60 hover:bg-white/12 hover:text-white"
                    )}
                  >
                    {ep.name}
                    {watched && !isActive && (
                      <Check className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-white/30" />
                    )}
                  </button>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
