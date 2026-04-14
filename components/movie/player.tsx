"use client";

import { cn } from "@/lib/utils";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import ReactPlayer from "react-player";

type Props = { movie: any } & ComponentProps<"div">;
export default function MoviePlayer({ className, movie, ...props }: Props) {
  const [currentMovie, setCurrentMovie] = useState<any>(null);
  function onChangeEpisode(value: string) {
    const firstEp = movie?.item?.episodes?.[Number(value)]?.server_data?.[0];
    if (firstEp) setCurrentMovie(firstEp);
  }
  useEffect(() => {
    if (movie?.item?.episodes?.length) {
      const firstEp = movie?.item?.episodes?.[0]?.server_data?.[0];
      if (firstEp) setCurrentMovie(firstEp);
    }
  }, [movie]);
  const playerRef = useRef<any>(null);

  return (
    <div className={cn(className)} {...props}>
      {currentMovie?.link_m3u8 ? (
        <div className="border bg-black rounded-lg overflow-hidden aspect-video mb-4">
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
      ) : null}

      <Tabs defaultValue="0" onValueChange={onChangeEpisode}>
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
