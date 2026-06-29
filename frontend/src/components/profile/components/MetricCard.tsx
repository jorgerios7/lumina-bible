type MetricCardProps = {
  label: string;
  value: number;
};

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <article className="metric-card">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
