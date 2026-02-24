import { ComponentProps } from "react";

type Props = { movie: any } & ComponentProps<"div">;

export default function Trailer({ movie, ...props }: Props) {
  if (!movie.trailer_url) return null;
  return (
    <div {...props}>
      {/* <ReactPlayer
        slot="media"
        src={movie.trailer_url}
        controls
        tabIndex={-1}
        playsInline
        key={movie.trailer_url}
        width="100%"
        height="auto"
        style={{ aspectRatio: "16/9", marginBottom: "24px" }}
      /> */}
    </div>
  );
}
