"use client";

import { useEffect, useState } from "react";
import { FilmIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

import { movieTypes } from "@/lib/movie-types";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled
          ? "#141414"
          : "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
      }}
    >
      <div className="container flex h-16 items-center gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 select-none">
          <FilmIcon className="size-5 text-primary" />
          <span
            className="text-2xl tracking-widest text-primary leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            TRUONGLX
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {movieTypes.slice(0, 4).map((type) => (
            <Link
              key={type.slug}
              href={`/danh-sach/${type.slug}`}
              className="px-3 py-1 text-sm text-white/80 transition hover:text-white"
            >
              {type.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/tim-kiem"
            className="grid size-9 place-items-center rounded-full text-white/70 transition hover:text-white"
            aria-label="Tìm kiếm"
          >
            <SearchIcon className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
