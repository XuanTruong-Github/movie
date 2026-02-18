"use client";

import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { useMovie } from "@/providers/movie-provider";
import ReactPlayer from "react-player";

type Props = { movie: any } & ComponentProps<"div">;
export default function MoviePlayer({ className, movie, ...props }: Props) {
  const { currentMovie, setCurrentMovie } = useMovie();

  return (
    <div className={cn(className)} {...props}>
      {currentMovie?.link_m3u8 ? (
        <div className="aspect-video w-full mb-4">
          <ReactPlayer
            src={currentMovie.link_m3u8}
            controls
            tabIndex={-1}
            playsInline
            key={currentMovie.link_m3u8}
            width="100%"
            height="100%"
          />
        </div>
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
