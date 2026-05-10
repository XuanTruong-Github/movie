"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, HeartIcon, HistoryIcon } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { movieTypes } from "@/lib/movie-types";
import type { TaxonomyItem } from "@/lib/types";

interface SiteHeaderProps {
  categories: TaxonomyItem[];
  countries: TaxonomyItem[];
}

function NavDropdown({
  label,
  items,
  basePath,
  cols = 4,
}: {
  label: string;
  items: TaxonomyItem[];
  basePath: string;
  cols?: number;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const gridCols: Record<number, string> = {
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        className="flex items-center gap-0.5 px-3 py-1.5 text-sm transition-colors duration-200 cursor-pointer"
        style={{ color: open ? "#fff" : "rgba(255,255,255,0.65)" }}
      >
        {label}
        <ChevronDownIcon
          className="size-3.5 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1.5 z-50">
          <div
            className={`grid ${gridCols[cols] ?? "grid-cols-4"} gap-x-1 gap-y-0.5 rounded-xl p-3`}
            style={{
              background: "rgba(18,18,18,0.98)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
              minWidth: cols === 3 ? "380px" : "500px",
            }}
          >
            {items.map((item) => (
              <Link
                key={item.slug}
                href={`/${basePath}/${item.slug}`}
                className="px-2.5 py-1.5 text-sm rounded-lg transition-colors duration-150 whitespace-nowrap"
                style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  e.currentTarget.style.background = "transparent";
                }}
                onClick={() => setOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteHeader({ categories, countries }: SiteHeaderProps) {
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
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-6 px-4 sm:px-6">
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

          {categories.length > 0 && (
            <NavDropdown label="Thể loại" items={categories} basePath="the-loai" cols={4} />
          )}

          {countries.length > 0 && (
            <NavDropdown label="Quốc gia" items={countries} basePath="quoc-gia" cols={3} />
          )}
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
