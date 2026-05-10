"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(!compact);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const keyword = inputRef.current?.value.trim();
    if (keyword) router.push(`/tim-kiem?keyword=${encodeURIComponent(keyword)}`);
  }

  if (compact) {
    return (
      <div className="ml-auto flex items-center">
        {open ? (
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              ref={inputRef}
              autoFocus
              placeholder="Tìm phim..."
              onBlur={() => setOpen(false)}
              className={cn(
                "w-44 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white placeholder:text-white/40",
                "outline-none ring-1 ring-white/20 focus:ring-white/50 transition-all"
              )}
            />
          </form>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Tìm kiếm"
          >
            <SearchIcon className="size-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
        <input
          ref={inputRef}
          name="keyword"
          placeholder="Tìm phim, diễn viên..."
          className={cn(
            "w-full max-w-md rounded-full pl-10 pr-4 py-2.5 text-sm",
            "bg-white/10 text-white placeholder:text-white/40",
            "outline-none ring-1 ring-white/20 focus:ring-white/50 transition-all"
          )}
        />
      </div>
    </form>
  );
}
