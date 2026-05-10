"use client";

import { useEffect, useState, useCallback } from "react";
import type { MovieSummary } from "@/lib/types";

const KEY = "truonglx:favorites";

function read(): MovieSummary[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MovieSummary[]) : [];
  } catch {
    return [];
  }
}

function write(items: MovieSummary[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<MovieSummary[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(read());

    const handler = (e: StorageEvent) => {
      if (e.key === KEY) setFavorites(read());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addFavorite = useCallback((movie: MovieSummary) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.slug === movie.slug)) return prev;
      const next = [movie, ...prev];
      write(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.filter((m) => m.slug !== slug);
      write(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (slug: string) => favorites.some((m) => m.slug === slug),
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    write([]);
    setFavorites([]);
  }, []);

  return { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites };
}
