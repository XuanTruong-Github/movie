"use client";

import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { PaginationData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  data: PaginationData;
  basePath?: string;
  hrefBuilder?: (page: number) => string;
};

export default function CustomPagination({ data, basePath, hrefBuilder }: Props) {
  const { totalItems, totalItemsPerPage, currentPage } = data;
  const totalPages = Math.max(1, Math.ceil(totalItems / totalItemsPerPage));

  const current = Math.min(Math.max(1, currentPage), totalPages);
  const [inputValue, setInputValue] = useState(String(current));

  const router = useRouter();

  useEffect(() => {
    setInputValue(String(current));
  }, [current]);

  if (totalPages <= 1) return null;

  const makeHref = (page: number) => {
    if (hrefBuilder) return hrefBuilder(page);
    const path = basePath ?? "";
    return path ? `${path}${path.includes("?") ? "&" : "?"}page=${page}` : `?page=${page}`;
  };

  const navigate = (page: number) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    router.push(makeHref(clamped));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const parsed = parseInt(inputValue, 10);
      if (!isNaN(parsed)) navigate(parsed);
    }
  };

  const handleBlur = () => {
    setInputValue(String(current));
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Prev */}
      <button
        onClick={() => navigate(current - 1)}
        disabled={current <= 1}
        aria-label="Trang trước"
        className="bg-secondary text-foreground/70 hover:text-foreground flex size-10 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page pill */}
      <div className="bg-secondary text-foreground/70 flex h-10 items-center gap-1.5 rounded-full px-5 text-sm">
        <span>Trang</span>
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="bg-background/60 text-foreground focus:ring-ring w-10 rounded px-1 py-0.5 text-center text-sm outline-none focus:ring-1"
          aria-label="Số trang"
        />
        <span>/ {totalPages}</span>
      </div>

      {/* Next */}
      <button
        onClick={() => navigate(current + 1)}
        disabled={current >= totalPages}
        aria-label="Trang sau"
        className="bg-secondary text-foreground/70 hover:text-foreground flex size-10 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
