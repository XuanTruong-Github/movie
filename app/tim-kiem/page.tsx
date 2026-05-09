import Link from "next/link";

import { MovieGrid } from "@/components/movie-grid";
import { PaginationBar } from "@/components/pagination-bar";
import { SearchForm } from "@/components/search-form";

export const dynamic = "force-dynamic";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Empty } from "@/components/ui/empty";
import { searchMovies } from "@/lib/kkphim";
import { clampPage } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<{ keyword?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const keyword = (query.keyword ?? "").trim();
  const page = clampPage(query.page);

  const breadcrumb = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild><Link href="/">Trang chủ</Link></BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Tìm kiếm</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  if (!keyword) {
    return (
      <div className="container flex flex-col gap-6 py-8">
        {breadcrumb}
        <h1 className="text-3xl font-semibold tracking-normal">Tìm kiếm phim</h1>
        <SearchForm />
        <Empty title="Nhập từ khóa để tìm phim" description="Bạn có thể tìm theo tên phim tiếng Việt hoặc tên gốc." />
      </div>
    );
  }

  const data = await searchMovies(keyword, page);

  return (
    <div className="container flex flex-col gap-6 py-8">
      {breadcrumb}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Kết quả tìm kiếm</p>
          <h1 className="text-3xl font-semibold tracking-normal">{keyword}</h1>
        </div>
        <SearchForm defaultValue={keyword} />
      </div>
      <MovieGrid movies={data.items} />
      <PaginationBar
        pagination={data.pagination}
        hrefForPage={(nextPage) => `/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${nextPage}`}
      />
    </div>
  );
}
