import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fetchCountries, fetchGenres } from "@/lib/api";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Xem phim trực tuyến",
    template: "%s | TRUONG-LX",
  },
  description:
    "Xem phim trực tuyến chất lượng cao. Phim lẻ, phim bộ, hoạt hình và nhiều hơn nữa.",
  keywords: ["xem phim", "phim online", "phim lẻ", "phim bộ", "vietsub"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [genres, countries] = await Promise.all([
    fetchGenres().catch(() => []),
    fetchCountries().catch(() => []),
  ]);

  return (
    <html
      lang="vi"
      className={`${dmSans.variable} ${playfairDisplay.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#0d0d0d] text-white antialiased">
        <Providers>
          <Navbar genres={genres} />
          <main className="pt-16">{children}</main>
          <Footer genres={genres} countries={countries} />
        </Providers>
      </body>
    </html>
  );
}
