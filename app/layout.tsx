import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCategories, getCountries } from "@/lib/kkphim";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TruongLX-Movie",
    template: "%s | TruongLX-Movie",
  },
  description:
    "Xem phim online miễn phí. Phim lẻ, phim bộ, hoạt hình, phim chiếu rạp, vietsub chất lượng cao.",
  keywords: ["phim online", "xem phim", "phim vietsub", "phim chiếu rạp", "anime"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [catsResult, countriesResult] = await Promise.allSettled([
    getCategories(),
    getCountries(),
  ]);
  const categories = catsResult.status === "fulfilled" ? catsResult.value : [];
  const countries = countriesResult.status === "fulfilled" ? countriesResult.value : [];

  return (
    <html lang="vi" className="h-full bg-black">
      <body className="min-h-full flex flex-col text-white">
        <SiteHeader categories={categories} countries={countries} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
