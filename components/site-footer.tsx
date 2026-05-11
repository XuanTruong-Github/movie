import Link from "next/link";
import { movieTypes } from "@/lib/movie-types";

export function SiteFooter() {
  return (
    <footer
      className="mt-16 border-t py-10"
      style={{ borderColor: "rgba(255,255,255,0.08)", background: "#0a0a0a" }}
    >
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <span className="text-base font-semibold tracking-[0.12em] text-white">
              TRUONG-LX
            </span>
            <p className="text-xs max-w-xs" style={{ color: "#8e8e93" }}>
              Xem phim online miễn phí. Phim lẻ, phim bộ, hoạt hình, phim chiếu
              rạp chất lượng cao.
            </p>
          </div>

          {/* Nav */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-3">
            {movieTypes.map((type) => (
              <Link
                key={type.slug}
                href={`/danh-sach/${type.slug}`}
                className="transition-colors duration-200 hover:text-white"
                style={{ color: "#8e8e93" }}
              >
                {type.label}
              </Link>
            ))}
            <Link
              href="/yeu-thich"
              className="transition-colors duration-200 hover:text-white"
              style={{ color: "#8e8e93" }}
            >
              Yêu thích
            </Link>
            <Link
              href="/lich-su"
              className="transition-colors duration-200 hover:text-white"
              style={{ color: "#8e8e93" }}
            >
              Lịch sử xem
            </Link>
          </div>
        </div>

        <div
          className="mt-8 pt-6 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "#8e8e93",
          }}
        >
          © {new Date().getFullYear()} TRUONG-LX.
        </div>
      </div>
    </footer>
  );
}
