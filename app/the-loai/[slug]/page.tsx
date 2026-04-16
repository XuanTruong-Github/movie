import CommonPagination from "@/components/common/pagination";
import { Badge } from "@/components/ui/badge";
import { api } from "@/configs/api";
import { toOpenGraphType } from "@/lib/metadata";
import { ListSearchParams, MovieListItem, MovieListResponse } from "@/lib/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

async function getMovies(
  slug: string,
  params: ListSearchParams = {
    page: "1",
    limit: "24",
  },
): Promise<MovieListResponse | null> {
  try {
    const searchParams = new URLSearchParams(params).toString();
    const response = await api(`/the-loai/${slug}?${searchParams}`);
    if (!response.ok) throw new Error(response.statusText);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
}
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page: string; limit: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovies(slug, await searchParams);
  if (!movie) {
    return {
      title: slug,
      description: `Danh sach phim theo the loai ${slug}`,
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

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const data = await getMovies(slug, await searchParams);
  if (!data) {
    return (
      <section className="container py-10">
        <h2 className="mb-4 md:mb-6 lg:mb-10">{slug}</h2>
        <p>Không tải được dữ liệu thể loại.</p>
      </section>
    );
  }
  const { pagination } = data.params;
  return (
    <section className="container py-10">
      <h2 className="mb-4 md:mb-6 lg:mb-10">{data.titlePage}</h2>
      {!data?.items.length ? (
        <p>Không có phim nào</p>
      ) : (
        <>
          <ul className="grid mb-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {data.items.map((item: MovieListItem) => (
              <li key={item._id} className="group">
                <Link
                  href={`/movie/${item.slug}`}
                  className="inline-block w-full hover:opacity-80 mb-2 aspect-[0.75] overflow-y-hidden bg-card rounded-lg relative border"
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
                  <Badge className="absolute font-semibold top-0 left-0 z-10 rounded-none rounded-br-lg">
                    {item.episode_current}
                  </Badge>
                </Link>
                <p className="text-sm/normal group-hover:text-primary line-clamp-2 mb-1">
                  {item.name}
                </p>
                <p className="text-xs/normal text-muted-foreground line-clamp-2">
                  {item.origin_name}
                </p>
              </li>
            ))}
          </ul>
          <CommonPagination data={pagination} />
        </>
      )}
    </section>
  );
}
