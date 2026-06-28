"use client";

import type {
  Favorite,
  Note,
  Study,
  StudyNode,
  User,
  UserSettings,
} from "@backend/types/lumina";
import { Icon } from "@/src/components/common/Icon";
import { computeStudyProgress } from "@backend/services/studies/study-tree-engine";

type ProfileScreenProps = {
  user: User;
  studies: Study[];
  nodes: StudyNode[];
  favorites: Favorite[];
  notes: Note[];
  settings: UserSettings;
  onLogout: () => void;
  onOpenFavorites: () => void;
  onOpenNotes: () => void;
  onOpenSettings: () => void;
  onOpenStudy: (studyId: string) => void;
};

export function ProfileScreen({
  user,
  studies,
  nodes,
  favorites,
  notes,
  settings,
  onLogout,
  onOpenFavorites,
  onOpenNotes,
  onOpenSettings,
  onOpenStudy,
}: ProfileScreenProps) {
  const activeStudies = studies.filter((study) => study.status === "active");
  const completedNodes = nodes.filter((node) => node.status === "completed").length;
  const inProgressNodes = nodes.filter((node) => node.status === "in_progress").length;
  const recentStudies = [...studies]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3);
  const primaryStudy = recentStudies[0];
  const primaryProgress = primaryStudy
    ? computeStudyProgress(primaryStudy, nodes)
    : { completedNodes: 0, percentage: 0, totalNodes: 0 };

  return (
    <div className="profile-screen">
      <section className="profile-hero" aria-labelledby="profile-title">
        <div className="profile-avatar" aria-hidden="true">
          {getInitials(user.name)}
        </div>
        <div className="profile-identity">
          <span className="profile-kicker">Conta Lumina</span>
          <h2 id="profile-title">{user.name}</h2>
          <p>{user.email}</p>
          <div className="profile-badges">
            <span>Autenticado</span>
            <span>{settings.preferredTranslation}</span>
            <span>{formatDate(user.createdAt)}</span>
          </div>
        </div>
        <div className="profile-actions">
          <button className="secondary-button" onClick={onOpenSettings}>
            <Icon name="settings" />
            Configurar
          </button>
          <button className="ghost-button" onClick={onLogout}>
            Sair
          </button>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Resumo do usuario">
        <MetricCard label="Estudos ativos" value={activeStudies.length} />
        <MetricCard label="Nodes concluidos" value={completedNodes} />
        <MetricCard label="Em andamento" value={inProgressNodes} />
        <MetricCard label="Favoritos" value={favorites.length} />
      </section>

      <section className="profile-content-grid">
        <article className="profile-panel profile-progress-panel">
          <div className="section-header">
            <div>
              <h3>Jornada atual</h3>
              <span className="muted">
                {primaryStudy ? primaryStudy.title : "Nenhum estudo ativo"}
              </span>
            </div>
            {primaryStudy && (
              <span
                className="progress-ring"
                style={
                  {
                    "--progress": `${primaryProgress.percentage}%`,
                  } as React.CSSProperties
                }
              >
                {primaryProgress.percentage}%
              </span>
            )}
          </div>
          {primaryStudy ? (
            <>
              <p>{primaryStudy.summary}</p>
              <div className="progress-line">
                <span style={{ width: `${primaryProgress.percentage}%` }} />
              </div>
              <div className="profile-progress-meta">
                <span>
                  {primaryProgress.completedNodes}/{primaryProgress.totalNodes} nodes
                </span>
                <span>Atualizado {formatDate(primaryStudy.updatedAt)}</span>
              </div>
              <button
                className="primary-button"
                onClick={() => onOpenStudy(primaryStudy.id)}
              >
                <Icon name="tree" />
                Continuar estudo
              </button>
            </>
          ) : (
            <p className="muted">Crie um estudo para iniciar sua jornada.</p>
          )}
        </article>

        <article className="profile-panel">
          <div className="section-header">
            <h3>Biblioteca pessoal</h3>
          </div>
          <div className="profile-shortcut-list">
            <button onClick={onOpenFavorites}>
              <span>
                <Icon name="star" />
                Favoritos
              </span>
              <strong>{favorites.length}</strong>
            </button>
            <button onClick={onOpenNotes}>
              <span>
                <Icon name="note" />
                Anotacoes
              </span>
              <strong>{notes.length}</strong>
            </button>
            <button onClick={onOpenSettings}>
              <span>
                <Icon name="settings" />
                Preferencias
              </span>
              <strong>{settings.explanationLevel}</strong>
            </button>
          </div>
        </article>

        <article className="profile-panel">
          <div className="section-header">
            <h3>Estudos recentes</h3>
          </div>
          <div className="profile-study-list">
            {recentStudies.map((study) => {
              const progress = computeStudyProgress(study, nodes);

              return (
                <button key={study.id} onClick={() => onOpenStudy(study.id)}>
                  <span>
                    <strong>{study.title}</strong>
                    <small>{study.summary}</small>
                  </span>
                  <em>{progress.percentage}%</em>
                </button>
              );
            })}
          </div>
        </article>

        <article className="profile-panel">
          <div className="section-header">
            <h3>Conta e leitura</h3>
          </div>
          <dl className="profile-details">
            <div>
              <dt>Tema</dt>
              <dd>{settings.theme}</dd>
            </div>
            <div>
              <dt>Fonte</dt>
              <dd>{settings.fontSize}</dd>
            </div>
            <div>
              <dt>Nivel IA</dt>
              <dd>{settings.explanationLevel}</dd>
            </div>
            <div>
              <dt>ID</dt>
              <dd>{user.id}</dd>
            </div>
          </dl>
        </article>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="metric-card">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponivel";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
