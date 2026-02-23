import SectionMovies from "@/components/home/section-movies";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
    <>
      <section className="container my-6">
        <h2 className="mb-4 lg:mb-6">Phim mới nhất</h2>
        <Carousel
          opts={{
            dragFree: true,
            slidesToScroll: 1,
          }}
        >
          <CarouselContent className="">
            {data.items.map((item: any) => (
              <CarouselItem
                key={item._id}
                className="basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-1/6"
              >
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="max-lg:hidden" />
          <CarouselNext className="max-lg:hidden" />
        </Carousel>
      </section>
      <SectionMovies type="phim-chieu-rap" className="mb-6 lg:mb-10" />
      <SectionMovies type="phim-le" className="mb-6 lg:mb-10" />
      <SectionMovies type="phim-bo" />
    </>
  );
}
