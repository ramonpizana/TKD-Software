# Feature Specification: Desktop Shell Foundation

**Feature Branch**: `[002-desktop-shell-foundation]`

**Created**: 2026-05-31

**Status**: Draft

**Input**: User description: "Convertir TKD-Software en una app instalable de
escritorio, preferentemente para Windows, manteniendo el flujo local-first del
ring y dejando clara la relacion entre la app local y cualquier capa cloud."

## User Scenarios & Testing

### User Story 1 - Operar el ring desde app instalada (Priority: P1)

Como operador del ring, quiero abrir el sistema como software de escritorio en
mi laptop del evento para correr el scoring sin depender del navegador ni del
internet del recinto.

**Why this priority**: La operacion local y estable del ring es la necesidad
principal del producto y la razon de negocio de esta fase.

**Independent Test**: Se puede probar instalando o abriendo el shell de
escritorio en Windows, seleccionando un atleta y aplicando deducciones sin
internet.

**Acceptance Scenarios**:

1. **Given** una laptop del ring sin internet, **When** el operador abre la
   app de escritorio, **Then** la consola del ring carga y permite continuar el
   flujo local de scoring.
2. **Given** un atleta activo y jueces visibles, **When** el operador registra
   deducciones, **Then** el score publicado se recalcula y se mantiene el mismo
   comportamiento local-first del prototipo web.

---

### User Story 2 - Preparar bundle distribuible de Windows (Priority: P2)

Como responsable tecnico del torneo, quiero una ruta repetible para generar un
instalador de Windows para entregar el software como producto real.

**Why this priority**: Sin una ruta clara de empaquetado no existe software
entregable, solo un prototipo de desarrollo.

**Independent Test**: Se puede probar siguiendo la documentacion del repo para
ejecutar el flujo de build del shell y obtener un artefacto de instalacion.

**Acceptance Scenarios**:

1. **Given** una maquina con prerequisitos correctos, **When** el equipo
   ejecuta el flujo documentado de empaquetado, **Then** obtiene un bundle de
   Windows listo para pruebas internas.
2. **Given** una nueva version del producto, **When** se recompila el bundle,
   **Then** la identidad de la app se mantiene estable para futuras
   actualizaciones.

---

### User Story 3 - Detectar prerequisitos antes de intentar compilar (Priority: P3)

Como desarrollador del proyecto, quiero saber rapido si me faltan herramientas
de escritorio antes de perder tiempo intentando correr o buildar la app nativa.

**Why this priority**: Reduce friccion tecnica, acelera onboarding y evita
errores repetitivos en equipos nuevos.

**Independent Test**: Se puede probar desde una maquina limpia ejecutando un
diagnostico local que indique si falta el toolchain o la configuracion base.

**Acceptance Scenarios**:

1. **Given** una maquina sin Rust o sin herramientas nativas, **When** el
   desarrollador ejecuta el chequeo de prerequisitos, **Then** recibe una lista
   clara de lo que falta instalar.
2. **Given** una maquina lista para escritorio, **When** el desarrollador
   ejecuta el chequeo, **Then** obtiene confirmacion de que puede pasar al
   siguiente paso de Tauri.

### Edge Cases

- La maquina tiene Node correcto, pero no tiene `rustc` ni `cargo`.
- La app se abre sin internet y debe seguir mostrando el ultimo estado local.
- El equipo intenta empaquetar en Windows sin las herramientas de C++.
- El shell nativo existe, pero la UI debe seguir funcionando tambien en modo
  web para desarrollo rapido.

## Requirements

### Functional Requirements

- **FR-001**: El sistema MUST poder abrir el flujo principal del ring en una
  ventana de escritorio de Windows.
- **FR-002**: El sistema MUST conservar el comportamiento local-first del
  scoring actual cuando corra como app instalada.
- **FR-003**: El sistema MUST mantener la version web utilizable fuera del
  shell nativo para desarrollo y fallback.
- **FR-004**: El sistema MUST incluir la estructura nativa y archivos de
  configuracion necesarios para evolucionar a empaquetado de escritorio.
- **FR-005**: El sistema MUST ofrecer comandos repetibles para diagnostico,
  desarrollo y build del shell de escritorio.
- **FR-006**: El sistema MUST documentar los prerequisitos de Windows para el
  equipo tecnico.
- **FR-007**: El sistema MUST definir una identidad estable de aplicacion para
  futuras instalaciones y actualizaciones.
- **FR-008**: El sistema MUST limitar los permisos del shell nativo a lo
  necesario para la ventana principal actual.
- **FR-009**: El sistema MUST fallar con mensajes claros cuando falten
  prerequisitos del entorno de escritorio.

### Key Entities

- **Desktop Runtime Profile**: Representa si la aplicacion corre como shell de
  escritorio o como prototipo web, junto con metadatos basicos del runtime.
- **Native Window Definition**: Describe la ventana principal del host del
  ring, su identidad visible y restricciones basicas.
- **Desktop Prerequisite Check**: Resume el estado de herramientas necesarias
  para correr o empaquetar el shell nativo.
- **Bundle Artifact Profile**: Define el tipo de instalador objetivo y la
  identidad estable esperada del producto distribuible.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Un desarrollador puede determinar en menos de 2 minutos si su
  maquina esta lista para la fase de escritorio.
- **SC-002**: El flujo principal de scoring puede abrirse en escritorio sin
  degradar la operacion local del ring.
- **SC-003**: El equipo puede ejecutar un unico comando documentado para
  intentar el build del producto de escritorio en una maquina preparada.
- **SC-004**: La ruta de desarrollo mantiene disponibles tanto el modo web como
  el modo escritorio sin duplicar la logica del scoring.

## Assumptions

- Windows sera el primer objetivo de escritorio del proyecto.
- En esta fase se trabajara con una sola ventana principal del host del ring.
- La persistencia del prototipo seguira viviendo en el lado web hasta una fase
  posterior de almacenamiento embebido mas fuerte.
- La firma de codigo y la distribucion publica formal quedan fuera del alcance
  inicial de esta fase.
