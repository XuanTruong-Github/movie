import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MovieCard from "@/components/movie/movie-card";
import Pagination from "@/components/common/pagination";
import { getMoviesByType } from "@/configs/api";
import { notFound } from "next/navigation";

const VALID_TYPES = ["phim-le", "phim-bo", "hoat-hinh", "tv-shows"];

const TYPE_LABELS: Record<string, string> = {
  "phim-le": "Phim Lẻ",
  "phim-bo": "Phim Bộ",
  "hoat-hinh": "Hoạt Hình",
  "tv-shows": "TV Shows",
};

type PageProps = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { type } = await params;
  return {
    title: `${TYPE_LABELS[type] || type} | Movie App`,
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { type } = await params;
  const { page = "1" } = await searchParams;

  if (!VALID_TYPES.includes(type)) {
    notFound();
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const data = await getMoviesByType(type, pageNum);

  if (!data) {
    return (
      <>
        <Header />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Không thể tải dữ liệu</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">{TYPE_LABELS[type]}</h1>

          {!data || data.items.length === 0 ? (
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
