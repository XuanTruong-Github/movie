import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Pagination } from "@/lib/types";

export function PaginationBar({ pagination, hrefForPage }: { pagination: Pagination; hrefForPage: (page: number) => string }) {
  const current = pagination.currentPage;
  const total = pagination.totalPages;

  if (total <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button asChild variant="outline" size="sm" aria-disabled={current <= 1}>
        <Link href={hrefForPage(Math.max(1, current - 1))}>Trang trước</Link>
      </Button>
      <span className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground">
        Trang {current} / {total}
      </span>
      <Button asChild variant="outline" size="sm" aria-disabled={current >= total}>
        <Link href={hrefForPage(Math.min(total, current + 1))}>Trang sau</Link>
      </Button>
    </div>
  );
}
