"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { MovieGrid } from "@/components/movie/MovieGrid";
import { HistoryList } from "@/components/favorites/HistoryList";
import { Separator } from "@/components/ui/separator";

export function FavoritesPageClient() {
  const { favorites } = useFavorites();

  return (
    <div className="space-y-12">
      <section>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white/90 italic mb-8">
          Phim yêu thích
        </h1>
        {favorites.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            Bạn chưa thêm phim nào vào danh sách yêu thích.
          </div>
        ) : (
          <MovieGrid movies={favorites} />
        )}
      </section>

      <Separator className="bg-white/[0.06]" />

      <HistoryList />
    </div>
  );
}
