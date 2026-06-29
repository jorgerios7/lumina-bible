import { MetricCard } from "@/src/components/profile/components/MetricCard";

type ProfileMetricsGridProps = {
  activeStudiesCount: number;
  completedNodesCount: number;
  favoritesCount: number;
  inProgressNodesCount: number;
};

export function ProfileMetricsGrid({
  activeStudiesCount,
  completedNodesCount,
  favoritesCount,
  inProgressNodesCount,
}: ProfileMetricsGridProps) {
  return (
    <section className="metrics-grid" aria-label="Resumo do usuario">
      <MetricCard label="Estudos ativos" value={activeStudiesCount} />
      <MetricCard label="Nodes concluidos" value={completedNodesCount} />
      <MetricCard label="Em andamento" value={inProgressNodesCount} />
      <MetricCard label="Favoritos" value={favoritesCount} />
    </section>
  );
}
