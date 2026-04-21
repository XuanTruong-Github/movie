import Link from "next/link";

const NAV_LINKS = [
  { label: "Phim lẻ", href: "/danh-sach/phim-le" },
  { label: "Phim bộ", href: "/danh-sach/phim-bo" },
  { label: "Phim chiếu rạp", href: "/danh-sach/phim-chieu-rap" },
  { label: "Giới thiệu", href: "/" },
  { label: "Liên hệ", href: "/" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 mt-10">
      {/* Watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[20rem] font-black text-white/[0.03] select-none leading-none pr-8"
      >
        T
      </div>

      <div className="container py-10 relative z-10">
        {/* Logo + tagline */}
        <div className="flex items-center gap-4 mb-6">
          <div className="size-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-7 text-primary ml-0.5"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-black text-primary leading-tight">
              TruongLX
            </p>
            <p className="text-sm text-muted-foreground">
              Phim hay, xem thả ga
            </p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Description */}
        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed mb-6">
          TruongLX — Trang xem phim online chất lượng cao miễn phí Vietsub,
          thuyết minh, lồng tiếng full HD. Kho phim mới khổng lồ, phim chiếu
          rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc, Trung
          Quốc, Thái Lan, Nhật Bản, Âu Mỹ... đa dạng thể loại.
        </p>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} TruongLX. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
