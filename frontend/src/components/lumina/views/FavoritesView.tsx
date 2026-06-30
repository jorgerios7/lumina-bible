import { FavoritesGrid } from "@/src/components/lumina/views/favorites/FavoritesGrid";
import { matchesSearchQuery } from "@/src/components/lumina/utils/search";
import type { Favorite } from "@backend/types/lumina";

export function FavoritesView({
  favorites,
  query,
  onOpenFavorite,
}: {
  favorites: Favorite[];
  query: string;
  onOpenFavorite: (favorite: Favorite) => void;
}) {
  const filteredFavorites = favorites.filter((favorite) =>
    matchesSearchQuery(query, [favorite.title, favorite.type]),
  );

  return (
    <div className="view-stack">
      <div className="section-header">
        <h2>Favoritos</h2>
      </div>
      {filteredFavorites.length === 0 ? (
        <p className="muted">Nenhum favorito encontrado.</p>
      ) : (
        <FavoritesGrid favorites={filteredFavorites} onOpenFavorite={onOpenFavorite} />
      )}
    </div>
  );
}
