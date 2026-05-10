"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangleIcon } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
      <AlertTriangleIcon className="size-12 opacity-40" />
      <h2 className="text-xl font-semibold text-white">Đã xảy ra lỗi</h2>
      <p className="text-sm max-w-sm" style={{ color: "#8e8e93" }}>
        Không thể tải nội dung. Vui lòng thử lại hoặc quay về trang chủ.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}
        >
          Thử lại
        </button>
        <Link
          href="/"
          className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:opacity-90"
          style={{ background: "#fff", color: "#000" }}
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
