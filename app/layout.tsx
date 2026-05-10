import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col bg-black text-white">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
