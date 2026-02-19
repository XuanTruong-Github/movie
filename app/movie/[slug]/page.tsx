import MoviePlayer from "@/components/movie/player";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
          {movie.breadCrumb.map((item: any, index: number) => {
            if (item.isCurrent)
              return (
                <BreadcrumbItem key={index}>
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
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
      <MoviePlayer movie={movie.item} className="mb-10" />
      <h2>{movie.item.name}</h2>
      <p className="mb-4 text-muted-foreground">{movie.item.origin_name}</p>
      <p>
        {`Chất lượng: `}{" "}
        <Badge variant={"secondary"} className="rounded mr-1">
          {movie.item.quality}
        </Badge>
        <Badge variant={"secondary"} className="rounded">
          {movie.item.lang}
        </Badge>
      </p>
      {movie.item.type === "series" ? (
        <p>{`Số tập: ${movie.item.episode_total}`}</p>
      ) : null}
      <p>
        {`Thể loại: ${movie.item.category.map((item: any) => item.name).join(", ")}`}
      </p>
      <p>
        {`Quốc gia: ${movie.item.country.map((item: any) => item.name).join(", ")}`}
      </p>
      <p>{`Năm phát hành: ${movie.item.year}`}</p>
      <div
        dangerouslySetInnerHTML={{ __html: movie.item.content }}
        className="mt-4"
      ></div>
    </section>
  );
}
