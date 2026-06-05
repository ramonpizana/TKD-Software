import { ResultPanel } from "../../../features/result-panel/ui/ResultPanel";
import type {
  Athlete,
  JudgeRecord,
  SavedResult,
  TournamentMeta
} from "../../../domain/ring/model/schemas";
import type { PublishedScore } from "../../../domain/ring/model/scoring";
import type { StandingRow } from "../../../domain/tournament/model/workspace-state";

interface EventResultsPanelProps {
  athlete: Athlete | undefined;
  judges: JudgeRecord[];
  meta: TournamentMeta;
  result: PublishedScore;
  savedResult: SavedResult | undefined;
  standings: StandingRow[];
  athleteCount: number;
  onSaveResult: () => void;
  onSaveResultAndAdvance: () => void;
}

export function EventResultsPanel({
  athlete,
  judges,
  meta,
  result,
  savedResult,
  standings,
  athleteCount,
  onSaveResult,
  onSaveResultAndAdvance
}: EventResultsPanelProps) {
  const pendingCount = Math.max(athleteCount - standings.length, 0);

  return (
    <section className="section-shell">
      <div className="section-intro">
        <div>
          <span className="eyebrow">Pestana de evento</span>
          <h2>Seguimiento del evento y posiciones</h2>
        </div>
        <p>
          Esta vista te permite revisar el score proyectado, confirmar guardados y
          ver como se acomodan las posiciones del evento conforme avanza la ronda.
        </p>
      </div>

      <div className="results-layout">
        <div className="results-summary-grid">
          <article className="landing-card">
            <span className="eyebrow">Evento activo</span>
            <h3>{meta.eventName}</h3>
            <p>
              {meta.roundName} - {meta.categoryLabel} - {meta.ringName}
            </p>
          </article>

          <article className="landing-card">
            <span className="eyebrow">Avance</span>
            <h3>{standings.length} guardados</h3>
            <p>
              {pendingCount} atletas pendientes de cierre oficial en esta ronda.
            </p>
          </article>

          <article className="landing-card">
            <span className="eyebrow">Modalidad</span>
            <h3>{meta.modality}</h3>
            <p>
              {meta.branch} - {meta.eventDate} - {meta.venue}
            </p>
          </article>
        </div>

        <ResultPanel
          athlete={athlete}
          judges={judges}
          onSaveResult={onSaveResult}
          onSaveResultAndAdvance={onSaveResultAndAdvance}
          result={result}
          savedResult={savedResult}
          standings={standings}
        />
      </div>
    </section>
  );
}
