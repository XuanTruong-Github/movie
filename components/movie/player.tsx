"use client";

import { cn } from "@/lib/utils";
import { ComponentProps, useEffect, useState, ReactEventHandler } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import ReactPlayer from "react-player";

type Props = { movie: any } & ComponentProps<"div">;
export default function MoviePlayer({ className, movie, ...props }: Props) {
  const [currentMovie, setCurrentMovie] = useState<any>(undefined);

  useEffect(() => {
    if (movie.episodes.length) {
      const firstEp = movie.episodes?.[0]?.server_data?.[0];
      if (firstEp) setCurrentMovie(firstEp);
    }
  }, [movie]);

  return (
    <div className={cn(className)} {...props}>
      {currentMovie?.link_m3u8 ? (
        <ReactPlayer
          slot="media"
          src={currentMovie.link_m3u8}
          controls
          tabIndex={-1}
          playsInline
          key={currentMovie.link_m3u8}
          width="100%"
          height="auto"
          style={{ aspectRatio: "16/9", marginBottom: "24px" }}
        />
      ) : null}

      <Tabs defaultValue="0">
        <TabsList>
          {movie.episodes.map((item: any, index: number) => (
            <TabsTrigger key={index} value={String(index)}>
              {item.server_name}
            </TabsTrigger>
          ))}
        </TabsList>
        {movie.episodes.map((item: any, index: number) => (
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
