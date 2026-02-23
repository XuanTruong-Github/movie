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

async function getData(type: string) {
  try {
    const response = await api(`/danh-sach/${type}?limit=15`);
    if (!response.ok) throw new Error(response.statusText);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
}
type Props = { type: string } & ComponentProps<"section">;
export default async function SectionMovies({
  type,
  className,
  ...props
}: Props) {
  const data = await getData(type);
  return (
    <section className={cn("container", className)} {...props}>
      <h2 className="mb-4 lg:mb-6">
        <Link
          href={`/danh-sach/${type}`}
          target="_blank"
          className="hover:underline underline-offset-8 hover:text-primary"
          title={data?.titlePage}
        >
          {data?.titlePage}
        </Link>
      </h2>
      <Carousel
        opts={{
          dragFree: true,
          slidesToScroll: 1,
        }}
      >
        <CarouselContent className="">
          {data?.items?.map((item: any) => (
            <CarouselItem
              key={item._id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-1/6"
            >
              <Link
                href={`/movie/${item.slug}`}
                className="inline-block w-full hover:opacity-80 mb-2 aspect-[0.7] overflow-y-hidden bg-card rounded-lg relative border"
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
  );
}
