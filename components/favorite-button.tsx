"use client";

import { HeartIcon } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import type { MovieSummary } from "@/lib/types";

export function FavoriteButton({ movie }: { movie: MovieSummary }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const fav = isFavorite(movie.slug);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (fav) {
      removeFavorite(movie.slug);
    } else {
      addFavorite(movie);
    }
  }

  return (
    <button
      onClick={toggle}
      className="absolute right-2 top-2 z-10 rounded-full p-1.5 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
      style={{
        background: fav ? "rgba(255,69,58,0.9)" : "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
      }}
      aria-label={fav ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
    >
      <HeartIcon
        className="size-3.5"
        style={{
          color: fav ? "#fff" : "rgba(255,255,255,0.8)",
          fill: fav ? "#fff" : "none",
        }}
      />
    </button>
  );
}
