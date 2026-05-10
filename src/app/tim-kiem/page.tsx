import type { Metadata } from "next";
import { fetchSearch } from "@/lib/api";
import { MovieGrid } from "@/components/movie/MovieGrid";
import { Pagination } from "@/components/search/Pagination";
import { SearchInput } from "@/components/search/SearchInput";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ keyword?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { keyword = "" } = await searchParams;
  return {
    title: keyword ? `Tìm kiếm: ${keyword}` : "Tìm kiếm phim",
  };
}

async function SearchResults({
  keyword,
  page,
}: {
  keyword: string;
  page: number;
}) {
  if (!keyword) {
    return (
      <div className="text-center py-20 text-white/30">
        Nhập từ khóa để tìm kiếm phim.
      </div>
    );
  }

  const results = await fetchSearch(keyword, page);

  return (
    <>
      <p className="text-white/40 text-sm mb-6">
        Tìm thấy{" "}
        <span className="text-white/70">{results.pagination?.totalItems ?? 0}</span>{" "}
        kết quả cho &quot;{keyword}&quot;
      </p>
      <MovieGrid movies={results.items} />
      <Pagination
        currentPage={page}
        totalPages={results.pagination?.totalPages ?? 1}
        buildHref={(p) =>
          `/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${p}`
        }
      />
    </>
  );
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { keyword = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page) || 1);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white/90 italic mb-6">
        Tìm kiếm phim
      </h1>
      <div className="max-w-lg mb-8">
        <Suspense>
          <SearchInput className="w-full" />
        </Suspense>
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] rounded-xl bg-[#1a1a1a] animate-pulse"
              />
            ))}
          </div>
        }
      >
        <SearchResults keyword={keyword} page={currentPage} />
      </Suspense>
    </div>
  );
}
