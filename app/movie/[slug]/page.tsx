import MoviePlayer from "@/components/movie/player";
import Trailer from "@/components/movie/trailer";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/configs/api";
import { toOpenGraphType } from "@/lib/metadata";
import { BreadcrumbItemData, MovieCategory, MovieCountry, MovieDetailResponse } from "@/lib/types";
import { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

async function getMovie(slug: string): Promise<MovieDetailResponse | null> {
  try {
    const response = await api(`/phim/${slug}`, {
      next: { revalidate: 600 },
    });
    if (!response.ok) throw new Error(response.statusText);
    const { data } = await response.json();
    return data;
  } catch {
    return null;
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovie(slug);
  if (!movie) {
    return {
      title: slug,
      description: `Thong tin phim ${slug}`,
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

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const movie = await getMovie(slug);
  if (!movie) {
    return (
      <section className="container py-10">
        <p>Không tải được thông tin phim.</p>
      </section>
    );
  }

  return (
    <section className="container py-10">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {movie.breadCrumb.map((item: BreadcrumbItemData, index: number) => {
            if (item.isCurrent)
              return (
                <BreadcrumbItem key={index}>
                  <BreadcrumbPage className="font-bold">{item.name}</BreadcrumbPage>
                </BreadcrumbItem>
              );
            return (
              <Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={item.slug}>{item.name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      {movie.item.status === "trailer" ? (
        <Trailer movie={movie.item} className="mb-10" />
      ) : (
        <MoviePlayer movie={movie} className="mb-10" />
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {movie.item.status === "trailer" ? "Trailer" : ""} {movie.item.name}
          </CardTitle>
          <CardDescription className="text-primary">{movie.item.origin_name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            dangerouslySetInnerHTML={{ __html: movie.item.content }}
            className="text-foreground/70 text-sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="border-primary border-l-[3px] pl-3 text-base">
            Thông tin phim
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <dl className="divide-border/50 divide-y text-sm">
            <div className="flex gap-4 py-2.5">
              <dt className="text-muted-foreground w-28 shrink-0">Chất lượng</dt>
              <dd className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="rounded">
                  {movie.item.quality}
                </Badge>
                <Badge variant="secondary" className="rounded">
                  {movie.item.lang}
                </Badge>
              </dd>
            </div>

            <div className="flex gap-4 py-2.5">
              <dt className="text-muted-foreground w-28 shrink-0">Năm phát hành</dt>
              <dd>{movie.item.year}</dd>
            </div>

            {movie.item.type === "series" && (
              <div className="flex gap-4 py-2.5">
                <dt className="text-muted-foreground w-28 shrink-0">Số tập</dt>
                <dd>{movie.item.episode_total}</dd>
              </div>
            )}

            <div className="flex gap-4 py-2.5">
              <dt className="text-muted-foreground w-28 shrink-0">Thể loại</dt>
              <dd className="flex flex-wrap gap-1.5">
                {movie.item.category.map((cat: MovieCategory) => (
                  <Badge
                    key={cat.slug}
                    variant="outline"
                    asChild
                    className="hover:border-primary/60 hover:text-primary rounded transition-colors"
                  >
                    <Link href={`/the-loai/${cat.slug}`}>{cat.name}</Link>
                  </Badge>
                ))}
              </dd>
            </div>

            <div className="flex gap-4 py-2.5">
              <dt className="text-muted-foreground w-28 shrink-0">Quốc gia</dt>
              <dd className="flex flex-wrap gap-1.5">
                {movie.item.country.map((c: MovieCountry) => (
                  <Badge
                    key={c.slug}
                    variant="outline"
                    asChild
                    className="hover:border-primary/60 hover:text-primary rounded transition-colors"
                  >
                    <Link href={`/quoc-gia/${c.slug}`}>{c.name}</Link>
                  </Badge>
                ))}
              </dd>
            </div>

            <div className="flex gap-4 py-2.5">
              <dt className="text-muted-foreground w-28 shrink-0">Diễn viên</dt>
              <dd className="text-foreground/80">
                {movie.item.actor.filter((a: string) => !!a).join(", ") || "Đang cập nhật"}
              </dd>
            </div>

            <div className="flex gap-4 py-2.5">
              <dt className="text-muted-foreground w-28 shrink-0">Đạo diễn</dt>
              <dd className="text-foreground/80">
                {movie.item.director?.join(", ") || "Đang cập nhật"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </section>
  );
}
