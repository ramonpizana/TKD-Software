# Feature Specification: SQLite Runtime Persistence

**Feature Branch**: `004-sqlite-runtime-persistence`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "Dejar lista la persistencia real local del
evento, aclarar donde vive la informacion y estabilizar lo necesario del shell
desktop para poder operar el host del ring con datos locales auditables"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guardar el torneo en base local real (Priority: P1)

Como operador del ring, quiero que el evento, los atletas y los resultados se
guarden en una base local del software de escritorio para no depender del
estado del navegador ni perder informacion al cerrar la app.

**Why this priority**: Sin persistencia local fuerte, el producto sigue siendo
un prototipo y no un host de ring confiable.

**Independent Test**: Puede probarse creando o editando un evento en escritorio,
cerrando y reabriendo la app, y verificando que la informacion siga disponible.

**Acceptance Scenarios**:

1. **Given** que la app corre dentro del shell desktop, **When** el operador
   guarda cambios de evento o resultados, **Then** el sistema persiste el
   workspace en una base SQLite local del dispositivo.
2. **Given** que la app se vuelve a abrir en el mismo equipo, **When** el
   operador entra al evento activo, **Then** el roster, resultados y estado del
   workspace se recuperan desde la base local.

---

### User Story 2 - Entender donde se guardan los datos (Priority: P1)

Como responsable tecnico del torneo, quiero saber que tipo de storage esta
activo y en que ubicacion se guarda la informacion para respaldarla o
diagnosticarla rapidamente.

**Why this priority**: El software debe ser transparente para soporte tecnico y
operacion de evento, especialmente cuando hay que revisar respaldos o fallos.

**Independent Test**: Puede probarse abriendo la app y validando que la UI
muestre el storage activo y la ruta esperada del archivo local cuando aplica.

**Acceptance Scenarios**:

1. **Given** que la app corre en desktop, **When** el operador revisa la vista
   principal, **Then** puede identificar que el storage activo es SQLite y la
   ubicacion esperada del archivo de base local.
2. **Given** que la app corre en modo web, **When** el operador revisa la vista
   principal, **Then** entiende que el fallback actual es `localStorage` del
   navegador o webview.

---

### User Story 3 - Degradar con gracia si el storage fuerte no esta disponible (Priority: P2)

Como operador del ring, quiero que la app caiga a un modo local de respaldo con
diagnostico claro si SQLite o el shell desktop no estan disponibles todavia.

**Why this priority**: La operacion del ring no debe quedar bloqueada por una
falla tecnica del shell durante desarrollo o contingencia.

**Independent Test**: Puede probarse forzando modo web o provocando fallo de
conexion SQLite y verificando que la app siga operando con mensaje claro de
fallback.

**Acceptance Scenarios**:

1. **Given** que la capa SQLite falla al inicializarse, **When** la app arranca,
   **Then** sigue operando con almacenamiento local alterno y muestra que esta
   en modo fallback.
2. **Given** que existe informacion previa en `localStorage`, **When** la app de
   escritorio encuentra una base vacia por primera vez, **Then** puede migrar el
   workspace existente hacia SQLite sin recaptura manual.

### Edge Cases

- Que ocurre si la base SQLite existe pero contiene un payload invalido o
  incompleto.
- Como se comporta la app si el archivo local no puede escribirse por permisos.
- Como se evita sobreescribir un workspace cargado antes de terminar la
  hidratacion del storage.
- Como se informa al operador que el shell desktop no arranco y sigue en modo
  web de desarrollo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST usar SQLite como persistencia primaria del
  workspace cuando corra dentro del shell desktop de Tauri.
- **FR-002**: El sistema MUST conservar un fallback operativo basado en
  `localStorage` cuando corra en web o cuando SQLite no este disponible.
- **FR-003**: El sistema MUST poder leer y escribir el workspace completo del
  evento desde una sola fachada de persistencia sin que la UI dependa del motor
  subyacente.
- **FR-004**: El sistema MUST crear o migrar la estructura minima necesaria de
  la base local antes de intentar guardar datos de evento.
- **FR-005**: El sistema MUST mostrar en la interfaz que storage esta activo,
  su estado operativo y la ruta esperada del archivo local cuando aplique.
- **FR-006**: El sistema MUST intentar migrar datos locales existentes al
  storage fuerte del desktop cuando sea seguro hacerlo.
- **FR-007**: El sistema MUST registrar mensajes claros de fallback cuando el
  runtime desktop o SQLite no puedan inicializarse.
- **FR-008**: El sistema MUST documentar donde vive la base local y como validar
  que la app esta usando persistencia real.
- **FR-009**: El sistema SHOULD destrabar el flujo de `desktop:dev` en Windows
  cuando el bloqueo provenga de configuracion del proyecto y no de una falla
  externa del ecosistema.

### Key Entities *(include if feature involves data)*

- **Storage Diagnostics**: Resume el motor activo, su estado, la ubicacion
  esperada del almacenamiento y el ultimo resultado de carga o guardado.
- **Workspace Snapshot Record**: Representa la version persistida del workspace
  completo de eventos, atletas y resultados.
- **SQLite Runtime Store**: Representa el archivo local de base de datos usado
  por el host desktop para guardar el estado del torneo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un operador puede reabrir la app de escritorio y recuperar su
  workspace local sin recaptura manual.
- **SC-002**: El responsable tecnico puede identificar en menos de 30 segundos
  que storage esta activo y donde vive la informacion local.
- **SC-003**: La app mantiene un modo operativo local incluso si SQLite no esta
  disponible temporalmente durante desarrollo.
- **SC-004**: El equipo puede explicar con una sola pantalla o guia donde queda
  el archivo de datos local del torneo.

## Assumptions

- El almacenamiento inicial puede persistir como snapshot de workspace completo
  dentro de SQLite antes de normalizar tablas de evento y auditoria por juez.
- Windows sigue siendo la primera plataforma objetivo del shell desktop.
- Si el bloqueo de Tauri proviene de un bug del ecosistema y no de la
  configuracion del repo, la fase puede quedar funcional en web con fallback y
  documentacion clara mientras se deja el workaround local mas seguro posible.
