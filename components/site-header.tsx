"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeartIcon, HistoryIcon } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { movieTypes } from "@/lib/movie-types";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(0,0,0,0.92)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div
        className="mx-auto flex h-16 max-w-screen-2xl items-center gap-6 px-4 sm:px-6"
      >
        {/* Logo */}
        <Link href="/" className="shrink-0 select-none" aria-label="TruongLX-Movie">
          <span className="text-lg font-semibold tracking-[0.12em] text-white">
            TRUONGLX
            <span style={{ color: "rgba(255,255,255,0.35)" }}>-</span>
            MOVIE
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {movieTypes.slice(0, 4).map((type) => (
            <Link
              key={type.slug}
              href={`/danh-sach/${type.slug}`}
              className="px-3 py-1.5 text-sm transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.65)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
            >
              {type.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          <SearchForm compact />
          <Link
            href="/yeu-thich"
            className="p-2 transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.6)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            aria-label="Phim yêu thích"
          >
            <HeartIcon className="size-4" />
          </Link>
          <Link
            href="/lich-su"
            className="p-2 transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.6)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            aria-label="Lịch sử xem"
          >
            <HistoryIcon className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
