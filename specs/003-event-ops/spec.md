# Feature Specification: Event Operations Workspace

**Feature Branch**: `003-event-ops`

**Created**: 2026-06-03

**Status**: Draft

**Input**: User description: "Agregar gestion de eventos, registro de atletas, resultados persistentes y avance competitivo para poomsae"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Preparar un evento competitivo (Priority: P1)

Como organizador u operador del ring, quiero crear un evento y registrar a los
atletas antes de la competencia para llegar al inicio del jueceo con el orden de
salida, la categoria y los datos de cada participante ya cargados.

**Why this priority**: Sin este flujo previo, el ring sigue dependiendo de
datos manuales o improvisados y no puede operar como software real de evento.

**Independent Test**: Puede probarse creando un evento nuevo, capturando varios
atletas y cerrando o recargando la app para confirmar que el evento y la lista
siguen disponibles.

**Acceptance Scenarios**:

1. **Given** que el operador abre la app por primera vez, **When** crea un
   nuevo evento y completa sus datos base, **Then** el evento queda disponible
   para ser editado y usado en sesiones posteriores.
2. **Given** un evento activo, **When** el operador registra atletas con nombre,
   organizacion, categoria competitiva, poomsae y ranking o siembra,
   **Then** la lista del evento se actualiza y cada atleta queda listo para
   seleccionarse como participante activo.
3. **Given** que el operador refresca la app o la vuelve a abrir, **When** la
   persistencia local se recupera, **Then** el evento activo, sus atletas y sus
   configuraciones siguen disponibles sin recaptura manual.

---

### User Story 2 - Guardar resultados por atleta (Priority: P1)

Como operador del ring, quiero guardar el promedio final y el desglose de jueces
de cada atleta para que los resultados no se pierdan al avanzar al siguiente
participante.

**Why this priority**: El valor central del software no es solo mostrar el score
en pantalla, sino conservarlo de manera auditable y util para clasificaciones.

**Independent Test**: Puede probarse calificando a un atleta, guardando su
resultado, avanzando al siguiente y verificando que el resultado anterior queda
listado en la tabla de posiciones.

**Acceptance Scenarios**:

1. **Given** un atleta activo con deducciones aplicadas por los jueces,
   **When** el operador guarda el resultado, **Then** la app registra score
   final, hora, atleta y desglose de jueces en el evento activo.
2. **Given** un atleta con resultado ya guardado, **When** el operador vuelve a
   puntuarlo y guarda de nuevo, **Then** el resultado previo del mismo atleta se
   reemplaza por la version mas reciente en lugar de duplicarse.
3. **Given** que el operador guarda un resultado y reinicia o recarga la app,
   **When** vuelve a abrir el evento, **Then** el historial de resultados y la
   tabla de posiciones permanecen disponibles.

---

### User Story 3 - Administrar varios brackets o rondas (Priority: P2)

Como organizador, quiero crear mas de un evento competitivo dentro del mismo
software para poder operar distintas categorias, ramas o rondas sin mezclar sus
atletas ni sus resultados.

**Why this priority**: En torneos reales se operan multiples grupos de forma
paralela o secuencial, y separar cada bracket reduce errores operativos.

**Independent Test**: Puede probarse creando dos eventos distintos, registrando
atletas y resultados diferentes en cada uno, y validando que el cambio de evento
no mezcla listas ni scores.

**Acceptance Scenarios**:

1. **Given** que ya existe un evento activo, **When** el operador crea un nuevo
   evento, **Then** la app mantiene ambos eventos y permite alternar entre ellos.
2. **Given** dos eventos con atletas distintos, **When** el operador cambia de
   evento activo, **Then** la vista del ring, la cola de atletas y la tabla de
   resultados reflejan solo la informacion del evento seleccionado.

---

### Edge Cases

- Que ocurre si se crea un evento nuevo sin atletas y aun asi se entra al ring.
- Como se comporta el sistema si se elimina al atleta actualmente seleccionado.
- Como se reemplaza un resultado ya guardado cuando hubo una correccion o
  repeticion oficial.
- Como se conserva el orden competitivo cuando se registran atletas con ranking
  o siembra parcial y otros sin ranking.
- Como se evita mezclar resultados de una categoria con otra cuando existen
  multiples eventos cargados localmente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir crear y mantener multiples eventos
  competitivos locales dentro de la misma instalacion.
- **FR-002**: El sistema MUST permitir definir por evento al menos nombre del
  evento, ring, sede, modalidad, rama, ronda, categoria visible y numero de
  jueces.
- **FR-003**: El sistema MUST permitir registrar atletas por evento con orden de
  salida, nombre, organizacion, pais o codigo, categoria competitiva, poomsae y
  datos opcionales de ranking o siembra.
- **FR-004**: El sistema MUST conservar el evento activo, su roster y sus
  resultados entre sesiones sin depender del internet del recinto.
- **FR-005**: El sistema MUST permitir seleccionar manualmente al atleta activo
  desde la lista del evento.
- **FR-006**: El sistema MUST guardar por atleta el resultado final publicado y
  el desglose necesario para auditoria de jueces.
- **FR-007**: El sistema MUST permitir volver a guardar el resultado de un mismo
  atleta sin crear duplicados para esa misma ronda o evento.
- **FR-008**: El sistema MUST mostrar una tabla de posiciones del evento activo
  ordenada por resultado guardado y con criterio de desempate estable.
- **FR-009**: El sistema MUST permitir cambiar entre eventos sin perder el
  estado guardado de cada uno.
- **FR-010**: El sistema SHOULD dejar preparado el modelo para evolucionar a
  rondas eliminatorias, cortes, semifinales y finales sin rediseñar la base del
  evento.

### Key Entities *(include if feature involves data)*

- **Competition Event**: Representa un bracket o grupo operativo con su propia
  configuracion, cola de atletas, estado de jueces y resultados guardados.
- **Athlete Entry**: Representa a un participante cargado previamente para un
  evento con sus datos competitivos y su posicion de salida.
- **Saved Result**: Representa el score final confirmado para un atleta junto
  con hora de guardado y desglose de jueces.
- **Event Workspace**: Representa el conjunto local de eventos disponibles en la
  app y cual de ellos se encuentra activo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un operador puede crear un evento nuevo y registrar 16 atletas en
  menos de 10 minutos sin usar hojas externas.
- **SC-002**: El software conserva eventos, atletas y resultados tras un
  refresh o reapertura sin requerir recaptura manual.
- **SC-003**: El resultado guardado de un atleta aparece en la tabla de
  posiciones en menos de 2 segundos despues de la accion de guardado.
- **SC-004**: Un operador puede alternar entre dos eventos distintos sin mezclar
  atletas ni resultados en las vistas del ring.

## Assumptions

- En v1 de esta fase, cada evento local representa una sola categoria o bracket
  operativo; si un torneo tiene varias categorias, se cargan como eventos
  separados.
- El almacenamiento inicial puede ser local al dispositivo del ring mientras se
  prepara una capa de persistencia mas robusta para escritorio.
- La generacion automatica de llaves o brackets de eliminacion completa queda
  fuera del MVP inmediato de esta fase, pero el modelo debe permitir agregarla.
- La sincronizacion a nube, inscripciones remotas e importaciones masivas pueden
  llegar despues sin bloquear este MVP local-first.
