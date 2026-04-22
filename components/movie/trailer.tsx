import { cn } from "@/lib/utils";
import { MovieDetail } from "@/lib/types";
import { ComponentProps } from "react";

type Props = { movie: MovieDetail } & ComponentProps<"div">;

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    } else if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com"
    ) {
      videoId = parsed.searchParams.get("v");
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

export default function Trailer({ movie, className, ...props }: Props) {
  if (!movie.trailer_url)
    return (
      <div
        className={cn(
          "aspect-video mb-6 rounded-xl border flex justify-center items-center",
          className,
        )}
        {...props}
      >
        <p>Trailer không khả dụng</p>
      </div>
    );

  const embedUrl = getYouTubeEmbedUrl(movie.trailer_url);

  if (!embedUrl)
    return (
      <div
        className={cn(
          "aspect-video mb-6 rounded-xl border flex justify-center items-center",
          className,
        )}
        {...props}
      >
        <p>Trailer không khả dụng</p>
      </div>
    );

  return (
    <div
      {...props}
      className={cn(
        "w-full aspect-video mb-6 rounded-xl overflow-hidden",
        className,
      )}
    >
      <iframe
        src={embedUrl}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
