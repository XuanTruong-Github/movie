import { api } from "@/configs/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { MovieListItem, MovieListResponse } from "@/lib/types";
import { Button } from "../ui/button";
import { ChevronRight } from "@/components/ui/icons";

async function getData(type: string): Promise<MovieListResponse | null> {
  try {
    const response = await api(`/danh-sach/${type}?limit=15`, {
      next: { revalidate: 120 },
    });
    if (!response.ok) throw new Error(response.statusText);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
}

type Props = { type: string } & ComponentProps<"section">;

export default async function SectionMovies({ type, className, ...props }: Props) {
  const data = await getData(type);

  return (
    <section className={cn("container", className)} {...props}>
      <h2 className="mb-4 lg:mb-6 flex items-center gap-3 border-l-[3px] border-primary pl-3">
        {data?.titlePage}
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full opacity-60 hover:opacity-100"
          asChild
        >
          <Link href={`/danh-sach/${type}`} title={data?.titlePage}>
            <ChevronRight />
          </Link>
        </Button>
      </h2>

      <Carousel opts={{ dragFree: true, slidesToScroll: 1 }}>
        <CarouselContent>
          {data?.items?.map((item: MovieListItem) => (
            <CarouselItem
              key={item._id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/6 xl:basis-1/7 group"
            >
              <Link
                href={`/movie/${item.slug}`}
                className="inline-block w-full hover:opacity-80 mb-2 aspect-2/3 overflow-hidden bg-card rounded-lg relative border border-white/5"
                title={item.name}
              >
                <Image
                  src={`${data.APP_DOMAIN_CDN_IMAGE}/uploads/movies/${item.thumb_url}`}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover"
                  loading="lazy"
                />
                <Badge className="absolute font-semibold bottom-0 left-1/2 -translate-x-1/2 z-10 rounded-none rounded-tl rounded-tr">
                  {item.episode_current}
                </Badge>
              </Link>
              <p className="text-sm/normal text-center line-clamp-2 mb-1 group-hover:text-primary">
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
  );
}
