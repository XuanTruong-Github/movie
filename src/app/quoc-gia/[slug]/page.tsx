import type { Metadata } from "next";
import { fetchCountries, fetchMoviesByCountry } from "@/lib/api";
import { MovieGrid } from "@/components/movie/MovieGrid";
import { Pagination } from "@/components/search/Pagination";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const countries = await fetchCountries().catch(() => []);
  const country = countries.find((c) => c.slug === slug);
  return { title: country ? `Phim ${country.name}` : "Quốc gia" };
}

export default async function CountryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page) || 1);

  const [countries, result] = await Promise.all([
    fetchCountries().catch(() => []),
    fetchMoviesByCountry(slug, currentPage),
  ]);

  const country = countries.find((c) => c.slug === slug);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white/90 italic mb-8">
        Phim {country?.name ?? slug}
      </h1>
      <MovieGrid movies={result.items} />
      <Pagination
        currentPage={currentPage}
        totalPages={result.pagination?.totalPages ?? 1}
        buildHref={(p) => `/quoc-gia/${slug}?page=${p}`}
      />
    </div>
  );
}
