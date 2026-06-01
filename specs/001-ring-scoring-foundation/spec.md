# Feature Specification: Ring Scoring Foundation

**Feature Branch**: `[001-ring-scoring-foundation]`

**Created**: 2026-05-31

**Status**: Draft

**Input**: User description: "Crear TKD-Software como software confiable para
competencias de taekwondo poomsae, con scoring por jueces, soporte para
controles o remotos, visualizacion en pantalla, relacion con atletas y enfoque
en estabilidad."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Operar un ring sin depender de internet (Priority: P1)

Como organizador u operador del ring, quiero seleccionar al atleta activo,
registrar deducciones y publicar el score final desde un solo equipo local para
que la competencia siga avanzando aunque falle la conectividad externa.

**Why this priority**: El dolor principal reportado es el retraso de eventos por
fallas tecnicas, por lo que la continuidad operativa del ring es el valor
minimo indispensable.

**Independent Test**: Puede probarse cargando la cola de atletas, seleccionando
un atleta, registrando deducciones y publicando un score sin depender de
servicios externos.

**Acceptance Scenarios**:

1. **Given** una cola local de atletas y jueces disponibles, **When** el
   operador activa a un atleta, **Then** la pantalla del ring muestra sus datos
   y queda lista para iniciar scoring.
2. **Given** que no existe internet, **When** se registran deducciones y se
   calcula el resultado, **Then** el sistema publica un score final y conserva
   el estado local de la sesion.

---

### User Story 2 - Registrar deducciones por juez con reglas claras (Priority: P1)

Como juez u operador de respaldo, quiero aplicar deducciones configuradas por
entrada para que el sistema convierta esas acciones en score tecnico,
presentacion y resultado final sin calculos manuales.

**Why this priority**: El producto pierde valor si no resuelve la parte central
del scoring y la publicacion consistente del promedio final.

**Independent Test**: Puede probarse aplicando varias deducciones por juez y
verificando el total individual, el descarte de extremos cuando aplique y el
promedio publicado.

**Acceptance Scenarios**:

1. **Given** un panel de cinco jueces con score inicial, **When** se aplican
   deducciones tecnicas y de presentacion, **Then** cada juez actualiza su total
   sin bajar de cero en cada categoria.
2. **Given** una configuracion de cinco jueces, **When** todos completan su
   evaluacion, **Then** el sistema descarta automaticamente el score mas alto y
   el mas bajo antes de publicar el promedio final.

---

### User Story 3 - Mantener el contexto competitivo del atleta (Priority: P2)

Como organizador, quiero vincular el score con el atleta, su categoria y la
forma ejecutada para que el resultado sea recuperable, visible y exportable en
una fase posterior.

**Why this priority**: Sin contexto del atleta, el score pierde trazabilidad y
no sirve para integrarse con un torneo real.

**Independent Test**: Puede probarse seleccionando distintos atletas de una cola
predefinida y confirmando que el score se reinicia para cada nueva salida.

**Acceptance Scenarios**:

1. **Given** una cola con atletas registrados, **When** el operador avanza al
   siguiente atleta, **Then** la pantalla cambia el contexto mostrado y reinicia
   el scoring del nuevo round.

## Edge Cases

- Que ocurre si un juez intenta deducir mas puntos de los disponibles en
  tecnica o presentacion.
- Como responde el ring si un remoto o juez se desconecta a mitad de la
  presentacion.
- Que se publica cuando la configuracion usa tres jueces en lugar de cinco o
  siete.
- Como se recupera el ultimo estado despues de un refresh o reinicio rapido.
- Como evita el sistema aplicar dos veces el mismo evento en fases posteriores
  de red local.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir seleccionar un atleta activo desde una
  cola local de competencia.
- **FR-002**: El sistema MUST mostrar para el atleta activo su nombre, club o
  pais, division, categoria, rango de edad y poomsae asignado.
- **FR-003**: El sistema MUST iniciar cada juez con score tecnico de 4.0 y
  score de presentacion de 6.0 en modo recognized poomsae.
- **FR-004**: El sistema MUST permitir registrar deducciones tecnicas y de
  presentacion mediante acciones configuradas.
- **FR-005**: El sistema MUST impedir que una categoria individual de score baje
  de 0.0.
- **FR-006**: El sistema MUST recalcular el total de cada juez inmediatamente
  despues de cada deduccion valida.
- **FR-007**: El sistema MUST calcular y publicar el score final conforme a la
  configuracion de cantidad de jueces del ring.
- **FR-008**: El sistema MUST descartar automaticamente el score mas alto y el
  mas bajo cuando la configuracion del ring asi lo requiera.
- **FR-009**: El sistema MUST conservar localmente el snapshot de la sesion para
  permitir recuperacion basica del estado.
- **FR-010**: El sistema MUST ofrecer un fallback manual desde el equipo del
  operador cuando un juez no este conectado.
- **FR-011**: El sistema MUST permitir reiniciar el scoring al cambiar de atleta
  o por accion explicita del operador.
- **FR-012**: El sistema MUST dejar lista la estructura para asociar resultados
  a atletas y sincronizarlos en fases posteriores.
- **FR-013**: El sistema MUST validar la forma de los datos persistidos antes de
  reutilizarlos en la aplicacion.
- **FR-014**: El sistema MUST exponer un flujo de calidad del repositorio con
  pruebas, lint, typecheck y escaneo basico de secretos.

### Key Entities *(include if feature involves data)*

- **Athlete**: competidor identificado con nombre, club, pais, division,
  categoria, rango de edad, orden de salida y poomsae.
- **JudgeRecord**: estado del juez para el atleta activo, incluyendo score
  tecnico, score de presentacion, conectividad y deducciones aplicadas.
- **RingSnapshot**: estado autoritativo local del ring con metadata del evento,
  atletas, juez enfocado y panel de jueces.
- **Deduction Event**: accion puntual que reduce tecnica o presentacion con
  timestamp y origen.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El operador puede cambiar de atleta y dejar el ring listo para el
  siguiente competidor en menos de 5 segundos.
- **SC-002**: Cada deduccion valida se refleja en la UI y el score publicado en
  menos de 100 ms en ejecucion local.
- **SC-003**: El motor de scoring pasa pruebas unitarias para reglas de clamp y
  descarte de extremos antes de merge.
- **SC-004**: El repositorio pasa `npm run validate` en un entorno limpio de CI.

## Assumptions

- La primera fase cubre recognized poomsae y no intenta aun freestyle ni
  brackets completos multi-ring.
- La primera implementacion usa una UI local del operador con teclado y botones
  como fallback, mientras se define el protocolo de remotos.
- La sincronizacion con base de datos oficial de atletas es posterior a esta
  fundacion y no bloquea el uso local del ring.
- El despliegue productivo final puede requerir una app de escritorio o un host
  local dedicado, aunque esta fase inicie como prototipo web.

