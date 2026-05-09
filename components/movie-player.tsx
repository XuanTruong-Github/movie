"use client";

import "@videojs/react/video/skin.css";

import { MaximizeIcon, PlayCircleIcon, SkipForwardIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPlayer } from "@videojs/react";
import { Video, VideoSkinTailwind, videoFeatures } from "@videojs/react/video";

import { Button } from "@/components/ui/button";
import type { EpisodeItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const Player = createPlayer({
  features: videoFeatures,
  displayName: "KKMoviePlayer",
});

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2];
const noopSubscribe = () => () => {};
type PlaybackMode = "hls" | "embed" | "unavailable";

function progressKey(movieSlug: string, serverIndex: number, episodeSlug: string) {
  return `kkcinema:progress:${movieSlug}:${serverIndex}:${episodeSlug}`;
}

function browserSupportsHls() {
  if (typeof document === "undefined") return false;
  const video = document.createElement("video");
  return Boolean(video.canPlayType("application/vnd.apple.mpegurl") || video.canPlayType("application/x-mpegURL"));
}

function useBrowserHlsSupport() {
  return useSyncExternalStore(noopSubscribe, browserSupportsHls, () => false);
}

export function MoviePlayer({
  movieSlug,
  title,
  poster,
  serverIndex,
  episode,
  nextEpisodeHref,
}: {
  movieSlug: string;
  title: string;
  poster?: string;
  serverIndex: number;
  episode: EpisodeItem;
  nextEpisodeHref?: string;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [rate, setRate] = useState(1);
  const [failedHlsSource, setFailedHlsSource] = useState<string | null>(null);
  const canPlayHls = useBrowserHlsSupport();
  const storageKey = useMemo(() => progressKey(movieSlug, serverIndex, episode.slug || episode.name), [episode.name, episode.slug, movieSlug, serverIndex]);
  const hlsSourceKey = `${episode.linkM3u8 ?? ""}|${episode.linkEmbed ?? ""}`;
  const hlsFailed = failedHlsSource === hlsSourceKey;
  const playbackMode: PlaybackMode = episode.linkM3u8 && canPlayHls && !hlsFailed ? "hls" : episode.linkEmbed ? "embed" : "unavailable";

  useEffect(() => {
    if (playbackMode !== "hls") return;
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
  }, [playbackMode, rate]);

  useEffect(() => {
    if (playbackMode !== "hls") return;
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      const saved = window.localStorage.getItem(storageKey);
      const resumeAt = saved ? Number.parseFloat(saved) : null;
      if (resumeAt && resumeAt < video.duration - 20) video.currentTime = resumeAt;
      video.playbackRate = rate;
    };
    const onTimeUpdate = () => {
      if (video.currentTime > 10 && Number.isFinite(video.currentTime)) {
        window.localStorage.setItem(storageKey, String(Math.floor(video.currentTime)));
      }
    };
    const onEnded = () => {
      window.localStorage.removeItem(storageKey);
      if (nextEpisodeHref) router.push(nextEpisodeHref);
    };
    const onError = () => {
      setFailedHlsSource(hlsSourceKey);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);

    const errorCheck = window.setTimeout(() => {
      if (video.readyState === 0 && video.error) setFailedHlsSource(hlsSourceKey);
    }, 1500);

    return () => {
      window.clearTimeout(errorCheck);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
    };
  }, [hlsSourceKey, nextEpisodeHref, playbackMode, rate, router, storageKey]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) return;
      const video = videoRef.current;

      if (event.code === "Space") {
        if (!video) return;
        event.preventDefault();
        if (video.paused) void video.play();
        else video.pause();
      }
      if (event.key === "ArrowLeft") {
        if (!video) return;
        event.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 10);
      }
      if (event.key === "ArrowRight") {
        if (!video) return;
        event.preventDefault();
        video.currentTime = Math.min(video.duration || video.currentTime + 10, video.currentTime + 10);
      }
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        void frameRef.current?.requestFullscreen?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (playbackMode === "embed" && episode.linkEmbed) {
    return (
      <div className="flex flex-col gap-3">
        <div ref={frameRef} className="overflow-hidden rounded-lg border border-border bg-black">
          <iframe
            src={episode.linkEmbed}
            title={title}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full"
          />
        </div>
        {hlsFailed ? (
          <p className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
            Nguồn HLS không phát được, đang dùng nguồn embed dự phòng.
          </p>
        ) : null}
        {!canPlayHls && episode.linkM3u8 ? (
          <p className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
            Trình duyệt hiện tại không hỗ trợ HLS native, nên player đang dùng nguồn embed dự phòng.
          </p>
        ) : null}
      </div>
    );
  }

  if (playbackMode === "unavailable") {
    return (
      <div className="grid aspect-video place-items-center rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
        {hlsFailed ? "Nguồn phát của tập này hiện không khả dụng." : "Tập này chưa có link phát khả dụng."}
      </div>
    );
  }

  return (
    <div ref={frameRef} className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-lg border border-border bg-black">
        <Player.Provider>
          <VideoSkinTailwind poster={poster} className="aspect-video w-full bg-black">
            <Video
              ref={videoRef}
              className="size-full"
              src={episode.linkM3u8}
              playsInline
              controls
              preload="metadata"
              crossOrigin="anonymous"
              onError={() => setFailedHlsSource(hlsSourceKey)}
            >
              <source src={episode.linkM3u8} type="application/x-mpegURL" />
            </Video>
          </VideoSkinTailwind>
        </Player.Provider>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => (videoRef.current?.paused ? void videoRef.current.play() : videoRef.current?.pause())}>
            <PlayCircleIcon data-icon="inline-start" />
            Phát / Tạm dừng
          </Button>
          <Button variant="outline" size="sm" onClick={() => frameRef.current?.requestFullscreen?.()}>
            <MaximizeIcon data-icon="inline-start" />
            Toàn màn hình
          </Button>
          {nextEpisodeHref ? (
            <Button variant="outline" size="sm" onClick={() => router.push(nextEpisodeHref)}>
              <SkipForwardIcon data-icon="inline-start" />
              Tập kế
            </Button>
          ) : null}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Tốc độ
          <select
            className={cn("h-9 rounded-md border border-input bg-background px-2 text-foreground")}
            value={rate}
            onChange={(event) => setRate(Number(event.target.value))}
          >
            {PLAYBACK_RATES.map((item) => (
              <option key={item} value={item}>
                {item}x
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
