"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Pagination as PaginationUI, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type PaginationProps = {
  pagination: {
    currentPage: number;
    totalPages: number;
  };
};

export default function Pagination({ pagination }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageInput, setPageInput] = useState(pagination.currentPage.toString());

  const currentPage = pagination.currentPage;
  const totalPages = pagination.totalPages;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set("page", newPage.toString());
      router.push(`?${params.toString()}`);
    }
  };

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput, 10);
    handlePageChange(page);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta;

    if (left > 1) pages.push(1);
    if (left > 2) pages.push("...");

    for (let i = Math.max(1, left); i <= Math.min(totalPages, right); i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) pages.push("...");
    if (right < totalPages) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col gap-6 items-center mt-8">
      <PaginationUI>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {generatePageNumbers().map((page, idx) =>
            page === "..." ? (
              <span key={`dots-${idx}`} className="px-2">
                ...
              </span>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page as number)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationUI>

      <form onSubmit={handleGoToPage} className="flex gap-2 items-center">
        <span className="text-sm text-muted-foreground">Đi tới trang:</span>
        <Input
          type="number"
          min={1}
          max={totalPages}
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          className="w-20"
        />
        <Button type="submit" size="sm" variant="outline">
          OK
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Trang {currentPage} / {totalPages}
      </p>
    </div>
  );
}
