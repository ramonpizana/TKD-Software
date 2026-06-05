# Implementation Plan: SQLite Runtime Persistence

**Branch**: `004-sqlite-runtime-persistence` | **Date**: 2026-06-04 | **Spec**: [spec.md](/C:/Users/ramon/Documents/TKD/specs/004-sqlite-runtime-persistence/spec.md)

**Input**: Feature specification from `/specs/004-sqlite-runtime-persistence/spec.md`

## Summary

Convertir la persistencia del workspace en una fachada runtime-aware que use
SQLite dentro de Tauri y `localStorage` como fallback, exponiendo diagnostico
visible del storage activo y aplicando un workaround de configuracion para el
bloqueo actual del build desktop en Windows.

## Technical Context

**Language/Version**: TypeScript 5.9, Rust 2021

**Primary Dependencies**: React 19, Vite 7, Tauri 2.11, `@tauri-apps/plugin-sql`

**Storage**: SQLite local en desktop, `localStorage` como fallback web

**Testing**: Vitest, ESLint, TypeScript, build local

**Target Platform**: Windows desktop primero, web local como modo de desarrollo

**Project Type**: Desktop app + web fallback

**Performance Goals**: Cargar y guardar el workspace sin impactar la operacion
normal del ring

**Constraints**: Offline-first, una sola fuente de verdad por ring, diagnostico
claro bajo presion de torneo

**Scale/Scope**: Un host local por ring, varios eventos locales por instalacion

## Constitution Check

- Offline-first del ring: se mantiene con SQLite local y fallback web
- Una sola fuente de verdad por ring: la fachada runtime decide storage activo
- Score auditable por juez y por evento: se conserva dentro del snapshot del
  workspace mientras llega la normalizacion completa
- UI clara bajo presion: se agregara diagnostico visible y explicito
- Documentacion al dia: esta fase actualiza guias de desktop y storage

## Project Structure

### Documentation (this feature)

```text
specs/004-sqlite-runtime-persistence/
|-- plan.md
|-- spec.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- app/runtime/
|-- domain/tournament/model/
|-- features/product-home/ui/
`-- pages/ring-control/

src-tauri/
|-- src/
|-- capabilities/
`-- tauri.conf.json
```

**Structure Decision**: Mantener la logica de almacenamiento en
`src/domain/tournament/model/`, exponer diagnostico a traves del hook principal
del ring y dejar las migraciones SQLite registradas en `src-tauri/src/lib.rs`.
