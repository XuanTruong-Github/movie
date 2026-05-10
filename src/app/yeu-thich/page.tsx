import type { Metadata } from "next";
import { FavoritesPageClient } from "./FavoritesPageClient";

export const metadata: Metadata = { title: "Phim yêu thích" };

export default function FavoritesPage() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <FavoritesPageClient />
    </div>
  );
}
