import type { Metadata } from "next";
import { SearchForm } from "@/components/search-form";
import { MovieGrid } from "@/components/movie-grid";
import { PaginationBar } from "@/components/pagination-bar";
import { searchMovies } from "@/lib/kkphim";
import { clampPage } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ keyword?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { keyword } = await searchParams;
  return {
    title: keyword ? `Tìm kiếm: ${keyword}` : "Tìm kiếm phim",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { keyword, page: pageParam } = await searchParams;
  const page = clampPage(pageParam);

  let result = null;
  if (keyword?.trim()) {
    try {
      result = await searchMovies(keyword.trim(), page);
    } catch {
      result = null;
    }
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Tìm kiếm phim</h1>

      <div className="mb-8">
        <SearchForm />
      </div>

      {result ? (
        <>
          <p className="mb-4 text-sm" style={{ color: "#8e8e93" }}>
            {result.items.length > 0
              ? `Tìm thấy ${result.pagination.totalItems.toLocaleString("vi-VN")} kết quả cho "${keyword}"`
              : `Không tìm thấy kết quả cho "${keyword}"`}
          </p>
          <MovieGrid movies={result.items} />
          <PaginationBar
            currentPage={result.pagination.currentPage}
            totalPages={result.pagination.totalPages}
            buildHref={(p) =>
              `/tim-kiem?keyword=${encodeURIComponent(keyword ?? "")}&page=${p}`
            }
          />
        </>
      ) : keyword ? (
        <p className="text-sm" style={{ color: "#8e8e93" }}>
          Đã có lỗi khi tìm kiếm. Vui lòng thử lại.
        </p>
      ) : null}
    </div>
  );
}
