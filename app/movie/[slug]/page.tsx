import MoviePlayer from "@/components/movie/player";
import { api } from "@/configs/api";
import MovieProvider from "@/providers/movie-provider";
import { Metadata } from "next";

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
      images:  movie.seoOnPage.og_image.map((img: string) => ({
        url: `${movie.APP_DOMAIN_CDN_IMAGE}${img}`,
      })),
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const movie = await getMovie(slug);

  return (
    <MovieProvider dataServer={movie}>
      <section className="container py-10">
        <MoviePlayer className="mb-4" movie={movie.item} />
        <h2>{movie.item.name}</h2>
        <div dangerouslySetInnerHTML={{ __html: movie.item.content }}></div>
      </section>
    </MovieProvider>
  );
}
