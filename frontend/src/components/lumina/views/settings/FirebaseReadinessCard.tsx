type FirebaseReadinessCardProps = {
  firebaseReadiness: Array<{ name: string; configured: boolean }>;
};

export function FirebaseReadinessCard({ firebaseReadiness }: FirebaseReadinessCardProps) {
  return (
    <article className="settings-card">
      <h3>Firebase</h3>
      <div className="form-stack">
        {firebaseReadiness.map((item) => (
          <span className="muted" key={item.name}>
            {item.name}: {item.configured ? "configurado" : "pendente"}
          </span>
        ))}
      </div>
    </article>
  );
}
