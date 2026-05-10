"use client";

import { useEffect, useState, useCallback } from "react";
import type { HistoryEntry } from "@/lib/types";

const KEY = "truonglx:history";
const MAX_ENTRIES = 50;

function read(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function write(items: HistoryEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export function useWatchHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(read());
  }, []);

  const addToHistory = useCallback((entry: HistoryEntry) => {
    setHistory((prev) => {
      // Remove existing entry for same movie slug, then prepend new
      const filtered = prev.filter((e) => e.movie.slug !== entry.movie.slug);
      const next = [entry, ...filtered].slice(0, MAX_ENTRIES);
      write(next);
      return next;
    });
  }, []);

  const removeFromHistory = useCallback((slug: string) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.movie.slug !== slug);
      write(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    write([]);
    setHistory([]);
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
}
