import { type FormEvent, useState } from "react";
import type {
  Athlete,
  SavedResult,
  TournamentMeta
} from "../../../domain/ring/model/schemas";
import type { AthleteDraft } from "../../../domain/tournament/model/workspace-state";

interface EventSummary {
  eventId: string;
  eventName: string;
  roundName: string;
  categoryLabel: string;
  athleteCount: number;
  resultCount: number;
  status: TournamentMeta["status"];
}

interface EventWorkspacePanelProps {
  eventSummaries: EventSummary[];
  activeEventId: string;
  meta: TournamentMeta;
  athletes: Athlete[];
  results: SavedResult[];
  activeAthleteId: string;
  onCreateEvent: () => void;
  onSelectEvent: (eventId: string) => void;
  onUpdateMeta: (updates: Partial<TournamentMeta>) => void;
  onSelectAthlete: (athleteId: string) => void;
  onAddAthlete: (draft: AthleteDraft) => void;
  onRemoveAthlete: (athleteId: string) => void;
}

interface AthleteFormState {
  name: string;
  club: string;
  state: string;
  countryCode: string;
  division: string;
  category: string;
  ageBand: string;
  poomsae: string;
  seed: string;
  rankingPoints: string;
}

export function EventWorkspacePanel({
  eventSummaries,
  activeEventId,
  meta,
  athletes,
  results,
  activeAthleteId,
  onCreateEvent,
  onSelectEvent,
  onUpdateMeta,
  onSelectAthlete,
  onAddAthlete,
  onRemoveAthlete
}: EventWorkspacePanelProps) {
  const resultsByAthleteId = new Map(
    results.map((result) => [result.athleteId, result])
  );

  return (
    <section className="panel panel-scroll workspace-panel">
      <div className="panel-heading workspace-heading">
        <div>
          <span className="eyebrow">Operacion previa</span>
          <h2>Evento y roster</h2>
        </div>

        <button className="primary-button" onClick={onCreateEvent} type="button">
          Nuevo evento
        </button>
      </div>

      <div className="event-chip-list">
        {eventSummaries.map((event) => {
          const isActive = event.eventId === activeEventId;

          return (
            <button
              key={event.eventId}
              className={`event-chip${isActive ? " is-active" : ""}`}
              onClick={() => onSelectEvent(event.eventId)}
              type="button"
            >
              <strong>{event.eventName}</strong>
              <small>
                {event.roundName} - {event.categoryLabel}
              </small>
              <span>
                {event.athleteCount} atletas - {event.resultCount} resultados
              </span>
            </button>
          );
        })}
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Nombre del evento</span>
          <input
            onChange={(event) =>
              onUpdateMeta({ eventName: event.target.value })
            }
            type="text"
            value={meta.eventName}
          />
        </label>

        <label className="field">
          <span>Sede</span>
          <input
            onChange={(event) => onUpdateMeta({ venue: event.target.value })}
            type="text"
            value={meta.venue}
          />
        </label>

        <label className="field">
          <span>Ring</span>
          <input
            onChange={(event) => onUpdateMeta({ ringName: event.target.value })}
            type="text"
            value={meta.ringName}
          />
        </label>

        <label className="field">
          <span>Fecha</span>
          <input
            onChange={(event) => onUpdateMeta({ eventDate: event.target.value })}
            type="date"
            value={meta.eventDate}
          />
        </label>

        <label className="field">
          <span>Modalidad</span>
          <input
            onChange={(event) => onUpdateMeta({ modality: event.target.value })}
            type="text"
            value={meta.modality}
          />
        </label>

        <label className="field">
          <span>Rama</span>
          <input
            onChange={(event) => onUpdateMeta({ branch: event.target.value })}
            type="text"
            value={meta.branch}
          />
        </label>

        <label className="field">
          <span>Ronda</span>
          <input
            onChange={(event) => onUpdateMeta({ roundName: event.target.value })}
            type="text"
            value={meta.roundName}
          />
        </label>

        <label className="field">
          <span>Categoria visible</span>
          <input
            onChange={(event) =>
              onUpdateMeta({ categoryLabel: event.target.value })
            }
            type="text"
            value={meta.categoryLabel}
          />
        </label>

        <label className="field">
          <span>Jueces</span>
          <select
            onChange={(event) =>
              onUpdateMeta({ judgeCount: Number(event.target.value) })
            }
            value={meta.judgeCount}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={7}>7</option>
          </select>
        </label>
      </div>

      <div className="subsection-heading">
        <div>
          <span className="eyebrow">Registro</span>
          <h3>Alta de atletas</h3>
        </div>
        <span className={`status-tag status-${meta.status}`}>
          {meta.status === "setup"
            ? "Configuracion"
            : meta.status === "running"
              ? "En curso"
              : "Completado"}
        </span>
      </div>

      <AthleteRegistrationForm
        key={`${activeEventId}:${meta.branch}:${meta.categoryLabel}`}
        meta={meta}
        onAddAthlete={onAddAthlete}
      />

      <div className="subsection-heading">
        <div>
          <span className="eyebrow">Orden de salida</span>
          <h3>Roster del evento</h3>
        </div>
        <span>{athletes.length} atletas</span>
      </div>

      <div className="roster-list">
        {athletes.length === 0 ? (
          <div className="empty-state">
            Registra atletas para comenzar la operacion del evento.
          </div>
        ) : (
          athletes
            .slice()
            .sort((left, right) => left.order - right.order)
            .map((athlete) => {
              const isActive = athlete.id === activeAthleteId;
              const savedResult = resultsByAthleteId.get(athlete.id);

              return (
                <article
                  key={athlete.id}
                  className={`roster-card${isActive ? " is-active" : ""}`}
                >
                  <button
                    className="roster-main"
                    onClick={() => onSelectAthlete(athlete.id)}
                    type="button"
                  >
                    <div className="roster-title">
                      <span className="queue-order">#{athlete.order}</span>
                      <strong>{athlete.name}</strong>
                    </div>
                    <small>
                      {athlete.division} - {athlete.poomsae}
                    </small>
                    <small>
                      {athlete.club}
                      {athlete.state ? ` - ${athlete.state}` : ""}
                    </small>
                  </button>

                  <div className="roster-side">
                    {savedResult ? (
                      <span className="result-badge">{savedResult.finalScore.toFixed(2)}</span>
                    ) : (
                      <span className="pending-badge">Pendiente</span>
                    )}

                    <button
                      className="ghost-button roster-remove"
                      onClick={() => onRemoveAthlete(athlete.id)}
                      type="button"
                    >
                      Quitar
                    </button>
                  </div>
                </article>
              );
            })
        )}
      </div>
    </section>
  );
}

