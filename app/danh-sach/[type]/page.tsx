import { notFound } from "next/navigation";

import { MovieGrid } from "@/components/movie-grid";
import { PaginationBar } from "@/components/pagination-bar";
import { getLatestMovies, getMoviesByType, movieTypes } from "@/lib/kkphim";
import { clampPage } from "@/lib/utils";

type PageProps = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function MovieTypePage({ params, searchParams }: PageProps) {
  const [{ type }, query] = await Promise.all([params, searchParams]);
  const page = clampPage(query.page);
  const typeLabel = movieTypes.find((item) => item.slug === type)?.label;

  if (type !== "phim-moi-cap-nhat" && !typeLabel) notFound();

  const data = type === "phim-moi-cap-nhat" ? await getLatestMovies(page) : await getMoviesByType(type, page);
  const title = typeLabel ?? "Phim mới cập nhật";

  return (
    <div className="container flex flex-col gap-6 py-8">
      <div>
        <p className="text-sm text-muted-foreground">Danh sách phim</p>
        <h1 className="text-3xl font-semibold tracking-normal">{title}</h1>
      </div>
      <MovieGrid movies={data.items} />
      <PaginationBar pagination={data.pagination} hrefForPage={(nextPage) => `/danh-sach/${type}?page=${nextPage}`} />
    </div>
  );
}
