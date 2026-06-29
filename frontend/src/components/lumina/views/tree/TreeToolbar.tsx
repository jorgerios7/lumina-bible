import { Icon } from "@/src/components/common/Icon";

type TreeToolbarProps = {
  query: string;
  onChangeQuery: (value: string) => void;
  onCollapseAll: () => void;
  onExpandAll: () => void;
};

export function TreeToolbar({
  query,
  onChangeQuery,
  onCollapseAll,
  onExpandAll,
}: TreeToolbarProps) {
  return (
    <div className="tree-toolbar">
      <div className="search-field">
        <Icon name="search" />
        <input
          className="text-field"
          placeholder="Buscar na arvore..."
          value={query}
          onChange={(event) => onChangeQuery(event.target.value)}
        />
      </div>
      <div className="button-row">
        <button className="secondary-button" onClick={onExpandAll}>
          <Icon name="plus" />
          Expandir tudo
        </button>
        <button className="secondary-button" onClick={onCollapseAll}>
          <Icon name="chevron" />
          Recolher
        </button>
      </div>
    </div>
  );
}
