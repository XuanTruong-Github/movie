"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EpisodeServer, EpisodeItem, MovieDetail } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type PlayerProps = {
  movie: MovieDetail;
  episodes: EpisodeServer[];
};

export default function Player({ movie, episodes }: PlayerProps) {
  const [currentEp, setCurrentEp] = useState<EpisodeItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set default episode
    if (episodes.length > 0 && episodes[0].server_data.length > 0) {
      setCurrentEp(episodes[0].server_data[0]);
    }
  }, [episodes]);

  if (!mounted) {
    return (
      <div className="aspect-video bg-card rounded-lg flex items-center justify-center">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="space-y-4">
        {currentEp && currentEp.link_m3u8 ? (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              key={currentEp.link_m3u8}
              className="w-full h-full"
              controls
              autoPlay
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
            >
              <source src={currentEp.link_m3u8} type="application/x-mpegURL" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="aspect-video bg-card rounded-lg flex items-center justify-center">
            {currentEp && currentEp.link_embed ? (
              <div className="w-full h-full">
                <iframe
                  src={currentEp.link_embed}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video Player"
                />
              </div>
            ) : (
              <p className="text-muted-foreground">Không có link phim</p>
            )}
          </div>
        )}

        {currentEp && (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {currentEp.name}
                {episodes.find((s) => s.server_data.includes(currentEp)) && (
                  <Badge variant="secondary" className="ml-2">
                    {episodes.find((s) => s.server_data.includes(currentEp))?.server_name}
                  </Badge>
                )}
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* Episodes Tabs */}
      {episodes.length > 0 && (
        <Tabs defaultValue={episodes[0].server_name} className="w-full">
          <TabsList className="grid w-full gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(episodes.length, 4)}, minmax(0, 1fr))` }}>
            {episodes.map((server) => (
              <TabsTrigger key={server.server_name} value={server.server_name}>
                {server.server_name}
              </TabsTrigger>
            ))}
          </TabsList>

          {episodes.map((server) => (
            <TabsContent key={server.server_name} value={server.server_name}>
              <Card className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {server.server_data.map((episode) => (
                    <Button
                      key={episode.slug}
                      variant={currentEp?.slug === episode.slug ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentEp(episode)}
                      className="w-full"
                    >
                      {episode.name}
                    </Button>
                  ))}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
