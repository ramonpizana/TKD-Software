# Research: Event Operations Workspace

## Decision 1: Modelar cada categoria o bracket como un evento local independiente

**Decision**: Tratar cada evento dentro de la app como una unidad operativa
autonoma con su propio roster, atleta activo, jueces y resultados.

**Rationale**: Esto simplifica la operacion del ring y evita mezclar resultados
entre categorias. Tambien se alinea con el flujo real de torneo, donde cada
bracket se gestiona por separado aunque pertenezca al mismo campeonato.

**Alternatives considered**:

- Un solo evento global con todas las categorias mezcladas: rechazado porque
  complica filtros, aumenta riesgo operativo y hace mas fragil la vista del ring.
- Multiples rondas y brackets completamente generados desde el primer MVP:
  rechazado porque aumenta demasiado el alcance antes de asegurar registro y
  resultados persistentes.

## Decision 2: Priorizar persistencia local inmediata antes que nube

**Decision**: Guardar eventos, atletas y resultados directamente en almacenamiento
local del prototipo actual.

**Rationale**: Los ejemplos de mercado revisados destacan guardado de sesiones,
uso en tiempo real y operacion continua aun cuando hay cambios o problemas de
infraestructura. UPTKD enfatiza gestion integral y resultados inmediatos, TKD
Scoring resalta guardado automatico de sesiones, y KPNP describe una operacion
oficial capaz de actualizarse por software sin requerir nuevo hardware.

**Alternatives considered**:

- Persistencia remota inmediata: rechazada porque contradice el enfoque
  local-first del repositorio.
- No persistir resultados hasta integrar SQLite: rechazado porque dejaria la
  fase actual sin valor operativo real.

## Decision 3: Guardar resultados como registros confirmados por atleta

**Decision**: Guardar un resultado confirmado por atleta dentro del evento
activo, con score final, desglose de jueces, hora y metadatos utiles para
posiciones.

**Rationale**: El resultado proyectado en pantalla no es suficiente para una
operacion oficial. El software debe poder cerrar un atleta, conservar su score y
listar posiciones. Permitir sobreescritura del resultado del mismo atleta reduce
errores cuando hay correcciones oficiales.

**Alternatives considered**:

- Avanzar de atleta sin persistir score: rechazado porque pierde auditabilidad.
- Crear multiples resultados por atleta sin control: rechazado porque genera
  ambiguedad al momento de clasificar.

## Decision 4: Dejar la puerta abierta a SQLite en Tauri

**Decision**: Mantener la persistencia aislada en una capa de dominio para que
pueda migrarse despues de LocalStorage a SQLite local en el shell de escritorio.

**Rationale**: El repo ya viene encaminado a Tauri para el host del ring. A
mediano plazo, SQLite sera mejor fuente de verdad local para backups,
exportaciones y recuperacion. Aun asi, LocalStorage permite mover rapido el MVP
sin bloquear el avance.

**Alternatives considered**:

- Implementar SQLite desde esta misma fase: rechazada por alcance y porque la
  instalacion desktop todavia esta consolidandose.
- Mantener el estado completamente acoplado al componente React: rechazado
  porque dificulta migracion, pruebas y recuperacion.
