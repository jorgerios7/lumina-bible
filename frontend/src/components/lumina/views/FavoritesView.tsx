import { Icon } from "@/src/components/common/Icon";
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
        <div className="cards-grid">
          {favorites.map((favorite) => (
            <button className="favorite-card" key={favorite.id} onClick={() => onOpenFavorite(favorite)}>
              <Icon name="star" />
              <h3>{favorite.title}</h3>
              <p className="muted">{favorite.type}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
