import {
  formatScore,
  type PublishedScore
} from "../../../domain/ring/model/scoring";
import type {
  Athlete,
  JudgeRecord
} from "../../../domain/ring/model/schemas";

interface ResultPanelProps {
  athlete: Athlete | undefined;
  judges: JudgeRecord[];
  result: PublishedScore;
}

export function ResultPanel({
  athlete,
  judges,
  result
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
    </section>
  );
}
