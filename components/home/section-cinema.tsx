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

async function getData(): Promise<MovieListResponse | null> {
  try {
    const response = await api("/danh-sach/phim-chieu-rap?limit=15", {
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

export default async function SectionCinema({
  className,
  ...props
}: ComponentProps<"section">) {
  const data = await getData();

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
          <Link href="/danh-sach/phim-chieu-rap" title={data?.titlePage}>
            <ChevronRight />
          </Link>
        </Button>
      </h2>

      <Carousel opts={{ dragFree: true, slidesToScroll: 1 }}>
        <CarouselContent>
          {data?.items?.map((item: MovieListItem) => {
            const imgSrc = `${data.APP_DOMAIN_CDN_IMAGE}/uploads/movies/${item.thumb_url}`;
            const meta = [item.lang, item.year, item.time]
              .filter(Boolean)
              .join(" • ");
            return (
              <CarouselItem
                key={item._id}
                className="basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Link href={`/movie/${item.slug}`} className="group block">
                  {/* Banner */}
                  <div className="relative sm:mb-6 mb-3">
                    <div className="aspect-video overflow-hidden rounded-lg bg-card border border-white/5 relative">
                      <Image
                        src={imgSrc}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {item.quality && (
                        <Badge className="absolute bottom-2 left-2 text-xs">
                          {item.quality}
                        </Badge>
                      )}
                    </div>

                    {/* Small poster overlapping bottom-left — desktop only */}
                    <div className="hidden sm:block absolute -bottom-15 left-3 w-20 rounded-md overflow-hidden bg-card border-2 border-background aspect-2/3 shadow-lg">
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
                  <div className="sm:pl-28 min-w-0">
                    <p className="font-medium text-sm/normal line-clamp-2 group-hover:text-primary mb-0.5">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {item.origin_name}
                    </p>
                    {meta && (
                      <p className="hidden sm:block text-xs/normal text-muted-foreground">
                        {meta}
                      </p>
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
