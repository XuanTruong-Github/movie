export type OpenGraphTypeValue =
  | "article"
  | "website"
  | "book"
  | "profile"
  | "music.song"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "video.movie"
  | "video.episode"
  | "video.tv_show"
  | "video.other";

const OPEN_GRAPH_TYPES = new Set<OpenGraphTypeValue>([
  "article",
  "website",
  "book",
  "profile",
  "music.song",
  "music.album",
  "music.playlist",
  "music.radio_station",
  "video.movie",
  "video.episode",
  "video.tv_show",
  "video.other",
]);

export function toOpenGraphType(value?: string): OpenGraphTypeValue | undefined {
  if (!value || !OPEN_GRAPH_TYPES.has(value as OpenGraphTypeValue)) {
    return undefined;
  }

  return value as OpenGraphTypeValue;
}
