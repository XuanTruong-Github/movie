import { PaginationData } from "@/lib/types";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type Props = {
  data: PaginationData;
  basePath?: string;
  hrefBuilder?: (page: number) => string;
};

export default function CustomPagination({ data, basePath, hrefBuilder }: Props) {
  const { totalItems, totalItemsPerPage, currentPage, pageRanges } = data;

  const totalPages = Math.max(1, Math.ceil(totalItems / totalItemsPerPage));
  if (totalPages <= 1) return null;

  const current = Math.min(Math.max(1, currentPage), totalPages);
  const half = Math.floor(pageRanges / 2);

  let start = Math.max(1, current - half);
  const end = Math.min(totalPages, start + pageRanges - 1);
  if (end - start + 1 < pageRanges) start = Math.max(1, end - pageRanges + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const makeHref = (page: number) => {
    if (hrefBuilder) return hrefBuilder(page);
    const path = basePath ?? "";
    return path ? `${path}${path.includes("?") ? "&" : "?"}page=${page}` : `?page=${page}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={current > 1 ? makeHref(current - 1) : undefined} />
        </PaginationItem>

        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href={makeHref(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={makeHref(page)} isActive={page === current}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {end < totalPages && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={makeHref(totalPages)}>{totalPages}</PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext href={current < totalPages ? makeHref(current + 1) : undefined} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
