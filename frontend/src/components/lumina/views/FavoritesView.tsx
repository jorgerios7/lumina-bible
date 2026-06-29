import { FavoritesGrid } from "@/src/components/lumina/views/favorites/FavoritesGrid";
import type { Favorite } from "@backend/types/lumina";

export function FavoritesView({
  favorites,
  onOpenFavorite,
}: {
  favorites: Favorite[];
  onOpenFavorite: (favorite: Favorite) => void;
}) {
  return (
    <div className="view-stack">
      <div className="section-header">
        <h2>Favoritos</h2>
      </div>
      {favorites.length === 0 ? (
        <p className="muted">Nenhum favorito encontrado.</p>
      ) : (
        <FavoritesGrid favorites={favorites} onOpenFavorite={onOpenFavorite} />
      )}
    </div>
  );
}
