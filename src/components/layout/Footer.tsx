import Link from "next/link";
import type { Category } from "@/lib/types";

interface FooterProps {
  genres: Category[];
  countries: Category[];
}

export function Footer({ genres, countries }: FooterProps) {
  return (
    <footer className="border-t border-white/[0.06] mt-20 bg-[#0a0a0a]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-xl font-bold text-[#e8d5b7]">
              TruongLX-Movie
            </span>
            <p className="mt-3 text-xs text-white/30 leading-relaxed">
              Xem phim trực tuyến chất lượng cao. Phim lẻ, phim bộ, hoạt hình và nhiều hơn nữa.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Danh mục
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/danh-sach/phim-bo", label: "Phim bộ" },
                { href: "/danh-sach/phim-le", label: "Phim lẻ" },
                { href: "/danh-sach/tv-shows", label: "TV Shows" },
                { href: "/danh-sach/hoat-hinh", label: "Hoạt hình" },
                { href: "/danh-sach/phim-sap-chieu", label: "Phim chiếu rạp" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/40 hover:text-white/80 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Thể loại
            </h3>
            <ul className="space-y-2">
              {genres.slice(0, 8).map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/the-loai/${g.slug}`}
                    className="text-sm text-white/40 hover:text-white/80 transition-colors"
                  >
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Quốc gia
            </h3>
            <ul className="space-y-2">
              {countries.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/quoc-gia/${c.slug}`}
                    className="text-sm text-white/40 hover:text-white/80 transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} TruongLX-Movie.
          </p>
          <p className="text-xs text-white/20">
            Chỉ dành cho mục đích giải trí.
          </p>
        </div>
      </div>
    </footer>
  );
}
