"use client";

import { TrashIcon } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { MovieGrid } from "@/components/movie-grid";
import { Empty } from "@/components/ui/empty";

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Phim yêu thích</h1>
        {favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
            style={{ color: "#8e8e93" }}
          >
            <TrashIcon className="size-4" />
            Xóa tất cả
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <Empty
          title="Chưa có phim yêu thích"
          description="Nhấn vào biểu tượng tim trên poster phim để thêm vào danh sách yêu thích."
        />
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </div>
  );
}
