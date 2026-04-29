"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuItem } from "@/lib/types";

type HeaderShellProps = {
  categories: MenuItem[];
  countries: MenuItem[];
};

export default function HeaderShell({ categories, countries }: HeaderShellProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/tim-kiem?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <header className={`sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm transition-shadow ${
      scrolled ? "shadow-lg" : ""
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">▶</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">Movie App</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="flex w-full gap-2">
              <Input
                type="text"
                placeholder="Tìm kiếm phim..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="bg-input text-foreground placeholder:text-muted-foreground"
              />
              <Button type="submit" variant="default">Tìm</Button>
            </div>
          </form>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/danh-sach/phim-le" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition">
              Phim lẻ
            </Link>
            <Link href="/danh-sach/phim-bo" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition">
              Phim bộ
            </Link>
            <Link href="/danh-sach/hoat-hinh" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition">
              Hoạt hình
            </Link>
          </nav>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger className="lg:hidden">
              <Button variant="outline" size="sm">
                ☰
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="space-y-4 mt-8">
                <Link href="/" className="block text-sm font-medium hover:text-primary">
                  Trang chủ
                </Link>
                <div>
                  <h3 className="text-sm font-semibold mb-3">Danh sách</h3>
                  <div className="space-y-2">
                    <Link href="/danh-sach/phim-le" className="block text-sm text-muted-foreground hover:text-foreground">
                      Phim lẻ
                    </Link>
                    <Link href="/danh-sach/phim-bo" className="block text-sm text-muted-foreground hover:text-foreground">
                      Phim bộ
                    </Link>
                    <Link href="/danh-sach/hoat-hinh" className="block text-sm text-muted-foreground hover:text-foreground">
                      Hoạt hình
                    </Link>
                    <Link href="/danh-sach/tv-shows" className="block text-sm text-muted-foreground hover:text-foreground">
                      TV Shows
                    </Link>
                  </div>
                </div>
                {categories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Thể loại</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {categories.slice(0, 10).map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/the-loai/${cat.slug}`}
                          className="block text-sm text-muted-foreground hover:text-foreground"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Tìm kiếm phim..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="bg-input text-foreground placeholder:text-muted-foreground flex-1"
            />
            <Button type="submit" variant="default" size="sm">Tìm</Button>
          </form>
        </div>
      </div>
    </header>
  );
}
