import { Icon } from "@/src/components/common/Icon";

type TreeToolbarProps = {
  onCollapseAll: () => void;
  onExpandAll: () => void;
};

export function TreeToolbar({
  onCollapseAll,
  onExpandAll,
}: TreeToolbarProps) {
  return (
    <div className="tree-toolbar">
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
