import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MovieGrid } from "@/components/movie-grid";
import { PaginationBar } from "@/components/pagination-bar";
import { getLatestMovies, getMoviesByType } from "@/lib/kkphim";
import { movieTypes } from "@/lib/movie-types";
import { clampPage } from "@/lib/utils";

export const revalidate = 300;

const LATEST_SLUG = "phim-moi-cap-nhat";

export async function generateStaticParams() {
  return [
    ...movieTypes.map((t) => ({ type: t.slug })),
    { type: LATEST_SLUG },
  ];
}

type PageProps = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const typeInfo = movieTypes.find((t) => t.slug === type);
  const title = typeInfo?.label ?? (type === LATEST_SLUG ? "Phim Mới Cập Nhật" : "Danh sách phim");
  return { title };
}

export default async function ListPage({ params, searchParams }: PageProps) {
  const { type } = await params;
  const { page: pageParam } = await searchParams;

  const isLatest = type === LATEST_SLUG;
  const typeInfo = movieTypes.find((t) => t.slug === type);
  if (!typeInfo && !isLatest) notFound();

  const page = clampPage(pageParam);
  const result = isLatest
    ? await getLatestMovies(page)
    : await getMoviesByType(type, page);

  const title = isLatest ? "Phim Mới Cập Nhật" : (typeInfo?.label ?? result.title);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-white">{title}</h1>
      <MovieGrid movies={result.items} />
      <PaginationBar
        currentPage={result.pagination.currentPage}
        totalPages={result.pagination.totalPages}
        buildHref={(p) => `/danh-sach/${type}?page=${p}`}
      />
    </div>
  );
}
