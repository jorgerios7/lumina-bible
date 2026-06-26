import { Icon } from "@/src/components/common/Icon";

export function AuthLoadingScreen() {
  return (
    <main className="auth-screen">
      <section className="auth-panel" aria-live="polite">
        <span className="brand-mark">
          <Icon name="leaf" />
        </span>
        <h1 className="auth-title">Lumina Bible</h1>
        <p className="auth-copy">Verificando sessao do Firebase...</p>
      </section>
    </main>
  );
}
