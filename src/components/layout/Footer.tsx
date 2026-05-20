import Link from "next/link";
import type { Category } from "@/lib/types";

interface FooterProps {
  genres: Category[];
  countries: Category[];
}

export function Footer({ genres, countries }: FooterProps) {
  return (
    <footer className="border-t border-white/[0.06] mt-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display text-xl font-bold text-[#e8d5b7]">
          OPhim
        </h1>
        <p className="mt-3 text-xs text-white/30 leading-relaxed">
          Xem phim trực tuyến chất lượng cao. Phim lẻ, phim bộ, hoạt hình và
          nhiều hơn nữa.
        </p>

        <div className="mt-10 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} OPhim.
          </p>
          <p className="text-xs text-white/20">
            Chỉ dành cho mục đích giải trí.
          </p>
        </div>
      </div>
    </footer>
  );
}
