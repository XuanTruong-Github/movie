interface EmbedPlayerProps {
  url: string;
  title?: string;
}

export function EmbedPlayer({ url, title }: EmbedPlayerProps) {
  return (
    <div className="w-full" style={{ aspectRatio: "16/9" }}>
      <iframe
        src={url}
        title={title ?? "Video player"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full rounded-xl bg-black"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
      />
    </div>
  );
}
