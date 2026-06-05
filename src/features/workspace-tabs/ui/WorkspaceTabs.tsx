export type WorkspaceTabId = "home" | "setup" | "judging" | "results";

interface WorkspaceTab {
  id: WorkspaceTabId;
  label: string;
  description: string;
}

const tabs: WorkspaceTab[] = [
  {
    id: "home",
    label: "Inicio",
    description: "Conoce el software y el flujo general del torneo"
  },
  {
    id: "setup",
    label: "Crear evento",
    description: "Configura el evento, atletas y orden de salida"
  },
  {
    id: "judging",
    label: "Jueceo",
    description: "Opera el ring, puntua y publica el score"
  },
  {
    id: "results",
    label: "Evento",
    description: "Consulta posiciones, guardados y seguimiento del evento"
  }
];

interface WorkspaceTabsProps {
  activeTab: WorkspaceTabId;
  onSelectTab: (tab: WorkspaceTabId) => void;
}

export function WorkspaceTabs({
  activeTab,
  onSelectTab
}: WorkspaceTabsProps) {
  return (
    <nav className="workspace-tabs" aria-label="Secciones principales" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          aria-selected={activeTab === tab.id}
          className={`workspace-tab${activeTab === tab.id ? " is-active" : ""}`}
          onClick={() => onSelectTab(tab.id)}
          role="tab"
          type="button"
        >
          <strong>{tab.label}</strong>
          <small>{tab.description}</small>
        </button>
      ))}
    </nav>
  );
}
