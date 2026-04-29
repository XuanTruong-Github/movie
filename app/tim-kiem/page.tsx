import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MovieCard from "@/components/movie/movie-card";
import Pagination from "@/components/common/pagination";
import { searchMovies } from "@/configs/api";

type PageProps = {
  searchParams: Promise<{ keyword?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps) {
  const { keyword } = await searchParams;
  return {
    title: keyword
      ? `Tìm kiếm: ${keyword} | Movie App`
      : "Tìm kiếm | Movie App",
  };
}

export default async function Page({ searchParams }: PageProps) {
  const { keyword = "", page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);

  let data = null;
  if (keyword.trim()) {
    data = await searchMovies(keyword as string, pageNum);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">Tìm kiếm</h1>
          {keyword && (
            <p className="text-muted-foreground mb-8">
              Kết quả tìm kiếm cho: <span className="font-semibold">"{keyword}"</span>
            </p>
          )}

          {!keyword ? (
            <p className="text-center text-muted-foreground py-12">
              Vui lòng nhập từ khóa tìm kiếm
            </p>
          ) : data && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {data.items.map((movie) => (
                  <MovieCard key={movie.slug} movie={movie} />
                ))}
              </div>

              <Pagination pagination={data.pagination} />
            </>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              Không tìm thấy phim nào
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
