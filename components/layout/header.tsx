import { api } from "@/configs/api";
import Link from "next/link";

import Search from "@/app/search/search";
import { Suspense } from "react";
import HeaderShell from "./header-shell";
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
    <HeaderShell>
      <section className="container flex h-14 items-center gap-x-4 lg:gap-x-6">
        <Link href="/" className="text-primary order-1 shrink-0 text-xl font-black tracking-tight">
          TruongLX
        </Link>
        <Suspense fallback={null}>
          <Menu categories={categories} countries={countries} />
        </Suspense>
        <Suspense fallback={null}>
          <Search className="order-2 ml-auto max-w-xs flex-1" />
        </Suspense>
      </section>
    </HeaderShell>
  );
}
