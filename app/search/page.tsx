import { Badge } from "@/components/ui/badge";
import { api } from "@/configs/api";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

async function search(keyword: string) {
  try {
    const response = await api(`/tim-kiem?keyword=${keyword}`);
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
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const movie = await search(q);

  return {
    title: movie.seoOnPage.titleHead,
    description: movie.seoOnPage.descriptionHead,

    openGraph: {
      type: movie.seoOnPage.og_type,
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
  return (
    <section className="container py-10">
      <h2 className="mb-4 md:mb-10">Kết quả tìm kiếm: "{q}"</h2>
      {!data?.items.length ? (
        <p>Không tìm thấy kết quả</p>
      ) : (
        <>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {data.items.map((item: any) => (
              <li key={item._id} className="group">
                <Link
                  href={`/movie/${item.slug}`}
                  className="inline-block w-full hover:opacity-80 mb-2 aspect-[0.75] overflow-y-hidden relative"
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
                  <Badge className="absolute font-semibold top-0 right-0 z-10 rounded-none">
                    {item.episode_current}
                  </Badge>
                </Link>
                <p className="text-sm/normal group-hover:text-primary">
                  {item.name}
                </p>
                <p className="text-xs/normal text-muted-foreground">
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