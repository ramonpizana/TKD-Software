# Implementation Plan: Event Operations Workspace

**Branch**: `003-event-ops` | **Date**: 2026-06-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-event-ops/spec.md`

## Summary

Expandir el prototipo de ring hacia un workspace de evento local-first que
permita crear multiples brackets, registrar atletas, guardar resultados
auditables y mostrar posiciones dentro de la misma app. La primera entrega se
mantendra en el frontend actual con persistencia local, dejando el camino listo
para migrar el storage autoritativo a SQLite en el shell de escritorio.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Node 24, Rust scaffold presente para Tauri

**Primary Dependencies**: React, Vite, Zod, Tauri CLI scaffold

**Storage**: LocalStorage en el MVP web; ruta de migracion prevista hacia SQLite local en Tauri

**Testing**: Vitest, TypeScript typecheck, ESLint, build de Vite, validacion integral del repo

**Target Platform**: Windows-first desktop shell con prototipo web local para desarrollo

**Project Type**: Desktop-oriented web application with Tauri shell

**Performance Goals**: Guardar resultados y refrescar posiciones en menos de 2 segundos; interaccion fluida para operador durante evento

**Constraints**: Debe seguir funcionando offline, no debe depender de nube para la operacion del ring, y debe preservar auditabilidad por atleta y por juez

**Scale/Scope**: MVP para multiples eventos locales, decenas de atletas por evento y resultados persistentes en un solo dispositivo de ring

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Cumple Local-First Ring Operation: el evento y sus resultados se guardan en el dispositivo y no dependen de internet.
- Cumple Authoritative Scoring and Auditability: se conserva una sola fuente de verdad por evento y se guardan resultados por atleta con desglose.
- Cumple Secure Pairing and Secret Boundary: no requiere credenciales ni servicios remotos para el MVP.
- Cumple Validation and Recovery Gate: la implementacion se validara con `npm run validate` y pruebas enfocadas.
- Cumple Documentation-Backed Tournament Delivery: esta fase actualiza `specs/`, `README.md` y los artefactos relevantes del proyecto.

## Project Structure

### Documentation (this feature)

```text
specs/003-event-ops/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- tasks.md
`-- checklists/
    `-- requirements.md
```

### Source Code (repository root)

```text
src/
|-- app/
|-- domain/
|   |-- ring/model/
|   `-- tournament/
|       |-- fixtures/
|       `-- model/
|-- features/
|   |-- athlete-queue/
|   |-- event-workspace/
|   |-- judge-panel/
|   `-- result-panel/
`-- pages/
    `-- ring-control/

scripts/
`-- *.mjs
```

**Structure Decision**: Se mantiene el proyecto como una sola aplicacion de
frontend orientada a desktop, agregando el nuevo estado de evento en
`src/domain/tournament/model/` y componentes operativos nuevos bajo
`src/features/`.

## Complexity Tracking

No se anticipan violaciones a la constitucion en esta fase.
