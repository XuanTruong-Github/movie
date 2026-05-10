"use client";

import { useCallback, useEffect, useState } from "react";
import type { WatchHistoryEntry } from "@/lib/types";

const STORAGE_KEY = "cine_history";
const MAX_ITEMS = 50;

function readStorage(): WatchHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WatchHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: WatchHistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("history-updated"));
}

export function useWatchHistory() {
  const [history, setHistory] = useState<WatchHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(readStorage());

    const handler = () => setHistory(readStorage());
    window.addEventListener("history-updated", handler);
    return () => window.removeEventListener("history-updated", handler);
  }, []);

  const addToHistory = useCallback(
    (entry: Omit<WatchHistoryEntry, "watchedAt">) => {
      const current = readStorage();
      const filtered = current.filter(
        (e) =>
          !(e.movieSlug === entry.movieSlug && e.episodeSlug === entry.episodeSlug)
      );
      const updated = [
        { ...entry, watchedAt: Date.now() },
        ...filtered,
      ].slice(0, MAX_ITEMS);
      writeStorage(updated);
      setHistory(updated);
    },
    []
  );

  const isWatched = useCallback(
    (movieSlug: string, episodeSlug: string) =>
      history.some(
        (e) => e.movieSlug === movieSlug && e.episodeSlug === episodeSlug
      ),
    [history]
  );

  const clearHistory = useCallback(() => {
    writeStorage([]);
    setHistory([]);
  }, []);

  return { history, addToHistory, isWatched, clearHistory };
}
