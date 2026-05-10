"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  PlayIcon,
  PauseIcon,
  MaximizeIcon,
  SkipForwardIcon,
  AlertTriangleIcon,
} from "lucide-react";
import type { EpisodeItem, MovieSummary } from "@/lib/types";
import { useWatchHistory } from "@/hooks/use-watch-history";

const RESUME_KEY = (slug: string, server: number, episode: string) =>
  `truonglx:progress:${slug}:${server}:${episode}`;

type PlaybackMode = "hls" | "embed" | "unavailable";

interface MoviePlayerProps {
  episode: EpisodeItem;
  movie: MovieSummary;
  movieSlug: string;
  serverIndex: number;
  episodeIndex: number;
  nextEpisodeHref?: string;
  posterUrl?: string;
}

export function MoviePlayer({
  episode,
  movie,
  movieSlug,
  serverIndex,
  episodeIndex,
  nextEpisodeHref,
  posterUrl,
}: MoviePlayerProps) {
  const router = useRouter();
  const { addToHistory } = useWatchHistory();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const historySavedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<PlaybackMode>(() => {
    if (episode.linkM3u8) return "hls";
    if (episode.linkEmbed) return "embed";
    return "unavailable";
  });

  const resumeKey = RESUME_KEY(movieSlug, serverIndex, episode.slug);

  // ── resume playback ────────────────────────────────────────────────────
  function onLoadedMetadata() {
    const video = videoRef.current;
    if (!video) return;
    try {
      const saved = Number(localStorage.getItem(resumeKey));
      if (saved > 10 && saved < video.duration - 20) {
        video.currentTime = saved;
      }
    } catch {}
  }

  // ── save progress ──────────────────────────────────────────────────────
  const saveProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.paused) return;
    try {
      localStorage.setItem(resumeKey, String(Math.floor(video.currentTime)));
    } catch {}

    // Save to watch history after 30s
    if (!historySavedRef.current && video.currentTime > 30) {
      historySavedRef.current = true;
      addToHistory({
        movie,
        serverIndex,
        episodeIndex,
        episodeName: episode.name,
        watchedAt: Date.now(),
      });
    }
  }, [resumeKey, movie, serverIndex, episodeIndex, episode.name, addToHistory]);

  // ── HLS fallback detection ────────────────────────────────────────────
  function onVideoError() {
    if (mode === "hls") {
      if (episode.linkEmbed) {
        setMode("embed");
      } else {
        setMode("unavailable");
      }
    }
  }

  // ── episode end ────────────────────────────────────────────────────────
  function onEnded() {
    try {
      localStorage.removeItem(resumeKey);
    } catch {}
    if (nextEpisodeHref) router.push(nextEpisodeHref);
  }

  // ── play state sync ────────────────────────────────────────────────────
  function syncPlay() {
    setPlaying(!videoRef.current?.paused);
  }

  // ── keyboard shortcuts ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const video = videoRef.current;
      if (!video) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (video.paused) { video.play(); } else { video.pause(); }
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 10);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
      } else if (e.code === "KeyF") {
        e.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          containerRef.current?.requestFullscreen?.();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── save interval ──────────────────────────────────────────────────────
  useEffect(() => {
    historySavedRef.current = false;
    saveTimerRef.current = setInterval(saveProgress, 5000);
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, [saveProgress]);

  // ── fallback timeout for HLS ───────────────────────────────────────────
  useEffect(() => {
    if (mode !== "hls") return;
    const timer = setTimeout(() => {
      const video = videoRef.current;
      if (video && video.readyState === 0) {
        if (episode.linkEmbed) setMode("embed");
        else setMode("unavailable");
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [mode, episode.linkEmbed]);

  // ── controls ──────────────────────────────────────────────────────────
  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); } else { v.pause(); }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current?.requestFullscreen?.();
    }
  }

  return (
    <div ref={containerRef} className="w-full rounded-xl overflow-hidden" style={{ background: "#000" }}>
      {/* Player area */}
      {mode === "hls" && episode.linkM3u8 ? (
        <video
          ref={videoRef}
          src={episode.linkM3u8}
          poster={posterUrl}
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full"
          style={{ background: "#000" }}
          onLoadedMetadata={onLoadedMetadata}
          onError={onVideoError}
          onPlay={syncPlay}
          onPause={syncPlay}
          onEnded={onEnded}
        />
      ) : mode === "embed" && episode.linkEmbed ? (
        <iframe
          src={episode.linkEmbed}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full border-0"
          style={{ background: "#000" }}
        />
      ) : (
        <div
          className="aspect-video w-full flex flex-col items-center justify-center gap-3"
          style={{ background: "#1c1c1e" }}
        >
          <AlertTriangleIcon className="size-10 opacity-40" />
          <p className="text-sm" style={{ color: "#8e8e93" }}>
            Không thể phát tập phim này. Thử chọn server khác.
          </p>
        </div>
      )}

      {/* Custom controls bar (only for native HLS video) */}
      {mode === "hls" && (
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
            aria-label={playing ? "Tạm dừng" : "Phát"}
          >
            {playing ? (
              <PauseIcon className="size-4 text-white" />
            ) : (
              <PlayIcon className="size-4 text-white fill-white" />
            )}
          </button>

          <span className="flex-1 text-xs" style={{ color: "#8e8e93" }}>
            {episode.name
              ? episode.name.startsWith("Tập")
                ? episode.name
                : `Tập ${episode.name}`
              : ""}
          </span>

          {/* Speed selector */}
          <select
            className="rounded-md px-2 py-1 text-xs outline-none"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            defaultValue="1"
            onChange={(e) => {
              if (videoRef.current) videoRef.current.playbackRate = Number(e.target.value);
            }}
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>

          {nextEpisodeHref && (
            <button
              onClick={() => router.push(nextEpisodeHref)}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <SkipForwardIcon className="size-3.5" />
              Tập kế
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
            aria-label="Toàn màn hình"
          >
            <MaximizeIcon className="size-4 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
