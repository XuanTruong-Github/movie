"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import type { MovieItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  movie: MovieItem;
  className?: string;
}

export function FavoriteButton({ movie, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(movie._id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(movie);
      }}
      aria-label={active ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
      className={cn(
        "rounded-full p-2 transition-all duration-200",
        active
          ? "text-[#e8d5b7] bg-[#e8d5b7]/15 hover:bg-[#e8d5b7]/25"
          : "text-white/60 bg-black/40 hover:text-white hover:bg-black/60",
        className
      )}
    >
      <Heart
        className="w-4 h-4"
        fill={active ? "currentColor" : "none"}
        strokeWidth={2}
      />
    </button>
  );
}
