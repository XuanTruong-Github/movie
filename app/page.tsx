import { api } from "@/configs/api";
import { Metadata } from "next";
import Image from "next/image";

async function getData() {
  try {
    const response = await api("/home");
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

  return {
    title: data.seoOnPage.titleHead,
    description: data.seoOnPage.descriptionHead,

    openGraph: {
      type: data.seoOnPage.og_type,
      title: data.seoOnPage.titleHead,
      description: data.seoOnPage.descriptionHead,
      images: data.seoOnPage.og_image.map((img: string) => ({
        url: `${data.APP_DOMAIN_CDN_IMAGE}${img}`,
      })),
    },
  };
}

export default async function Home() {
  return <section></section>;
}
