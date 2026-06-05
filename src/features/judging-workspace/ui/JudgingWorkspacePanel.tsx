import { AthleteQueue } from "../../../features/athlete-queue/ui/AthleteQueue";
import { JudgePanel } from "../../../features/judge-panel/ui/JudgePanel";
import type {
  Athlete,
  JudgeRecord,
  SavedResult,
  TournamentMeta
} from "../../../domain/ring/model/schemas";
import {
  formatScore,
  type JudgeActionDefinition,
  type PublishedScore
} from "../../../domain/ring/model/scoring";

interface JudgingWorkspacePanelProps {
  activeAthlete: Athlete | undefined;
  athletes: Athlete[];
  activeAthleteId: string;
  focusedJudgeId: string;
  judges: JudgeRecord[];
  judgeActions: JudgeActionDefinition[];
  meta: TournamentMeta;
  publishedScore: PublishedScore;
  savedResult: SavedResult | undefined;
  onSelectAthlete: (athleteId: string) => void;
  onFocusJudge: (judgeId: string) => void;
  onApplyAction: (judgeId: string, actionId: string) => void;
  onToggleConnection: (judgeId: string) => void;
  onNextAthlete: () => void;
  onResetRound: () => void;
  onSaveResult: () => void;
  onSaveResultAndAdvance: () => void;
}

export function JudgingWorkspacePanel({
  activeAthlete,
  athletes,
  activeAthleteId,
  focusedJudgeId,
  judges,
  judgeActions,
  meta,
  publishedScore,
  savedResult,
  onSelectAthlete,
  onFocusJudge,
  onApplyAction,
  onToggleConnection,
  onNextAthlete,
  onResetRound,
  onSaveResult,
  onSaveResultAndAdvance
}: JudgingWorkspacePanelProps) {
  return (
    <section className="section-shell">
      <div className="section-intro">
        <div>
          <span className="eyebrow">Pestana de operacion</span>
          <h2>Jueceo y calificacion</h2>
        </div>
        <p>
          Usa esta vista para conducir la evaluacion del atleta activo, aplicar
          deducciones por juez y guardar el resultado final antes de avanzar.
        </p>
      </div>

      <div className="judging-layout">
        <AthleteQueue
          activeAthleteId={activeAthleteId}
          athletes={athletes}
          onSelect={onSelectAthlete}
        />

        <section className="stage-panel">
          <div className="stage-shell">
            <div className="athlete-card">
              <span className="eyebrow">Atleta en pantalla</span>
              <h2>{activeAthlete?.name ?? "Sin atleta seleccionado"}</h2>
              <p>
                {activeAthlete
                  ? `${activeAthlete.division} - ${activeAthlete.category}`
                  : `${meta.branch} - ${meta.categoryLabel}`}
              </p>
              <div className="athlete-meta">
                <span>{activeAthlete?.club ?? meta.venue}</span>
                <span>{activeAthlete?.poomsae ?? meta.modality}</span>
                <span>{activeAthlete?.ageBand ?? meta.roundName}</span>
                {activeAthlete?.seed ? <span>Seed {activeAthlete.seed}</span> : null}
              </div>
            </div>

            <div className="scoreboard-card">
              <span className="score-label">Promedio publicado</span>
              <strong className="score-display">
                {publishedScore.finalScore.toFixed(2)}
              </strong>
              <p>
                {meta.judgeCount >= 5
                  ? "Descarta el score mas alto y mas bajo."
                  : "Promedia todos los jueces activos."}
              </p>
            </div>

            <div className="control-bar">
              <button className="primary-button" onClick={onNextAthlete} type="button">
                Siguiente atleta
              </button>
              <button className="ghost-button" onClick={onResetRound} type="button">
                Reiniciar score
              </button>
            </div>
          </div>

          <div className="judge-grid">
            {judges.map((judge) => (
              <JudgePanel
                key={judge.id}
                actions={judgeActions}
                isFocused={focusedJudgeId === judge.id}
                judge={judge}
                onAction={onApplyAction}
                onFocus={onFocusJudge}
                onToggleConnection={onToggleConnection}
              />
            ))}
          </div>
        </section>

        <aside className="panel scoring-side-panel">
          <div className="panel-heading">
            <span className="eyebrow">Publicacion rapida</span>
            <h2>Control del score</h2>
          </div>

          <div className="result-hero compact-hero">
            <div>
              <span className="score-label">Score actual</span>
              <strong className="result-score">
                {formatScore(publishedScore.finalScore)}
              </strong>
            </div>
            <p>
              {activeAthlete
                ? `${activeAthlete.name} - ${activeAthlete.poomsae}`
                : "Selecciona un atleta para comenzar"}
            </p>
            <div className="result-hero-actions">
              <button
                className="ghost-button"
                disabled={!activeAthlete}
                onClick={onSaveResult}
                type="button"
              >
                Guardar resultado
              </button>
              <button
                className="primary-button"
                disabled={!activeAthlete}
                onClick={onSaveResultAndAdvance}
                type="button"
              >
                Guardar y siguiente
              </button>
            </div>
            <small className="result-save-note">
              {savedResult
                ? `Ultimo guardado: ${new Date(savedResult.savedAt).toLocaleTimeString("es-MX")}`
                : "Aun no se guarda un resultado oficial para este atleta."}
            </small>
          </div>

          <div className="quick-note-list">
            <article className="quick-note">
              <strong>Atajos del ring</strong>
              <p>
                Flechas aplican deducciones, `R` reinicia, `N` avanza y `S`
                guarda y pasa al siguiente.
              </p>
            </article>

            <article className="quick-note">
              <strong>Ring activo</strong>
              <p>
                {meta.eventName} - {meta.roundName} - {meta.categoryLabel}
              </p>
            </article>
          </div>
        </aside>
      </div>
    </section>
  );
}
