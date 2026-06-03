import { useDesktopRuntimeInfo } from "../../../app/runtime/useDesktopRuntimeInfo";
import { EventWorkspacePanel } from "../../../features/event-workspace/ui/EventWorkspacePanel";
import { JudgePanel } from "../../../features/judge-panel/ui/JudgePanel";
import { ResultPanel } from "../../../features/result-panel/ui/ResultPanel";
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

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">TKD-Software</span>
          <h1>Ring control para poomsae confiable</h1>
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

      <main className="main-grid">
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

        <section className="stage-panel">
          <div className="stage-shell">
            <div className="athlete-card">
              <span className="eyebrow">Atleta en pantalla</span>
              <h2>{activeAthlete?.name ?? "Sin atleta"}</h2>
              <p>
                {activeAthlete
                  ? `${activeAthlete.division} - ${activeAthlete.category}`
                  : `${snapshot.meta.branch} - ${snapshot.meta.categoryLabel}`}
              </p>
              <div className="athlete-meta">
                <span>{activeAthlete?.club ?? snapshot.meta.venue}</span>
                <span>{activeAthlete?.poomsae ?? snapshot.meta.modality}</span>
                <span>{activeAthlete?.ageBand ?? snapshot.meta.roundName}</span>
                {activeAthlete?.seed ? <span>Seed {activeAthlete.seed}</span> : null}
              </div>
            </div>

            <div className="scoreboard-card">
              <span className="score-label">Promedio publicado</span>
              <strong className="score-display">
                {publishedScore.finalScore.toFixed(2)}
              </strong>
              <p>
                {snapshot.meta.judgeCount >= 5
                  ? "Descarta el score mas alto y mas bajo."
                  : "Promedia todos los jueces activos."}
              </p>
            </div>

            <div className="control-bar">
              <button className="primary-button" onClick={nextAthlete} type="button">
                Siguiente atleta
              </button>
              <button className="ghost-button" onClick={resetRound} type="button">
                Reiniciar score
              </button>
            </div>
          </div>

          <div className="judge-grid">
            {snapshot.judges.map((judge) => (
              <JudgePanel
                key={judge.id}
                actions={judgeActions}
                isFocused={snapshot.focusedJudgeId === judge.id}
                judge={judge}
                onAction={applyAction}
                onFocus={focusJudge}
                onToggleConnection={toggleConnection}
              />
            ))}
          </div>
        </section>

        <ResultPanel
          athlete={activeAthlete}
          judges={snapshot.judges}
          onSaveResult={saveResult}
          onSaveResultAndAdvance={saveResultAndAdvance}
          result={publishedScore}
          savedResult={activeResult}
          standings={standings}
        />
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
