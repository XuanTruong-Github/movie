"use client";
import { ComponentProps, useEffect, useRef } from "react";

type Props = { movie: any } & ComponentProps<"div">;

export default function Trailer({ movie, ...props }: Props) {
  if (!movie.trailer_url)
    return <p className="py-10 text-center">Trailer không khả dụng</p>;
  const $playerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if ($playerRef.current === null) return;
    let art: any | undefined;
    let mounted = true;

    async function init() {
      const mod = await import("artplayer");
      const Artplayer = (mod && (mod as any).default) || mod;
      if (!mounted) return;
      art = new Artplayer({
        id: movie.trailer_url,
        container: $playerRef.current as HTMLElement,
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
    }

    init();
    return () => {
      mounted = false;
      try {
        art?.destroy(false);
      } catch (e) {
        /* ignore */
      }
    };
  }, [movie]);
  return (
    <div
      ref={$playerRef}
      {...props}
      className="w-full aspect-video mb-6 rounded-xl overflow-hidden"
    ></div>
  );
}
