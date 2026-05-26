"use client";

import { useEffect, useRef } from "react";
import { createPlayer } from "@videojs/react";
import { VideoSkin, videoFeatures } from "@videojs/react/video";
import { HlsVideo } from "@videojs/react/media/hls-video";
import { useMedia } from "@videojs/react";
import type { Video } from "@videojs/core";
import "@videojs/react/video/skin.css";

const { Provider } = createPlayer({ features: videoFeatures });

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  initialTime?: number;
  onTimeUpdate?: (time: number, duration: number) => void;
  onEnded?: () => void;
}

function PositionTracker({ initialTime = 0, onTimeUpdate, onEnded }: {
  initialTime?: number;
  onTimeUpdate?: (time: number, duration: number) => void;
  onEnded?: () => void;
}) {
  const media = useMedia() as Video | null;
  const lastSavedRef = useRef(0);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onEndedRef = useRef(onEnded);

  useEffect(() => { onTimeUpdateRef.current = onTimeUpdate; }, [onTimeUpdate]);
  useEffect(() => { onEndedRef.current = onEnded; }, [onEnded]);

  useEffect(() => {
    if (!media) return;

    const handleLoaded = () => {
      if (initialTime > 0) {
        media.currentTime = initialTime;
      }
    };

    const handleTimeUpdate = () => {
      const now = media.currentTime;
      const duration = media.duration || 0;
      if (now - lastSavedRef.current >= 5) {
        lastSavedRef.current = now;
        onTimeUpdateRef.current?.(now, duration);
      }
    };

    const handleEnded = () => {
      onEndedRef.current?.();
    };

    media.addEventListener("loadedmetadata", handleLoaded);
    media.addEventListener("timeupdate", handleTimeUpdate);
    media.addEventListener("ended", handleEnded);

    return () => {
      media.removeEventListener("loadedmetadata", handleLoaded);
      media.removeEventListener("timeupdate", handleTimeUpdate);
      media.removeEventListener("ended", handleEnded);
    };
  }, [media, initialTime]);

  return null;
}

export function VideoPlayer({ src, poster, className, initialTime, onTimeUpdate, onEnded }: VideoPlayerProps) {
  return (
    <Provider>
      <VideoSkin
        poster={poster}
        className={className}
        style={{ width: "100%", aspectRatio: "16/9", background: "#000" }}
      >
        <HlsVideo src={src} preload="metadata" />
      </VideoSkin>
      <PositionTracker
        initialTime={initialTime}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />
    </Provider>
  );
}
