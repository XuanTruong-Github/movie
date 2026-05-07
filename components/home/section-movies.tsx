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
      next: { revalidate: 3600 },
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
      <h2 className="border-primary mb-4 flex items-center gap-3 border-l-[3px] pl-3 lg:mb-6">
        {data?.titlePage}
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full opacity-60 hover:opacity-100"
          asChild
        >
          <Link href="/danh-sach/phim-chieu-rap" title={data?.titlePage}>
            <ChevronRight />
          </Link>
        </Button>
      </h2>

      <Carousel opts={{ dragFree: true, slidesToScroll: 2 }}>
        <CarouselContent>
          {data?.items?.map((item: MovieListItem) => {
            const imgSrc = `${data.APP_DOMAIN_CDN_IMAGE}/uploads/movies/${item.thumb_url}`;
            const meta = [item.lang, item.year, item.time].filter(Boolean).join(" • ");
            return (
              <CarouselItem
                key={item._id}
                className="basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Link href={`/movie/${item.slug}`} className="group block">
                  {/* Banner */}
                  <div className="relative mb-3 sm:mb-6">
                    <div className="bg-card relative aspect-3/4 overflow-hidden rounded-lg border border-white/5 md:aspect-video">
                      <Image
                        src={imgSrc}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                        loading="lazy"
                      />
                      {item.quality && (
                        <Badge className="absolute bottom-2 left-2 text-xs">{item.quality}</Badge>
                      )}
                    </div>

                    {/* Small poster overlapping bottom-left — desktop only */}
                    <div className="bg-card border-background absolute -bottom-15 left-3 hidden aspect-2/3 w-20 overflow-hidden rounded-md border-2 shadow-lg sm:block">
                      <Image
                        src={imgSrc}
                        alt={item.name}
                        fill
                        sizes="25vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 sm:pl-28">
                    <p className="group-hover:text-primary mb-0.5 line-clamp-2 text-sm/normal font-medium">
                      {item.name}
                    </p>
                    <p className="text-muted-foreground line-clamp-1 text-xs">{item.origin_name}</p>
                    {meta && (
                      <p className="text-muted-foreground hidden text-xs/normal sm:block">{meta}</p>
                    )}
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="max-lg:hidden" />
        <CarouselNext className="max-lg:hidden" />
      </Carousel>
    </section>
  );
}
