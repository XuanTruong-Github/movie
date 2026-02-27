"use client";
import { ComponentProps, useEffect, useRef } from "react";
import Artplayer from "artplayer";

type Props = { movie: any } & ComponentProps<"div">;

export default function Trailer({ movie, ...props }: Props) {
  if (!movie.trailer_url)
    return <p className="py-10 text-center">Trailer không khả dụng</p>;
  const $playerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if ($playerRef.current === null) return;
    const art = new Artplayer({
      id: movie.trailer_url,
      container: $playerRef.current,
      url: movie.trailer_url,
      autoPlayback: true,
      pip: true,
      fullscreen: true,
      fullscreenWeb: true,
      lock: true,
      type: "m3u8",
      gesture: true,
      autoOrientation: true,
      airplay: true,
      theme: "#f0b000",
      lang: "en",
    });
    return () => art.destroy(false);
  }, [movie]);
  return (
    <div
      ref={$playerRef}
      {...props}
      className="w-full aspect-video mb-6 rounded-xl overflow-hidden"
    ></div>
  );
}
