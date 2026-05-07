import { Badge } from "@/components/ui/badge";
import { api } from "@/configs/api";
import { toOpenGraphType } from "@/lib/metadata";
import { MovieListItem, MovieListResponse } from "@/lib/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

async function search(keyword: string): Promise<MovieListResponse | null> {
  try {
    const response = await api(`/tim-kiem?keyword=${keyword}`, {
      next: { revalidate: 30 },
    });
    if (!response.ok) throw new Error(response.statusText);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
}

type Props = {
  searchParams: Promise<{ q: string }>;
};
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const movie = await search(q);
  if (!movie) {
    return {
      title: `Tìm kiếm: ${q}`,
      description: `Kết quả tìm kiếm cho ${q}`,
    };
  }

  return {
    title: movie.seoOnPage.titleHead,
    description: movie.seoOnPage.descriptionHead,

    openGraph: {
      type: toOpenGraphType(movie.seoOnPage.og_type),
      title: movie.seoOnPage.titleHead,
      description: movie.seoOnPage.descriptionHead,
      url: movie.seoOnPage.og_url,
      images: movie.seoOnPage.og_image.map((img: string) => ({
        url: `${movie.APP_DOMAIN_CDN_IMAGE}${img}`,
      })),
    },
  };
}
export default async function Page({ searchParams }: Props) {
  const { q } = await searchParams;
  const data = await search(q);
  if (!data) {
    return (
      <section className="container py-10">
        <h2 className="mb-4 md:mb-10">Kết quả tìm kiếm: &quot;{q}&quot;</h2>
        <p>Không tải được dữ liệu tìm kiếm.</p>
      </section>
    );
  }
  return (
    <section className="container py-10">
      <h2 className="mb-4 md:mb-10">Kết quả tìm kiếm: &quot;{q}&quot;</h2>
      {!data?.items.length ? (
        <p>Không tìm thấy kết quả</p>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {data.items.map((item: MovieListItem) => (
              <li key={item._id} className="group">
                <Link
                  href={`/movie/${item.slug}`}
                  className="bg-card relative mb-2 inline-block aspect-[0.75] w-full overflow-y-hidden rounded-lg border hover:opacity-80"
                  title={item.name}
                >
                  <Image
                    src={`${data.APP_DOMAIN_CDN_IMAGE}/uploads/movies/${item.thumb_url}`}
                    alt={item.name}
                    width={320}
                    height={320}
                    sizes="100vw"
                    className="w-full object-contain"
                    loading="lazy"
                  />
                  <Badge className="absolute top-0 left-0 z-10 rounded-none rounded-br-lg font-semibold">
                    {item.episode_current}
                  </Badge>
                </Link>
                <p className="group-hover:text-primary mb-1 line-clamp-2 text-sm/normal">
                  {item.name}
                </p>
                <p className="text-muted-foreground line-clamp-2 text-xs/normal">
                  {item.origin_name}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
