import type { NodePanelTab } from "@/src/components/lumina/tree/types";

type NodePanelTabsProps = {
  activeTab: NodePanelTab;
  notesCount: number;
  onChangeTab: (tab: NodePanelTab) => void;
};

export function NodePanelTabs({ activeTab, notesCount, onChangeTab }: NodePanelTabsProps) {
  return (
    <div className="panel-tabs">
      <button className={activeTab === "summary" ? "active" : ""} onClick={() => onChangeTab("summary")}>
        Resumo
      </button>
      <button className={activeTab === "verses" ? "active" : ""} onClick={() => onChangeTab("verses")}>
        Versiculos
      </button>
      <button className={activeTab === "notes" ? "active" : ""} onClick={() => onChangeTab("notes")}>
        Anotacoes ({notesCount})
      </button>
    </div>
  );
}
