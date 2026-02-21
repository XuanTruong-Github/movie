import { Badge } from "@/components/ui/badge";
import { api } from "@/configs/api";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

async function getData() {
  try {
    const response = await api("/home");
    if (!response.ok) throw new Error(response.statusText);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getData();

  return {
    title: data.seoOnPage.titleHead,
    description: data.seoOnPage.descriptionHead,

    openGraph: {
      type: data.seoOnPage.og_type,
      title: data.seoOnPage.titleHead,
      description: data.seoOnPage.descriptionHead,
      images: data.seoOnPage.og_image.map((img: string) => ({
        url: `${data.APP_DOMAIN_CDN_IMAGE}${img}`,
      })),
    },
  };
}

export default async function Home() {
  const data = await getData();

  return (
    <section className="container py-6">
      <h2 className="mb-4 lg:mb-6">Phim mới nhất</h2>
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
            <p className="text-sm/normal group-hover:text-primary">{item.name}</p>
            <p className="text-xs/normal text-muted-foreground">
              {item.origin_name}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
export const runtime = 'edge';