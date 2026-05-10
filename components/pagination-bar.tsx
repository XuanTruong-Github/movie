import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export function PaginationBar({ currentPage, totalPages, buildHref }: PaginationBarProps) {
  if (totalPages <= 1) return null;

  const prev = currentPage - 1;
  const next = currentPage + 1;
  const hasPrev = prev >= 1;
  const hasNext = next <= totalPages;

  const btnBase =
    "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200";

  return (
    <div className="flex items-center justify-center gap-3 py-8">
      {hasPrev ? (
        <Link
          href={buildHref(prev)}
          className={btnBase}
          style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}
        >
          <ChevronLeftIcon className="size-4" />
          Trang trước
        </Link>
      ) : (
        <span
          className={btnBase}
          style={{ color: "#8e8e93", cursor: "not-allowed" }}
        >
          <ChevronLeftIcon className="size-4" />
          Trang trước
        </span>
      )}

      <span className="text-sm" style={{ color: "#8e8e93" }}>
        {currentPage} / {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={buildHref(next)}
          className={btnBase}
          style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}
        >
          Trang sau
          <ChevronRightIcon className="size-4" />
        </Link>
      ) : (
        <span
          className={btnBase}
          style={{ color: "#8e8e93", cursor: "not-allowed" }}
        >
          Trang sau
          <ChevronRightIcon className="size-4" />
        </span>
      )}
    </div>
  );
}
