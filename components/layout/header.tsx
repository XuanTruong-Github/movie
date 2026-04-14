import { api } from "@/configs/api";
import Link from "next/link";

import Search from "@/app/search/search";
import { Suspense } from "react";
import Menu from "./menu";

async function getMenu(type: string) {
  try {
    const response = await api(type);
    if (!response.ok) throw new Error(response.statusText);
    const { data } = await response.json();
    return data?.items || [];
  } catch (error) {
    console.log("error: ", error);
    return [];
  }
}
export default async function Header() {
  const categories = await getMenu("/the-loai");
  const countries = await getMenu("/quoc-gia");
  return (
    <header className="shadow">
      <section className="flex items-center py-4 gap-x-4 container">
        <Link href="/" className="font-black text-primary text-2xl">
          TruongLX
        </Link>
        <Suspense fallback={null}>
          <Menu categories={categories} countries={countries} />
        </Suspense>
        <Suspense fallback={null}>
          <Search className="ml-auto flex-1 max-w-sm" />
        </Suspense>
      </section>
    </header>
  );
}
