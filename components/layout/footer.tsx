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
    <footer className="relative mt-10 overflow-hidden border-t border-white/5">
      {/* Watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 pr-8 text-[20rem] leading-none font-black text-white/[0.03] select-none"
      >
        T
      </div>

      <div className="relative z-10 container py-10">
        {/* Logo + tagline */}
        <div className="mb-6 flex items-center gap-4">
          <div className="bg-primary/10 border-primary/30 flex size-14 shrink-0 items-center justify-center rounded-full border">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-primary ml-0.5 size-7">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div>
            <p className="text-primary text-xl leading-tight font-black">TruongLX</p>
            <p className="text-muted-foreground text-sm">Phim hay, xem thả ga</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="mb-6 flex flex-wrap gap-x-6 gap-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="text-foreground/70 hover:text-primary text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Description */}
        <p className="text-muted-foreground mb-6 max-w-xl text-sm leading-relaxed">
          TruongLX — Trang xem phim online chất lượng cao miễn phí Vietsub, thuyết minh, lồng tiếng
          full HD. Kho phim mới khổng lồ, phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như
          Việt Nam, Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ... đa dạng thể loại.
        </p>

        {/* Copyright */}
        <p className="text-muted-foreground/60 text-xs">
          © {new Date().getFullYear()} TruongLX. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
