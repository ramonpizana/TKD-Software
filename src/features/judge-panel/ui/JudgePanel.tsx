import {
  formatScore,
  getJudgeTotal,
  type JudgeActionDefinition
} from "../../../domain/ring/model/scoring";
import type { JudgeRecord } from "../../../domain/ring/model/schemas";

interface JudgePanelProps {
  judge: JudgeRecord;
  actions: JudgeActionDefinition[];
  isFocused: boolean;
  onFocus: (judgeId: string) => void;
  onAction: (judgeId: string, actionId: string) => void;
  onToggleConnection: (judgeId: string) => void;
}

export function JudgePanel({
  judge,
  actions,
  isFocused,
  onFocus,
  onAction,
  onToggleConnection
}: JudgePanelProps) {
  return (
    <article className={`judge-card${isFocused ? " is-focused" : ""}`}>
      <header className="judge-header">
        <button
          className="judge-title"
          onClick={() => onFocus(judge.id)}
          type="button"
        >
          <span
            className={`connection-dot${judge.connected ? " online" : " offline"}`}
          />
          <strong>{judge.name}</strong>
        </button>

        <button
          className="ghost-button"
          onClick={() => onToggleConnection(judge.id)}
          type="button"
        >
          {judge.connected ? "Simular corte" : "Reconectar"}
        </button>
      </header>

      <div className="judge-metrics">
        <div>
          <span>Tecnica</span>
          <strong>{formatScore(judge.technical)}</strong>
        </div>
        <div>
          <span>Presentacion</span>
          <strong>{formatScore(judge.presentation)}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>{formatScore(getJudgeTotal(judge))}</strong>
        </div>
      </div>

      <div className="judge-actions">
        {actions.map((action) => (
          <button
            key={action.id}
            className="action-button"
            disabled={!judge.connected}
            onClick={() => onAction(judge.id, action.id)}
            type="button"
          >
            <span>{action.label}</span>
            <kbd>{action.keyHint}</kbd>
          </button>
        ))}
      </div>

      <footer className="judge-footer">
        <span>{judge.deductions.length} deducciones</span>
        <span>{judge.connected ? "Listo" : "Sin red local"}</span>
      </footer>
    </article>
  );
}

