"use client";

import { cn } from "@/lib/utils";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import Artplayer from "artplayer";

type Props = { movie: any } & ComponentProps<"div">;
export default function MoviePlayer({ className, movie, ...props }: Props) {
  const $playerRef = useRef<HTMLDivElement>(null);
  const [currentMovie, setCurrentMovie] = useState<any>(undefined);

  useEffect(() => {
    if (movie?.item?.episodes?.length) {
      const firstEp = movie?.item?.episodes?.[0]?.server_data?.[0];
      if (firstEp) setCurrentMovie(firstEp);
    }
  }, [movie]);
  useEffect(() => {
    if ($playerRef.current === null || !currentMovie) return;
    const art = new Artplayer({
      id: currentMovie?.slug,
      container: $playerRef.current,
      url: currentMovie?.link_m3u8,
      autoPlayback: true,
      pip: true,
      fullscreen: true,
      fullscreenWeb: true,
      lock: true,
      type: "m3u8",
      gesture: true,
      autoOrientation: true,
      airplay: true,
      theme: "#f0b000",
      lang: "en", // or 'en'
      controls: [
        {
          name: "backward",
          position: "right",
          html: `<svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M11 18V6l-8.5 6L11 18zm1-6l8.5 6V6L12 12z"/></svg>`,
          click: () => {
            art.currentTime = Math.max(0, art.currentTime - 30);
          },
        },
        {
          name: "forward",
          position: "right",
          html: `<svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M13 6v12l8.5-6L13 6zm-1 6L3.5 6v12L12 12z"/></svg>`,
          click: () => {
            art.currentTime = Math.min(art.duration, art.currentTime + 30);
          },
        },
      ],
    });
    return () => art.destroy(false);
  }, [currentMovie]);

  return (
    <div className={cn(className)} {...props}>
      {currentMovie?.link_m3u8 ? (
        <div
          ref={$playerRef}
          className="w-full aspect-video mb-6 rounded-xl overflow-hidden"
        ></div>
      ) : null}

      <Tabs defaultValue="0">
        <TabsList>
          {movie.item.episodes.map((item: any, index: number) => (
            <TabsTrigger key={index} value={String(index)}>
              {item.server_name}
            </TabsTrigger>
          ))}
        </TabsList>
        {movie.item.episodes.map((item: any, index: number) => (
          <TabsContent
            key={index}
            value={String(index)}
            className="flex flex-wrap gap-2 bg-card p-4 rounded-lg"
          >
            {item.server_data.map((ep: any, epIndex: number) => (
              <Button
                key={epIndex}
                variant={currentMovie?.slug === ep.slug ? "default" : "outline"}
                onClick={() => setCurrentMovie(ep)}
              >
                {ep.name}
              </Button>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
