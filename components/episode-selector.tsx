import Link from "next/link";
import type { EpisodeServer } from "@/lib/types";

export function EpisodeSelector({
  episodes,
  movieSlug,
  activeServerIndex,
  activeEpisodeIndex,
}: {
  episodes: EpisodeServer[];
  movieSlug: string;
  activeServerIndex: number;
  activeEpisodeIndex: number;
}) {
  if (!episodes.length) return null;

  return (
    <div
      className="rounded-xl p-4 space-y-5"
      style={{ background: "#1c1c1e" }}
    >
      <h2 className="text-base font-semibold text-white">Danh sách tập</h2>

      {episodes.map((server, serverIndex) => (
        <div key={`${server.serverName}-${serverIndex}`} className="space-y-2">
          <p className="text-xs font-medium" style={{ color: "#8e8e93" }}>
            {server.serverName}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {server.serverData.map((episode, episodeIndex) => {
              const isActive =
                serverIndex === activeServerIndex && episodeIndex === activeEpisodeIndex;
              return (
                <Link
                  key={`${episode.slug}-${episodeIndex}`}
                  href={`/xem/${movieSlug}?server=${serverIndex}&episode=${episodeIndex}`}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150"
                  style={
                    isActive
                      ? { background: "#fff", color: "#000" }
                      : {
                          background: "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.8)",
                        }
                  }
                >
                  {episode.name}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
