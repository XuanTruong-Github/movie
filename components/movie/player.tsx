"use client";

import { cn } from "@/lib/utils";
import {
  MovieDetailResponse,
  MovieEpisode,
  MovieEpisodeServer,
} from "@/lib/types";
import { ComponentProps, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import ReactPlayer from "react-player";

type Props = { movie: MovieDetailResponse } & ComponentProps<"div">;

function getFirstEpisode(movie: MovieDetailResponse): MovieEpisode | null {
  return movie.item.episodes[0]?.server_data[0] ?? null;
}

export default function MoviePlayer({ className, movie, ...props }: Props) {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [currentMovie, setCurrentMovie] = useState<MovieEpisode | null>(() =>
    getFirstEpisode(movie),
  );
  const [isIPhone] = useState(
    () =>
      typeof navigator !== "undefined" &&
      /iPhone/i.test(navigator.userAgent || navigator.vendor),
  );

  function onChangeEpisode(value: string) {
    const firstEp = movie?.item?.episodes?.[Number(value)]?.server_data?.[0];
    if (firstEp) setCurrentMovie(firstEp);
  }
  function onSeek(seconds: number) {
    if (playerRef.current) {
      playerRef.current.currentTime = Math.max(
        0,
        playerRef.current.currentTime + seconds,
      );
    }
  }
  return (
    <div className={cn(className)} {...props}>
      {currentMovie?.link_m3u8 ? (
        <div className="mb-4">
          <div className="border bg-black rounded-lg overflow-hidden aspect-video mb-2">
            <ReactPlayer
              ref={playerRef}
              key={currentMovie.link_m3u8}
              src={currentMovie.link_m3u8}
              controls
              playsInline
              height="100%"
              width="100%"
            />
          </div>
          {!isIPhone && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => onSeek(-10)}>
                -10s
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onSeek(10)}>
                +10s
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="border bg-black rounded-lg overflow-hidden aspect-video mb-2 flex items-center justify-center">
          Không có link phim
        </div>
      )}

      <Tabs defaultValue="0" onValueChange={onChangeEpisode}>
        <TabsList>
          {movie.item.episodes.map((item: MovieEpisodeServer, index: number) => (
            <TabsTrigger key={index} value={String(index)}>
              {item.server_name}
            </TabsTrigger>
          ))}
        </TabsList>
        {movie.item.episodes.map((item: MovieEpisodeServer, index: number) => (
          <TabsContent
            key={index}
            value={String(index)}
            className="flex flex-wrap gap-2 bg-card p-4 rounded-lg border"
          >
            {item.server_data.map((ep: MovieEpisode, epIndex: number) => (
              <Button
                key={epIndex}
                variant={currentMovie?.slug === ep.slug ? "default" : "outline"}
                onClick={() => setCurrentMovie(ep)}
              >
                Tập {ep.name}
              </Button>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
