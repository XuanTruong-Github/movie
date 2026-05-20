"use client";

import { Heart, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import type { Category } from "@/lib/types";
import { SearchInput } from "@/components/search/SearchInput";
import { cn } from "@/lib/utils";

interface NavbarProps {
  genres: Category[];
}

export function Navbar({ genres }: NavbarProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { favorites } = useFavorites();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-white/6"
          : "bg-linear-to-b from-black/70 to-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-wide text-cinema-accent hover:opacity-80 transition-opacity shrink-0"
          >
            OPhim
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "text-sm transition-colors hover:text-white",
                pathname === "/" ? "text-white" : "text-white/60"
              )}
            >
              Trang chủ
            </Link>
            <Link
              href="/danh-sach/phim-bo"
              className={cn(
                "text-sm transition-colors hover:text-white",
                pathname.startsWith("/danh-sach/phim-bo") ? "text-white" : "text-white/60"
              )}
            >
              Phim bộ
            </Link>
            <Link
              href="/danh-sach/phim-le"
              className={cn(
                "text-sm transition-colors hover:text-white",
                pathname.startsWith("/danh-sach/phim-le") ? "text-white" : "text-white/60"
              )}
            >
              Phim lẻ
            </Link>
            <Link
              href="/danh-sach/phim-sap-chieu"
              className={cn(
                "text-sm transition-colors hover:text-white",
                pathname.startsWith("/danh-sach/phim-sap-chieu") ? "text-white" : "text-white/60"
              )}
            >
              Phim chiếu rạp
            </Link>

            {/* Genres dropdown */}
            <div className="relative group">
              <button className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1">
                Thể loại
                <span className="text-xs opacity-60">▾</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-cinema-surface/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 grid grid-cols-2 gap-0.5">
                {genres.slice(0, 20).map((g) => (
                  <Link
                    key={g.slug}
                    href={`/the-loai/${g.slug}`}
                    className="text-xs text-white/60 hover:text-white hover:bg-white/8 rounded-lg px-2.5 py-1.5 transition-colors truncate"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <SearchInput
                  className="w-64 hidden sm:block"
                  onClose={() => setSearchOpen(false)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-white/60 hover:text-white transition-colors p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white/60 hover:text-white transition-colors p-2"
                aria-label="Tìm kiếm"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            <Link
              href="/yeu-thich"
              className="relative text-white/60 hover:text-white transition-colors p-2"
              aria-label="Yêu thích"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cinema-accent" />
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white/60 hover:text-white transition-colors p-2"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="sm:hidden pb-3">
            <SearchInput onClose={() => setSearchOpen(false)} className="w-full" />
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d0d0d]/98 backdrop-blur-xl border-t border-white/6">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {[
              { href: "/", label: "Trang chủ" },
              { href: "/danh-sach/phim-bo", label: "Phim bộ" },
              { href: "/danh-sach/phim-le", label: "Phim lẻ" },
              { href: "/danh-sach/phim-sap-chieu", label: "Phim chiếu rạp" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-white/70 hover:text-white py-2 px-3 rounded-lg hover:bg-white/8 transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-white/8">
              <p className="text-xs text-white/30 px-3 mb-2 uppercase tracking-wider">Thể loại</p>
              <div className="grid grid-cols-2 gap-0.5">
                {genres.slice(0, 10).map((g) => (
                  <Link
                    key={g.slug}
                    href={`/the-loai/${g.slug}`}
                    className="text-xs text-white/60 hover:text-white py-1.5 px-3 rounded-lg hover:bg-white/8 transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
