import {
  formatScore,
  type PublishedScore
} from "../../../domain/ring/model/scoring";
import type {
  Athlete,
  JudgeRecord,
  SavedResult
} from "../../../domain/ring/model/schemas";
import type { StandingRow } from "../../../domain/tournament/model/workspace-state";

interface ResultPanelProps {
  athlete: Athlete | undefined;
  judges: JudgeRecord[];
  result: PublishedScore;
  savedResult: SavedResult | undefined;
  standings: StandingRow[];
  onSaveResult: () => void;
  onSaveResultAndAdvance: () => void;
}

export function ResultPanel({
  athlete,
  judges,
  result,
  savedResult,
  standings,
  onSaveResult,
  onSaveResultAndAdvance
}: ResultPanelProps) {
  return (
    <section className="panel panel-scroll">
      <div className="panel-heading">
        <span className="eyebrow">Publicacion</span>
        <h2>Resultado proyectado</h2>
      </div>

      <div className="result-hero">
        <div>
          <span className="score-label">Score final</span>
          <strong className="result-score">{formatScore(result.finalScore)}</strong>
        </div>
        <p>
          {athlete
            ? `${athlete.name} - ${athlete.poomsae}`
            : "Selecciona un atleta para comenzar"}
        </p>
        <div className="result-hero-actions">
          <button
            className="ghost-button"
            disabled={!athlete}
            onClick={onSaveResult}
            type="button"
          >
            Guardar resultado
          </button>
          <button
            className="primary-button"
            disabled={!athlete}
            onClick={onSaveResultAndAdvance}
            type="button"
          >
            Guardar y siguiente
          </button>
        </div>
        <small className="result-save-note">
          {savedResult
            ? `Resultado guardado: ${new Date(savedResult.savedAt).toLocaleTimeString("es-MX")}`
            : "Aun no se guarda un resultado oficial para este atleta."}
        </small>
      </div>

      <div className="result-table">
        {result.judges.map((judgeSummary) => {
          const judge = judges.find((entry) => entry.id === judgeSummary.id);
          const isDropped = result.droppedJudgeIds.includes(judgeSummary.id);

          return (
            <div
              key={judgeSummary.id}
              className={`result-row${isDropped ? " is-dropped" : ""}`}
            >
              <div>
                <strong>{judgeSummary.name}</strong>
                <small>
                  {judge?.connected ? "Conectado" : "Fuera de linea"} -{" "}
                  {judgeSummary.deductions} eventos
                </small>
              </div>
              <div className="result-values">
                <span>{formatScore(judgeSummary.technical)}</span>
                <span>{formatScore(judgeSummary.presentation)}</span>
                <strong>{formatScore(judgeSummary.total)}</strong>
              </div>
            </div>
          );
        })}
      </div>

      <div className="result-note">
        <span>Se usan {result.usedJudgeIds.length} jueces para el promedio.</span>
        <span>
          {result.droppedJudgeIds.length > 0
            ? `Se descartaron ${result.droppedJudgeIds.join(", ")}.`
            : "No hubo descarte automatico en esta configuracion."}
        </span>
      </div>

      <div className="subsection-heading standings-heading">
        <div>
          <span className="eyebrow">Clasificacion</span>
          <h3>Posiciones guardadas</h3>
        </div>
        <span>{standings.length} resultados</span>
      </div>

      <div className="standings-table">
        {standings.length === 0 ? (
          <div className="empty-state">
            Cuando guardes resultados apareceran aqui las posiciones del evento.
          </div>
        ) : (
          standings.map((entry, index) => (
            <div key={entry.id} className="standings-row">
              <div>
                <strong>
                  {index + 1}. {entry.athleteName}
                </strong>
                <small>
                  {entry.poomsae}
                  {entry.club ? ` · ${entry.club}` : ""}
                </small>
              </div>

              <div className="standings-side">
                {entry.seed ? <span className="seed-badge">Seed {entry.seed}</span> : null}
                <strong>{formatScore(entry.finalScore)}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
