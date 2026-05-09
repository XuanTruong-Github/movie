import Link from "next/link";

import { MovieGrid } from "@/components/movie-grid";
import { PaginationBar } from "@/components/pagination-bar";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCountries, getMoviesByCountry } from "@/lib/kkphim";
import { clampPage } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const countries = await getCountries();
  return countries.map((c) => ({ slug: c.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function CountryPage({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = clampPage(query.page);
  const data = await getMoviesByCountry(slug, page);

  return (
    <div className="container flex flex-col gap-6 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/">Trang chủ</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/quoc-gia">Quốc gia</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{data.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <p className="text-sm text-muted-foreground">Quốc gia</p>
        <h1 className="text-3xl font-semibold tracking-normal">{data.title}</h1>
      </div>
      <MovieGrid movies={data.items} />
      <PaginationBar pagination={data.pagination} hrefForPage={(nextPage) => `/quoc-gia/${slug}?page=${nextPage}`} />
    </div>
  );
}
