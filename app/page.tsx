import { SearchForm } from "@/components/search-form";
import { MovieGrid } from "@/components/movie-grid";
import { SectionHeading } from "@/components/section-heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getLatestMovies, getMoviesByType, movieTypes } from "@/lib/kkphim";

export default async function HomePage() {
  const [latest, single, series] = await Promise.allSettled([
    getLatestMovies(1),
    getMoviesByType("phim-le", 1),
    getMoviesByType("phim-bo", 1),
  ]);

  const latestData = latest.status === "fulfilled" ? latest.value : null;
  const singleData = single.status === "fulfilled" ? single.value : null;
  const seriesData = series.status === "fulfilled" ? series.value : null;

  return (
    <div className="flex flex-col gap-10 pb-12">
      <section className="border-b border-border bg-black/20 py-10 md:py-14">
        <div className="container flex flex-col gap-7">
          <SearchForm />
          <div className="flex flex-wrap gap-2">
            {movieTypes.map((type) => (
              <a key={type.slug} href={`/danh-sach/${type.slug}`} className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground">
                {type.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="container flex flex-col gap-10">
        {!latestData ? (
          <Alert>
            <AlertTitle>Không tải được phim mới</AlertTitle>
            <AlertDescription>API đang lỗi hoặc phản hồi quá chậm. Hãy thử tải lại trang.</AlertDescription>
          </Alert>
        ) : (
          <section className="flex flex-col gap-4">
            <SectionHeading title="Phim mới cập nhật" href="/danh-sach/phim-moi-cap-nhat" />
            <MovieGrid movies={latestData.items.slice(0, 12)} />
          </section>
        )}

        {singleData ? (
          <section className="flex flex-col gap-4">
            <SectionHeading title="Phim lẻ nổi bật" href="/danh-sach/phim-le" />
            <MovieGrid movies={singleData.items.slice(0, 12)} />
          </section>
        ) : null}

        {seriesData ? (
          <section className="flex flex-col gap-4">
            <SectionHeading title="Phim bộ mới" href="/danh-sach/phim-bo" />
            <MovieGrid movies={seriesData.items.slice(0, 12)} />
          </section>
        ) : null}
      </div>
    </div>
  );
}
