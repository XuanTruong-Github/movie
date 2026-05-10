"use client";

import { useCallback, useEffect, useState } from "react";
import type { MovieItem } from "@/lib/types";

const STORAGE_KEY = "cine_favorites";
const MAX_ITEMS = 200;

function readStorage(): MovieItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MovieItem[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: MovieItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("favorites-updated"));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<MovieItem[]>([]);

  useEffect(() => {
    setFavorites(readStorage());

    const handler = () => setFavorites(readStorage());
    window.addEventListener("favorites-updated", handler);
    return () => window.removeEventListener("favorites-updated", handler);
  }, []);

  const isFavorite = useCallback(
    (movieId: string) => favorites.some((m) => m._id === movieId),
    [favorites]
  );

  const addFavorite = useCallback((movie: MovieItem) => {
    const current = readStorage();
    if (current.some((m) => m._id === movie._id)) return;
    const updated = [movie, ...current].slice(0, MAX_ITEMS);
    writeStorage(updated);
    setFavorites(updated);
  }, []);

  const removeFavorite = useCallback((movieId: string) => {
    const updated = readStorage().filter((m) => m._id !== movieId);
    writeStorage(updated);
    setFavorites(updated);
  }, []);

  const toggleFavorite = useCallback(
    (movie: MovieItem) => {
      if (isFavorite(movie._id)) removeFavorite(movie._id);
      else addFavorite(movie);
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite };
}