function AthleteRegistrationForm({
  meta,
  onAddAthlete
}: {
  meta: TournamentMeta;
  onAddAthlete: (draft: AthleteDraft) => void;
}) {
  const [formState, setFormState] = useState<AthleteFormState>(() =>
    createAthleteFormState(meta)
  );

  function handleAthleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onAddAthlete({
      name: formState.name.trim(),
      club: formState.club.trim(),
      state: formState.state.trim(),
      countryCode: formState.countryCode.trim().toUpperCase(),
      division: formState.division.trim(),
      category: formState.category.trim(),
      ageBand: formState.ageBand.trim(),
      poomsae: formState.poomsae.trim(),
      seed: parseOptionalInteger(formState.seed),
      rankingPoints: parseOptionalNumber(formState.rankingPoints)
    });

    setFormState(createAthleteFormState(meta));
  }

  return (
    <form className="stack-form" onSubmit={handleAthleteSubmit}>
      <div className="form-grid compact-grid">
        <label className="field">
          <span>Nombre</span>
          <input
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                name: event.target.value
              }))
            }
            required
            type="text"
            value={formState.name}
          />
        </label>

        <label className="field">
          <span>Club / universidad / delegacion</span>
          <input
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                club: event.target.value
              }))
            }
            required
            type="text"
            value={formState.club}
          />
        </label>

        <label className="field">
          <span>Estado</span>
          <input
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                state: event.target.value
              }))
            }
            type="text"
            value={formState.state}
          />
        </label>

        <label className="field">
          <span>Pais</span>
          <input
            maxLength={3}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                countryCode: event.target.value.toUpperCase()
              }))
            }
            required
            type="text"
            value={formState.countryCode}
          />
        </label>

        <label className="field">
          <span>Rama / division</span>
          <input
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                division: event.target.value
              }))
            }
            required
            type="text"
            value={formState.division}
          />
        </label>

        <label className="field">
          <span>Categoria</span>
          <input
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                category: event.target.value
              }))
            }
            required
            type="text"
            value={formState.category}
          />
        </label>

        <label className="field">
          <span>Edad / subgrupo</span>
          <input
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                ageBand: event.target.value
              }))
            }
            required
            type="text"
            value={formState.ageBand}
          />
        </label>

        <label className="field">
          <span>Poomsae</span>
          <input
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                poomsae: event.target.value
              }))
            }
            required
            type="text"
            value={formState.poomsae}
          />
        </label>

        <label className="field">
          <span>Siembra</span>
          <input
            min={1}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                seed: event.target.value
              }))
            }
            type="number"
            value={formState.seed}
          />
        </label>

        <label className="field">
          <span>Puntos ranking</span>
          <input
            min={0}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                rankingPoints: event.target.value
              }))
            }
            step="0.01"
            type="number"
            value={formState.rankingPoints}
          />
        </label>
      </div>

      <button className="ghost-button" type="submit">
        Registrar atleta
      </button>
    </form>
  );
}

function createAthleteFormState(meta: TournamentMeta): AthleteFormState {
  return {
    name: "",
    club: "",
    state: "",
    countryCode: "MEX",
    division: meta.branch,
    category: meta.categoryLabel,
    ageBand: "",
    poomsae: "",
    seed: "",
    rankingPoints: ""
  };
}

function parseOptionalInteger(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseOptionalNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}
