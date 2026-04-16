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
import { toOpenGraphType } from "@/lib/metadata";
import { MovieListItem, MovieListResponse } from "@/lib/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

async function getData(): Promise<MovieListResponse | null> {
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
  if (!data) {
    return {
      title: "Phim",
      description: "Phim",
    };
  }

  return {
    title: data.seoOnPage.titleHead,
    description: data.seoOnPage.descriptionHead,

    openGraph: {
      type: toOpenGraphType(data.seoOnPage.og_type),
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
  if (!data) {
    return (
      <section className="container py-10">
        <p>Không tải được dữ liệu trang chủ.</p>
      </section>
    );
  }

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
            {data.items.map((item: MovieListItem) => (
              <CarouselItem
                key={item._id}
                className="basis-1/2 md:basis-1/4 lg:basis-1/6 xl:basis-1/7"
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
                  <Badge className="absolute font-semibold bottom-0 left-1/2 -translate-x-1/2 z-10 rounded-none rounded-tl rounded-tr">
                    {item.episode_current}
                  </Badge>
                </Link>
                <p className="text-sm/normal text-center group-hover:text-primary line-clamp-2 mb-1">
                  {item.name}
                </p>
                <p className="text-xs/normal text-center text-muted-foreground line-clamp-2">
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
