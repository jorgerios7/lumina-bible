import { FavoriteCard } from "@/src/components/lumina/views/favorites/FavoriteCard";
import type { Favorite } from "@backend/types/lumina";

type FavoritesGridProps = {
  favorites: Favorite[];
  onOpenFavorite: (favorite: Favorite) => void;
};

export function FavoritesGrid({ favorites, onOpenFavorite }: FavoritesGridProps) {
  return (
    <div className="cards-grid">
      {favorites.map((favorite) => (
        <FavoriteCard
          favorite={favorite}
          key={favorite.id}
          onOpenFavorite={onOpenFavorite}
        />
      ))}
    </div>
  );
}
