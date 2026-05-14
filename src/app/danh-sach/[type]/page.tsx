import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchCinema,
  fetchLatestMovies,
  fetchSeriesList,
  fetchStandaloneList,
} from "@/lib/api";
import { MovieGrid } from "@/components/movie/MovieGrid";
import { Pagination } from "@/components/search/Pagination";
import type { ListResponse } from "@/lib/types";

const LIST_CONFIG: Record<
  string,
  { title: string; fetcher: (p: number, l: number) => Promise<ListResponse> }
> = {
  "phim-moi": { title: "Phim Mới Cập Nhật", fetcher: fetchLatestMovies },
  "phim-bo": { title: "Phim Bộ", fetcher: fetchSeriesList },
  "phim-le": { title: "Phim Lẻ", fetcher: fetchStandaloneList },
  "phim-sap-chieu": {
    title: "Phim Chiếu Rạp / Sắp Chiếu",
    fetcher: fetchCinema,
  },
};

interface PageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { type } = await params;
  const config = LIST_CONFIG[type];
  return { title: config?.title ?? "Danh sách phim" };
}

export default async function ListPage({ params, searchParams }: PageProps) {
  const { type } = await params;
  const { page = "1", limit = "20" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page) || 1);
  const limitNumber = Math.max(1, parseInt(limit) || 20);

  const config = LIST_CONFIG[type];
  if (!config) notFound();

  const result = await config.fetcher(currentPage, limitNumber);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white/90 italic mb-8">
        {config.title}
      </h1>
      <MovieGrid movies={result.items} />
      <Pagination
        currentPage={currentPage}
        totalPages={result.pagination?.totalPages ?? 1}
        buildHref={(p) => `/danh-sach/${type}?page=${p}&limit=${limitNumber}`}
      />
    </div>
  );
}
