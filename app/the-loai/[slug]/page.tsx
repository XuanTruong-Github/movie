import { MovieGrid } from "@/components/movie-grid";
import { PaginationBar } from "@/components/pagination-bar";
import { getMoviesByCategory } from "@/lib/kkphim";
import { clampPage } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = clampPage(query.page);
  const data = await getMoviesByCategory(slug, page);

  return (
    <div className="container flex flex-col gap-6 py-8">
      <div>
        <p className="text-sm text-muted-foreground">Thể loại</p>
        <h1 className="text-3xl font-semibold tracking-normal">{data.title}</h1>
      </div>
      <MovieGrid movies={data.items} />
      <PaginationBar pagination={data.pagination} hrefForPage={(nextPage) => `/the-loai/${slug}?page=${nextPage}`} />
    </div>
  );
}
