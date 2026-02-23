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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/configs/api";
import { Metadata } from "next";
import { Fragment } from "react/jsx-runtime";

async function getMovie(slug: string) {
  try {
    const response = await api(`/phim/${slug}`);
    if (!response.ok) throw new Error(response.statusText);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovie(slug);

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

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const movie = await getMovie(slug);

  return (
    <section className="container py-10">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {movie.breadCrumb.map((item: any, index: number) => {
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
        <MoviePlayer movie={movie.item} className="mb-10" />
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {movie.item.status === "trailer" ? "Trailer" : ""} {movie.item.name}
          </CardTitle>
          <CardDescription>{movie.item.origin_name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            dangerouslySetInnerHTML={{ __html: movie.item.content }}
            className="text-foreground/70 text-sm"
          ></div>
        </CardContent>
      </Card>
      <h4 className="mb-4">Thông tin phim</h4>
      <div className="grid grid-cols-2 lg:w-1/2">
        <div className="">
          <p>Chất lượng</p>
          <div className="mb-2">
            <Badge variant={"secondary"} className="rounded mr-1">
              {movie.item.quality}
            </Badge>
            <Badge variant={"secondary"} className="rounded">
              {movie.item.lang}
            </Badge>
          </div>
          {movie.item.type === "series" ? (
            <>
              <p>Số tập</p>
              <p className="text-sm text-foreground/70 mb-2">
                {movie.item.episode_total}
              </p>
            </>
          ) : null}

          <p>Thể loại</p>
          <p className="text-sm text-foreground/70 mb-2">
            {movie.item.category.map((item: any) => item.name).join(", ")}
          </p>
          <p>Quốc gia</p>
          <p className="text-sm text-foreground/70 mb-2">
            {movie.item.country.map((item: any) => item.name).join(", ")}
          </p>
        </div>
        <div className="">
          <p>Năm phát hành</p>
          <p className="text-sm text-foreground/70 mb-2">{movie.item.year}</p>

          <p>Diễn viên</p>
          <p className="text-sm text-foreground/70 mb-2">
            {movie.item.actor.filter((item: string) => !!item).join(", ") ||
              "Đang cập nhật"}
          </p>

          <p>Đạo diễn</p>
          <p className="text-sm text-foreground/70 mb-6">
            {movie.item?.director?.join(", ") || "Đang cập nhật"}
          </p>
        </div>
      </div>
    </section>
  );
}
