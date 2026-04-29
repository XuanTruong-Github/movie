import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MovieCard from "@/components/movie/movie-card";
import Pagination from "@/components/common/pagination";
import { getMoviesByCategory, getCategories } from "@/configs/api";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  return {
    title: category ? `${category.name} | Movie App` : "Thể loại",
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.slice(0, 20).map((cat) => ({ slug: cat.slug }));
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const [categories, data] = await Promise.all([
    getCategories(),
    getMoviesByCategory(slug, pageNum),
  ]);

  const category = categories.find((c) => c.slug === slug);

  if (!data || !category) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">{category.name}</h1>

          {data.items.length === 0 ? (
            <p className="text-center text-muted-foreground">Không có phim</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {data.items.map((movie) => (
                  <MovieCard key={movie.slug} movie={movie} />
                ))}
              </div>

              <Pagination pagination={data.pagination} />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
