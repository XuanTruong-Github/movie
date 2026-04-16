"use client";

import { cn } from "@/lib/utils";
import {
  MovieDetailResponse,
  MovieEpisode,
  MovieEpisodeServer,
} from "@/lib/types";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import ReactPlayer from "react-player";

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

export default function MoviePlayer({ className, movie, ...props }: Props) {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const lastSavedTimeRef = useRef(0);
  const restoredEpisodeRef = useRef<string | null>(null);
  const [currentMovie, setCurrentMovie] = useState<MovieEpisode | null>(() =>
    getFirstEpisode(movie),
  );
  const [isIPhone] = useState(
    () =>
      typeof navigator !== "undefined" &&
      /iPhone/i.test(navigator.userAgent || navigator.vendor),
  );

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

  function onSeek(seconds: number) {
    if (playerRef.current) {
      playerRef.current.currentTime = Math.max(
        0,
        playerRef.current.currentTime + seconds,
      );
    }
  }

  function onSelectEpisode(episode: MovieEpisode) {
    writePlaybackProgress({ episodeSlug: episode.slug, time: 0 });
    setCurrentMovie(episode);
  }

  function persistPlaybackTime(time: number) {
    if (!currentMovie || Number.isNaN(time)) return;

    if (Math.abs(time - lastSavedTimeRef.current) < SAVE_INTERVAL_SECONDS) return;

    lastSavedTimeRef.current = time;
    writePlaybackProgress({ episodeSlug: currentMovie.slug, time });
  }

  function onLoadedMetadata() {
    if (!playerRef.current || !currentMovie) return;
    if (restoredEpisodeRef.current === currentMovie.slug) return;

    const savedProgress = readPlaybackProgress();
    if (savedProgress?.episodeSlug !== currentMovie.slug || savedProgress.time <= 0) {
      restoredEpisodeRef.current = currentMovie.slug;
      return;
    }

    const duration = Number.isFinite(playerRef.current.duration)
      ? playerRef.current.duration
      : 0;
    const safeTime =
      duration > 0
        ? Math.min(savedProgress.time, Math.max(0, duration - 2))
        : savedProgress.time;

    playerRef.current.currentTime = Math.max(0, safeTime);
    restoredEpisodeRef.current = currentMovie.slug;
    lastSavedTimeRef.current = safeTime;
  }

  function onPause() {
    if (!playerRef.current) return;
    persistPlaybackTime(playerRef.current.currentTime);
  }

  function onEnded() {
    if (!currentMovie) return;

    lastSavedTimeRef.current = 0;
    writePlaybackProgress({ episodeSlug: currentMovie.slug, time: 0 });
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
              onLoadedMetadata={onLoadedMetadata}
              onPause={onPause}
              onEnded={onEnded}
              onTimeUpdate={(event) =>
                persistPlaybackTime(event.currentTarget.currentTime)
              }
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
