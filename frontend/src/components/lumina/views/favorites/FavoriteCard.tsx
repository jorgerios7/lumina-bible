import { Icon } from "@/src/components/common/Icon";
import type { Favorite } from "@backend/types/lumina";

type FavoriteCardProps = {
  favorite: Favorite;
  onOpenFavorite: (favorite: Favorite) => void;
};

export function FavoriteCard({ favorite, onOpenFavorite }: FavoriteCardProps) {
  return (
    <button className="favorite-card" onClick={() => onOpenFavorite(favorite)}>
      <Icon name="star" />
      <h3>{favorite.title}</h3>
      <p className="muted">{favorite.type}</p>
    </button>
  );
}
