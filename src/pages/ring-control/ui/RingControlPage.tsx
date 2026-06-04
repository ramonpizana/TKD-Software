import { useState } from "react";
import { useDesktopRuntimeInfo } from "../../../app/runtime/useDesktopRuntimeInfo";
import { EventResultsPanel } from "../../../features/event-results/ui/EventResultsPanel";
import { EventWorkspacePanel } from "../../../features/event-workspace/ui/EventWorkspacePanel";
import { JudgingWorkspacePanel } from "../../../features/judging-workspace/ui/JudgingWorkspacePanel";
import { ProductHomePanel } from "../../../features/product-home/ui/ProductHomePanel";
import {
  WorkspaceTabs,
  type WorkspaceTabId
} from "../../../features/workspace-tabs/ui/WorkspaceTabs";
import { useRingControl } from "../model/useRingControl";

export function RingControlPage() {
  const runtime = useDesktopRuntimeInfo();
  const {
    activeAthlete,
    activeResult,
    addAthlete,
    applyAction,
    createEvent,
    eventSummaries,
    focusJudge,
    judgeActions,
    nextAthlete,
    publishedScore,
    workspace,
    removeAthlete,
    resetRound,
    saveResult,
    saveResultAndAdvance,
    selectAthlete,
    selectEvent,
    snapshot,
    standings,
    toggleConnection,
    updateEventMeta
  } = useRingControl();
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>("home");
  const athleteCount = workspace.events.reduce(
    (total, event) => total + event.athletes.length,
    0
  );
  const resultCount = workspace.events.reduce(
    (total, event) => total + event.results.length,
    0
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-copy">
          <span className="eyebrow">TKD-Software</span>
          <h1>Scoring local-first para poomsae competitivo</h1>
          <p>
            Una consola pensada para crear eventos, conducir el jueceo y guardar
            resultados sin depender del internet del recinto.
          </p>
        </div>

        <div className="status-cluster">
          <div className="status-pill">
            <span className="status-led online" />
            <span>Modo local-first</span>
          </div>
          <div className="status-pill">
            <span
              className={`status-led${runtime.shell === "tauri" ? " online" : " offline"}`}
            />
            <span>{runtime.shell === "tauri" ? "Shell desktop" : "Prototipo web"}</span>
            <strong>{runtime.windowLabel ?? "main"}</strong>
          </div>
          <div className="status-pill">
            <span>{snapshot.meta.ringName}</span>
            <strong>{snapshot.meta.eventName}</strong>
          </div>
          <div className="status-pill">
            <span>{snapshot.meta.roundName}</span>
            <strong>{snapshot.meta.categoryLabel}</strong>
          </div>
        </div>
      </header>

      <main className="content-shell">
        <WorkspaceTabs activeTab={activeTab} onSelectTab={setActiveTab} />

        {activeTab === "home" ? (
          <ProductHomePanel
            athleteCount={athleteCount}
            eventCount={eventSummaries.length}
            meta={snapshot.meta}
            resultCount={resultCount}
          />
        ) : null}

        {activeTab === "setup" ? (
          <section className="section-shell">
            <div className="section-intro">
              <div>
                <span className="eyebrow">Pestana de configuracion</span>
                <h2>Crear evento y cargar atletas</h2>
              </div>
              <p>
                Usa esta vista antes de iniciar el ring para crear el evento,
                definir sede, jueces y ronda, y dejar lista la lista oficial de
                salida.
              </p>
            </div>

            <div className="setup-layout">
              <EventWorkspacePanel
                activeAthleteId={snapshot.activeAthleteId}
                activeEventId={snapshot.eventId}
                athletes={snapshot.athletes}
                eventSummaries={eventSummaries}
                meta={snapshot.meta}
                onAddAthlete={addAthlete}
                onCreateEvent={createEvent}
                onRemoveAthlete={removeAthlete}
                onSelectAthlete={selectAthlete}
                onSelectEvent={selectEvent}
                onUpdateMeta={updateEventMeta}
                results={snapshot.results}
              />
            </div>
          </section>
        ) : null}

        {activeTab === "judging" ? (
          <JudgingWorkspacePanel
            activeAthlete={activeAthlete}
            activeAthleteId={snapshot.activeAthleteId}
            athletes={snapshot.athletes}
            focusedJudgeId={snapshot.focusedJudgeId}
            judgeActions={judgeActions}
            judges={snapshot.judges}
            meta={snapshot.meta}
            onApplyAction={applyAction}
            onFocusJudge={focusJudge}
            onNextAthlete={nextAthlete}
            onResetRound={resetRound}
            onSaveResult={saveResult}
            onSaveResultAndAdvance={saveResultAndAdvance}
            onSelectAthlete={selectAthlete}
            onToggleConnection={toggleConnection}
            publishedScore={publishedScore}
            savedResult={activeResult}
          />
        ) : null}

        {activeTab === "results" ? (
          <EventResultsPanel
            athlete={activeAthlete}
            athleteCount={snapshot.athletes.length}
            judges={snapshot.judges}
            meta={snapshot.meta}
            onSaveResult={saveResult}
            onSaveResultAndAdvance={saveResultAndAdvance}
            result={publishedScore}
            savedResult={activeResult}
            standings={standings}
          />
        ) : null}
      </main>

      <footer className="footer-strip">
        <span>Judge focus: {snapshot.focusedJudgeId}</span>
        <span>Atajos: flechas aplican deducciones, `R` reinicia, `N` avanza, `S` guarda y sigue.</span>
        <span>
          Runtime: {runtime.shell}
          {runtime.appVersion ? ` ${runtime.appVersion}` : ""}
        </span>
        <span>
          Ultima actualizacion:{" "}
          {new Date(snapshot.meta.updatedAt).toLocaleTimeString("es-MX")}
        </span>
      </footer>
    </div>
  );
}
