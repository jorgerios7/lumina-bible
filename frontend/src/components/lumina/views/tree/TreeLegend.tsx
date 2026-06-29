import { Icon } from "@/src/components/common/Icon";

export function TreeLegend() {
  return (
    <div className="legend">
      <span>
        <i className="status-dot" />
        Nao iniciado
      </span>
      <span>
        <i className="status-dot in_progress" />
        Em andamento
      </span>
      <span>
        <i className="status-dot completed" />
        Concluido
      </span>
      <span>
        <Icon name="star" />
        Favorito
      </span>
    </div>
  );
}
