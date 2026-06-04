import type { TournamentMeta } from "../../../domain/ring/model/schemas";

interface ProductHomePanelProps {
  eventCount: number;
  athleteCount: number;
  resultCount: number;
  meta: TournamentMeta;
}

export function ProductHomePanel({
  eventCount,
  athleteCount,
  resultCount,
  meta
}: ProductHomePanelProps) {
  return (
    <section className="landing-shell">
      <div className="landing-hero">
        <div className="landing-copy">
          <span className="eyebrow">Software de taekwondo poomsae</span>
          <h2>Opera eventos con continuidad, claridad y resultados auditables</h2>
          <p>
            TKD-Software esta pensado para organizadores, jueces y personal de mesa
            que necesitan capturar atletas, conducir el jueceo y guardar resultados
            sin depender del internet del recinto.
          </p>

          <div className="landing-metrics">
            <article className="landing-metric-card">
              <span>Eventos locales</span>
              <strong>{eventCount}</strong>
            </article>
            <article className="landing-metric-card">
              <span>Atletas cargados</span>
              <strong>{athleteCount}</strong>
            </article>
            <article className="landing-metric-card">
              <span>Resultados guardados</span>
              <strong>{resultCount}</strong>
            </article>
          </div>
        </div>

        <aside className="landing-aside">
          <article className="landing-card accent-card">
            <span className="eyebrow">Que hacemos</span>
            <h3>Control operativo para competencias de formas</h3>
            <p>
              El sistema centraliza la configuracion del evento, la cola de atletas,
              las deducciones de jueces y la publicacion del score final.
            </p>
          </article>

          <article className="landing-card">
            <span className="eyebrow">Como se usa</span>
            <ol className="landing-steps">
              <li>Crea un evento y define la ronda, la categoria y los jueces.</li>
              <li>Registra atletas con siembra, ranking y poomsae.</li>
              <li>Pasa al jueceo, guarda resultados y revisa posiciones.</li>
            </ol>
          </article>
        </aside>
      </div>

      <div className="landing-grid">
        <article className="landing-card">
          <span className="eyebrow">Ventaja principal</span>
          <h3>Local-first de verdad</h3>
          <p>
            La intencion del producto es seguir funcionando aunque falle la red del
            recinto. La nube despues servira como respaldo y sincronizacion, no como
            dependencia del ring.
          </p>
        </article>

        <article className="landing-card">
          <span className="eyebrow">Modo actual</span>
          <h3>{meta.eventName}</h3>
          <p>
            Ring activo: {meta.ringName}. Ronda: {meta.roundName}. Categoria:
            {" "}
            {meta.categoryLabel}. Modalidad: {meta.modality}.
          </p>
        </article>

        <article className="landing-card">
          <span className="eyebrow">Proximo enfoque</span>
          <h3>Ramas y persistencia fuerte</h3>
          <p>
            Las siguientes fases naturales son generar llaves de eliminacion,
            manejar clasificados y mover la persistencia local a SQLite dentro del
            shell desktop.
          </p>
        </article>
      </div>
    </section>
  );
}
