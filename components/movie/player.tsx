"use client";

import { createPlayer, videoFeatures } from "@videojs/react";
import { Video, VideoSkin } from "@videojs/react/video";
import { cn } from "@/lib/utils";
import {
  MovieDetailResponse,
  MovieEpisode,
  MovieEpisodeServer,
} from "@/lib/types";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";

const VJSPlayer = createPlayer({ features: videoFeatures });

type Props = { movie: MovieDetailResponse } & ComponentProps<"div">;
type PlaybackProgress = {
  episodeSlug: string;
  time: number;
};

const SAVE_INTERVAL_SECONDS = 5;

function getFirstEpisode(movie: MovieDetailResponse): MovieEpisode | null {
  return movie.item.episodes[0]?.server_data[0] ?? null;
}

function getPlaybackStorageKey() {
  return `movie-playback:${window.location.pathname}`;
}

function readPlaybackProgress(): PlaybackProgress | null {
  try {
    const raw = window.localStorage.getItem(getPlaybackStorageKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlaybackProgress;
    if (!parsed.episodeSlug || typeof parsed.time !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writePlaybackProgress(progress: PlaybackProgress) {
  try {
    window.localStorage.setItem(
      getPlaybackStorageKey(),
      JSON.stringify(progress),
    );
  } catch {
    // Ignore localStorage failures silently.
  }
}

// Inner component: restore position + throttled save — must be inside VJSPlayer.Provider
function PlaybackManager({ currentMovie }: { currentMovie: MovieEpisode }) {
  const store = VJSPlayer.usePlayer();
  const { currentTime, paused, ended, duration } = VJSPlayer.usePlayer(
    (s) => ({
      currentTime: s.currentTime,
      paused: s.paused,
      ended: s.ended,
      duration: s.duration,
    }),
  );
  const lastSavedRef = useRef(0);
  const restoredRef = useRef(false);

  // Restore position when duration becomes available (metadata loaded)
  useEffect(() => {
    if (!duration || restoredRef.current) return;
    const saved = readPlaybackProgress();
    if (saved?.episodeSlug !== currentMovie.slug || saved.time <= 0) {
      restoredRef.current = true;
      return;
    }
    const safeTime = Math.min(saved.time, Math.max(0, duration - 2));
    store.seek(Math.max(0, safeTime));
    restoredRef.current = true;
    lastSavedRef.current = safeTime;
  }, [duration, currentMovie.slug, store]);

  // Throttled save every SAVE_INTERVAL_SECONDS (timeupdate)
  useEffect(() => {
    if (isNaN(currentTime)) return;
    if (Math.abs(currentTime - lastSavedRef.current) < SAVE_INTERVAL_SECONDS) return;
    lastSavedRef.current = currentTime;
    writePlaybackProgress({ episodeSlug: currentMovie.slug, time: currentTime });
  }, [currentTime, currentMovie.slug]);

  // Save on pause
  useEffect(() => {
    if (!paused) return;
    writePlaybackProgress({ episodeSlug: currentMovie.slug, time: currentTime });
  }, [paused, currentTime, currentMovie.slug]);

  // Reset progress on ended
  useEffect(() => {
    if (!ended) return;
    lastSavedRef.current = 0;
    writePlaybackProgress({ episodeSlug: currentMovie.slug, time: 0 });
  }, [ended, currentMovie.slug]);

  return null;
}

// Inner component: seek buttons — must be inside VJSPlayer.Provider
function SeekButtons() {
  const store = VJSPlayer.usePlayer();
  const currentTime = VJSPlayer.usePlayer((s) => s.currentTime);

  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => store.seek(Math.max(0, currentTime - 10))}
      >
        -10s
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => store.seek(currentTime + 10)}
      >
        +10s
      </Button>
    </div>
  );
}

export default function MoviePlayer({ className, movie, ...props }: Props) {
  const [currentMovie, setCurrentMovie] = useState<MovieEpisode | null>(() =>
    getFirstEpisode(movie),
  );
  const [isIPhone] = useState(
    () =>
      typeof navigator !== "undefined" &&
      /iPhone/i.test(navigator.userAgent || navigator.vendor),
  );

  // Restore last-watched episode from localStorage on mount
  useEffect(() => {
    const savedProgress = readPlaybackProgress();
    if (!savedProgress) return;

    const savedEpisode =
      movie.item.episodes
        .flatMap((item) => item.server_data)
        .find((episode) => episode.slug === savedProgress.episodeSlug) ?? null;

    if (!savedEpisode || savedEpisode.slug === currentMovie?.slug) return;

    const frameId = window.requestAnimationFrame(() => {
      setCurrentMovie(savedEpisode);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [currentMovie?.slug, movie.item.episodes]);

  function onChangeEpisode(value: string) {
    const firstEp = movie?.item?.episodes?.[Number(value)]?.server_data?.[0];
    if (firstEp) {
      writePlaybackProgress({ episodeSlug: firstEp.slug, time: 0 });
      setCurrentMovie(firstEp);
    }
  }

  function onSelectEpisode(episode: MovieEpisode) {
    writePlaybackProgress({ episodeSlug: episode.slug, time: 0 });
    setCurrentMovie(episode);
  }

  return (
    <div className={cn(className)} {...props}>
      {currentMovie?.link_m3u8 ? (
        <div className="mb-4">
          <div className="border bg-black rounded-lg overflow-hidden aspect-video mb-2">
            {/* key forces Provider remount on episode change, cleanly resetting player state */}
            <VJSPlayer.Provider key={currentMovie.link_m3u8}>
              <VideoSkin className="h-full w-full">
                <Video src={currentMovie.link_m3u8} playsInline />
              </VideoSkin>
              <PlaybackManager currentMovie={currentMovie} />
              {!isIPhone && <SeekButtons />}
            </VJSPlayer.Provider>
          </div>
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
                onClick={() => onSelectEpisode(ep)}
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
