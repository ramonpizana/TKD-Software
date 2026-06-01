import { useEffect, useState } from "react";
import { AthleteQueue } from "./components/AthleteQueue";
import { JudgePanel } from "./components/JudgePanel";
import { ResultPanel } from "./components/ResultPanel";
import { demoSnapshot } from "./data/demoTournament";
import {
  actionIdFromKeyboard,
  applyJudgeAction,
  calculatePublishedScore,
  judgeActionCatalog,
  resetJudgeDeck,
  toggleJudgeConnection
} from "./lib/scoring";
import { loadSnapshot, saveSnapshot } from "./lib/persistence";
import type { RingSnapshot } from "./lib/schemas";

function stampSnapshot(snapshot: RingSnapshot): RingSnapshot {
  return {
    ...snapshot,
    meta: {
      ...snapshot.meta,
      updatedAt: new Date().toISOString()
    }
  };
}

export default function App() {
  const [snapshot, setSnapshot] = useState<RingSnapshot>(() =>
    loadSnapshot(demoSnapshot)
  );

  useEffect(() => {
    saveSnapshot(snapshot);
  }, [snapshot]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) {
        return;
      }

      if (event.key === "r" || event.key === "R") {
        setSnapshot((current) =>
          stampSnapshot({
            ...current,
            judges: resetJudgeDeck(current.judges)
          })
        );
        return;
      }

      if (event.key === "n" || event.key === "N") {
        setSnapshot((current) => advanceAthlete(current));
        return;
      }

      const actionId = actionIdFromKeyboard(event.key);
      if (!actionId) {
        return;
      }

      setSnapshot((current) => {
        const judge = current.judges.find(
          (entry) => entry.id === current.focusedJudgeId
        );
        const action = judgeActionCatalog.find((entry) => entry.id === actionId);

        if (!judge || !action) {
          return current;
        }

        return stampSnapshot({
          ...current,
          judges: current.judges.map((entry) =>
            entry.id === judge.id ? applyJudgeAction(entry, action) : entry
          )
        });
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeAthlete = snapshot.athletes.find(
    (athlete) => athlete.id === snapshot.activeAthleteId
  );
  const result = calculatePublishedScore(snapshot.judges, snapshot.meta.judgeCount);

  function selectAthlete(athleteId: string) {
    setSnapshot((current) =>
      stampSnapshot({
        ...current,
        activeAthleteId: athleteId,
        judges: resetJudgeDeck(current.judges)
      })
    );
  }

  function focusJudge(judgeId: string) {
    setSnapshot((current) =>
      stampSnapshot({
        ...current,
        focusedJudgeId: judgeId
      })
    );
  }

  function applyAction(judgeId: string, actionId: string) {
    const action = judgeActionCatalog.find((entry) => entry.id === actionId);
    if (!action) {
      return;
    }

    setSnapshot((current) =>
      stampSnapshot({
        ...current,
        focusedJudgeId: judgeId,
        judges: current.judges.map((judge) =>
          judge.id === judgeId ? applyJudgeAction(judge, action) : judge
        )
      })
    );
  }

  function toggleConnection(judgeId: string) {
    setSnapshot((current) =>
      stampSnapshot({
        ...current,
        judges: toggleJudgeConnection(current.judges, judgeId)
      })
    );
  }

  function resetRound() {
    setSnapshot((current) =>
      stampSnapshot({
        ...current,
        judges: resetJudgeDeck(current.judges)
      })
    );
  }

  function nextAthlete() {
    setSnapshot((current) => advanceAthlete(current));
  }

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
            <span>{snapshot.meta.ringName}</span>
            <strong>{snapshot.meta.eventName}</strong>
          </div>
        </div>
      </header>

      <main className="main-grid">
        <AthleteQueue
          activeAthleteId={snapshot.activeAthleteId}
          athletes={snapshot.athletes}
          onSelect={selectAthlete}
        />

        <section className="stage-panel">
          <div className="stage-shell">
            <div className="athlete-card">
              <span className="eyebrow">Atleta en pantalla</span>
              <h2>{activeAthlete?.name ?? "Sin atleta"}</h2>
              <p>
                {activeAthlete?.division} · {activeAthlete?.category}
              </p>
              <div className="athlete-meta">
                <span>{activeAthlete?.club}</span>
                <span>{activeAthlete?.poomsae}</span>
                <span>{activeAthlete?.ageBand}</span>
              </div>
            </div>

            <div className="scoreboard-card">
              <span className="score-label">Promedio publicado</span>
              <strong className="score-display">{result.finalScore.toFixed(2)}</strong>
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
                actions={judgeActionCatalog}
                isFocused={snapshot.focusedJudgeId === judge.id}
                judge={judge}
                onAction={applyAction}
                onFocus={focusJudge}
                onToggleConnection={toggleConnection}
              />
            ))}
          </div>
        </section>

        <ResultPanel athlete={activeAthlete} judges={snapshot.judges} result={result} />
      </main>

      <footer className="footer-strip">
        <span>Judge focus: {snapshot.focusedJudgeId}</span>
        <span>Atajos: flechas aplican deducciones, `R` reinicia, `N` avanza.</span>
        <span>Ultima actualizacion: {new Date(snapshot.meta.updatedAt).toLocaleTimeString("es-MX")}</span>
      </footer>
    </div>
  );
}

function advanceAthlete(snapshot: RingSnapshot): RingSnapshot {
  const sortedAthletes = snapshot.athletes
    .slice()
    .sort((left, right) => left.order - right.order);
  const currentIndex = sortedAthletes.findIndex(
    (athlete) => athlete.id === snapshot.activeAthleteId
  );
  const nextAthlete = sortedAthletes[(currentIndex + 1) % sortedAthletes.length];

  return stampSnapshot({
    ...snapshot,
    activeAthleteId: nextAthlete.id,
    judges: resetJudgeDeck(snapshot.judges)
  });
}

