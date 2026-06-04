import type { Athlete } from "../../../domain/ring/model/schemas";

interface AthleteQueueProps {
  athletes: Athlete[];
  activeAthleteId: string;
  onSelect: (athleteId: string) => void;
}

export function AthleteQueue({
  athletes,
  activeAthleteId,
  onSelect
}: AthleteQueueProps) {
  return (
    <section className="panel panel-scroll">
      <div className="panel-heading">
        <span className="eyebrow">Orden de salida</span>
        <h2>Cola de atletas</h2>
      </div>

      <div className="queue-list">
        {athletes
          .slice()
          .sort((left, right) => left.order - right.order)
          .map((athlete) => {
            const isActive = athlete.id === activeAthleteId;

            return (
              <button
                key={athlete.id}
                className={`queue-card${isActive ? " is-active" : ""}`}
                onClick={() => onSelect(athlete.id)}
                type="button"
              >
                <div>
                  <span className="queue-order">#{athlete.order}</span>
                  <strong>{athlete.name}</strong>
                </div>
                <small>
                  {athlete.division} - {athlete.poomsae}
                </small>
              </button>
            );
          })}
      </div>
    </section>
  );
}
