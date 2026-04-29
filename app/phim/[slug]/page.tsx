import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Player from "@/components/movie/player";
import { getMovieDetail } from "@/configs/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = await getMovieDetail(slug);

  if (!data?.movie) {
    return { title: "Phim không tìm thấy" };
  }

  return {
    title: `${data.movie.name} | Movie App`,
    description: data.movie.content?.substring(0, 160),
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const data = await getMovieDetail(slug);

  if (!data?.movie) {
    notFound();
  }

  const { movie, episodes } = data;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Movie Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Poster */}
            <div className="md:col-span-1">
              {(() => {
                const url = movie.poster_url || movie.thumb_url;
                let imageSrc = undefined;
                if (url) {
                  if (url.startsWith("http")) imageSrc = url;
                  else if (url.startsWith("/")) imageSrc = url;
                  else imageSrc = `https://img.phimapi.com/${url}`;
                }
                return imageSrc ? (
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card">
                    <Image
                      src={imageSrc}
                      alt={movie.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[2/3] bg-card rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                );
              })()}
            </div>

            {/* Info */}
            <div className="md:col-span-3 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.name}</h1>
              {movie.origin_name && (
                <p className="text-lg text-muted-foreground mb-4">{movie.origin_name}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.year && (
                  <Badge variant="secondary">{movie.year}</Badge>
                )}
                {movie.quality && (
                  <Badge variant="default">{movie.quality}</Badge>
                )}
                {movie.lang && (
                  <Badge variant="outline">{movie.lang}</Badge>
                )}
                {movie.status && (
                  <Badge variant="outline">
                    {movie.status === "completed" ? "Hoàn thành" : "Đang phát"}
                  </Badge>
                )}
              </div>

              {/* Details */}
              <div className="space-y-3 text-sm">
                {movie.time && (
                  <div>
                    <span className="text-muted-foreground">Thời lượng:</span>
                    <span className="ml-2 font-medium">{movie.time}</span>
                  </div>
                )}
                {movie.episode_total && (
                  <div>
                    <span className="text-muted-foreground">Tập:</span>
                    <span className="ml-2 font-medium">{movie.episode_total}</span>
                  </div>
                )}
                {movie.type && (
                  <div>
                    <span className="text-muted-foreground">Loại:</span>
                    <span className="ml-2 font-medium">
                      {movie.type === "phim-le" && "Phim lẻ"}
                      {movie.type === "phim-bo" && "Phim bộ"}
                      {movie.type === "hoat-hinh" && "Hoạt hình"}
                      {movie.type === "tv-shows" && "TV Shows"}
                    </span>
                  </div>
                )}

                {/* Categories */}
                {movie.category && movie.category.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Thể loại:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {movie.category.map((cat) => (
                        <Badge key={cat.slug} variant="secondary">
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Countries */}
                {movie.country && movie.country.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Quốc gia:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {movie.country.map((c) => (
                        <Badge key={c.slug} variant="outline">
                          {c.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Directors */}
                {movie.director && movie.director.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Đạo diễn:</span>
                    <p className="font-medium">{movie.director.join(", ")}</p>
                  </div>
                )}

                {/* Actors */}
                {movie.actor && movie.actor.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Diễn viên:</span>
                    <p className="font-medium line-clamp-2">
                      {movie.actor.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Player */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Xem phim</h2>
            <Player movie={movie} episodes={episodes} />
          </div>

          {/* Synopsis */}
          {movie.content && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Nội dung</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {movie.content}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
