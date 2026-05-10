import Link from "next/link";
import { FilmIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
      <FilmIcon className="size-12 opacity-30" />
      <div>
        <h2 className="text-2xl font-bold text-white">Không tìm thấy</h2>
        <p className="mt-2 text-sm" style={{ color: "#8e8e93" }}>
          Trang hoặc phim bạn đang tìm không tồn tại.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
        style={{ background: "#fff", color: "#000" }}
      >
        Về trang chủ
      </Link>
    </div>
  );
}
