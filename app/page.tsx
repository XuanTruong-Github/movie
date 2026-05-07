import PhimMoiCapNhat from "@/components/home/phim-moi-cap-nhat";
import SectionMovies from "@/components/home/section-movies";
import { api } from "@/configs/api";
import { toOpenGraphType } from "@/lib/metadata";
import { MovieListResponse } from "@/lib/types";
import { Metadata } from "next";

async function getData(): Promise<MovieListResponse | null> {
  try {
    const response = await api("/home", { next: { revalidate: 120 } });
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
      <PhimMoiCapNhat data={data} />
      <SectionMovies type="phim-chieu-rap" className="mb-6 lg:mb-10" />
      <SectionMovies type="phim-le" className="mb-6 lg:mb-10" />
      <SectionMovies type="phim-bo" />
    </>
  );
}
