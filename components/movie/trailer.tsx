"use client";
import { MovieDetail } from "@/lib/types";
import { ComponentProps } from "react";
import ReactPlayer from "react-player";

type Props = { movie: MovieDetail } & ComponentProps<"div">;

export default function Trailer({ movie, ...props }: Props) {
  if (!movie.trailer_url)
    return <p className="py-10 text-center">Trailer không khả dụng</p>;

  return (
    <div
      {...props}
      className="w-full aspect-video mb-6 rounded-xl overflow-hidden"
    >
      <ReactPlayer
        src={movie.trailer_url}
        controls
        playsInline
        height="auto"
        width="100%"
        style={{ aspectRatio: 16 / 9, marginBottom: 16 }}
      />
    </div>
  );
}
