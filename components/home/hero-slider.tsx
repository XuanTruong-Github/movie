"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { MovieListItem } from "@/lib/types";
import Fade from "embla-carousel-fade";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Props = {
  items: MovieListItem[];
  cdnUrl: string;
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 ml-0.5">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function HeroSlider({ items, cdnUrl }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    const timer = setInterval(() => api.scrollNext(), 6000);
    return () => {
      api.off("select", onSelect);
      clearInterval(timer);
    };
  }, [api]);

  const scrollTo = useCallback((i: number) => api?.scrollTo(i), [api]);

  const imgUrl = (thumb: string) => `${cdnUrl}/uploads/movies/${thumb}`;

  return (
    <section className="relative h-115 lg:h-135">
      <Carousel
        opts={{ loop: true }}
        plugins={[Fade()]}
        setApi={setApi}
        className="h-full"
      >
        <CarouselContent className="ml-0 h-115 lg:h-135">
          {items.map((item, index) => (
            <CarouselItem key={item._id} className="pl-0 relative">
              {/* Background image */}
              <Image
                src={imgUrl(item.thumb_url)}
                alt={item.name}
                fill
                className="object-cover object-top"
                priority={index === 0}
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-linear-to-r from-background via-background/20 to-background/5" />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />

              {/* Content — bottom-left */}
              <div className="absolute bottom-0 left-0 right-0">
                <div className="container pb-16 lg:pb-20">
                  <div className="max-w-xl">
                  <h1 className="text-2xl lg:text-4xl font-bold text-white mb-1.5 leading-tight line-clamp-2">
                    {item.name}
                  </h1>
                  <p className="text-primary font-medium text-sm mb-3 line-clamp-1">
                    {item.origin_name}
                  </p>

                  {/* Metadata pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {(item.imdb?.vote_average ?? 0) > 0 && (
                      <Badge
                        variant="outline"
                        className="border-yellow-500/50 text-yellow-400 rounded gap-1"
                      >
                        <span className="font-bold text-yellow-500">IMDb</span>
                        {item.imdb!.vote_average!.toFixed(1)}
                      </Badge>
                    )}
                    {item.quality && (
                      <Badge
                        variant="outline"
                        className="border-white/25 text-white/75 rounded"
                      >
                        {item.quality}
                      </Badge>
                    )}
                    {item.year && (
                      <Badge
                        variant="outline"
                        className="border-white/25 text-white/75 rounded"
                      >
                        {item.year}
                      </Badge>
                    )}
                    {item.lang && (
                      <Badge
                        variant="outline"
                        className="border-white/25 text-white/75 rounded"
                      >
                        {item.lang}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="border-white/25 text-white/75 rounded"
                    >
                      {item.episode_current}
                    </Badge>
                  </div>

                  {/* Genre tags */}
                  {item.category?.length ? (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {item.category.slice(0, 3).map((cat) => (
                        <Badge
                          key={cat.id}
                          asChild
                          variant="outline"
                          className="border-white/20 text-white/60 hover:text-primary hover:border-primary/60 rounded-full transition-colors"
                        >
                          <Link href={`/the-loai/${cat.slug}`}>{cat.name}</Link>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-5" />
                  )}

                  {/* Play button */}
                  <Button
                    asChild
                    size="icon-lg"
                    className="rounded-full size-14 shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
                  >
                    <Link href={`/movie/${item.slug}`} title="Xem ngay">
                      <PlayIcon />
                    </Link>
                  </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Circular thumbnails navigation — bottom right */}
      <div className="absolute bottom-5 right-4 lg:right-[max(1rem,calc((100%-80rem)/2))] flex items-center gap-2">
        {items.map((item, i) => (
          <button
            key={item._id}
            onClick={() => scrollTo(i)}
            aria-label={item.name}
            className={`relative size-10 rounded-full overflow-hidden border-2 transition-all duration-300 ${
              i === selectedIndex
                ? "border-primary shadow-lg shadow-primary/30"
                : "border-white/20 opacity-50 hover:opacity-90 hover:border-white/50"
            }`}
          >
            <Image
              src={imgUrl(item.thumb_url)}
              alt={item.name}
              fill
              className="object-cover"
              sizes="44px"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
