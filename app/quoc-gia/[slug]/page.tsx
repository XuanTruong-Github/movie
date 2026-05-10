import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MovieGrid } from "@/components/movie-grid";
import { PaginationBar } from "@/components/pagination-bar";
import { getCountries, getMoviesByCountry } from "@/lib/kkphim";
import { clampPage } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const countries = await getCountries();
    return countries.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const countries = await getCountries();
    const country = countries.find((c) => c.slug === slug);
    return { title: country?.name ?? slug };
  } catch {
    return { title: slug };
  }
}

export default async function CountryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = clampPage(pageParam);

  let result;
  try {
    result = await getMoviesByCountry(slug, page);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-white capitalize">
        {result.title || slug}
      </h1>
      <MovieGrid movies={result.items} />
      <PaginationBar
        currentPage={result.pagination.currentPage}
        totalPages={result.pagination.totalPages}
        buildHref={(p) => `/quoc-gia/${slug}?page=${p}`}
      />
    </div>
  );
}
