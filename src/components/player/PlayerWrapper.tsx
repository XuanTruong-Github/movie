"use client";

import dynamic from "next/dynamic";
import { EmbedPlayer } from "./EmbedPlayer";

const VideoPlayerDynamic = dynamic(
  () => import("./VideoPlayer").then((m) => ({ default: m.VideoPlayer })),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full bg-black/60 rounded-xl animate-pulse"
        style={{ aspectRatio: "16/9" }}
      />
    ),
  }
);

interface PlayerWrapperProps {
  src: string;
  embedUrl: string;
  poster?: string;
  title?: string;
  initialTime?: number;
  onTimeUpdate?: (time: number, duration: number) => void;
  onEnded?: () => void;
}

export function PlayerWrapper({ src, embedUrl, poster, title, initialTime, onTimeUpdate, onEnded }: PlayerWrapperProps) {
  if (!src && embedUrl) {
    return <EmbedPlayer url={embedUrl} title={title} />;
  }

  return (
    <VideoPlayerDynamic
      src={src}
      poster={poster}
      initialTime={initialTime}
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
    />
  );
}
