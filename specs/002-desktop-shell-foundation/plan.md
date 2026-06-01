# Implementation Plan: Desktop Shell Foundation

**Branch**: `[002-desktop-shell-foundation]` | **Date**: 2026-05-31 | **Spec**: [spec.md](/C:/Users/ramon/Documents/TKD/specs/002-desktop-shell-foundation/spec.md)

**Input**: Feature specification from `/specs/002-desktop-shell-foundation/spec.md`

## Summary

Preparar `TKD-Software` para convertirse en un host de escritorio instalable
sin perder el flujo web actual. La entrega de esta fase agrega scaffold de
`Tauri`, scripts de diagnostico del entorno, documentacion de Windows y una
capa de runtime para distinguir si la app corre en navegador o dentro del
shell nativo.

## Technical Context

**Language/Version**: TypeScript 5.9 para frontend, Rust para el shell nativo

**Primary Dependencies**: React 19, Vite 7, Zod 4, `@tauri-apps/cli` 2.11.2,
`@tauri-apps/api` 2.11.0

**Storage**: `localStorage` del navegador embebido en esta fase; migracion a
almacenamiento transaccional local en una fase posterior

**Testing**: ESLint, TypeScript, Vitest, `npm run validate`, chequeo local de
prerequisitos de escritorio

**Target Platform**: Windows 10/11 como primer objetivo de escritorio

**Project Type**: Aplicacion desktop wrapping el mismo flujo web local-first

**Performance Goals**: arranque del shell sin internet y continuidad del flujo
central de scoring sin regresion perceptible

**Constraints**: el flujo web actual debe seguir funcionando; el entorno local
actual todavia no tiene `cargo` ni `rustc`, por lo que el shell no puede
ejecutarse completo hasta instalar prerequisitos

**Scale/Scope**: una sola ventana principal para un ring en esta fase

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `Local-First Ring Operation`: cumple, el shell solo envuelve el flujo local
- `Authoritative Scoring and Auditability`: cumple, no se crea una segunda
  verdad del scoring
- `Secure Pairing and Secret Boundary`: cumple, no se agregan secretos ni
  accesos remotos en esta fase
- `Validation and Recovery Gate`: cumple, se mantiene `npm run validate` y se
  agrega diagnostico de escritorio
- `Documentation-Backed Tournament Delivery`: cumple, se crean artefactos
  `speckit` y docs de setup

## Project Structure

### Documentation (this feature)

```text
specs/002-desktop-shell-foundation/
|- plan.md
|- research.md
|- data-model.md
|- quickstart.md
|- contracts/
|  `- desktop-shell-contract.md
|- tasks.md
`- checklists/
   `- requirements.md
```

### Source Code (repository root)

```text
docs/
|- desktop/
|  `- windows-setup.md
scripts/
|- check-desktop-prereqs.mjs
src/
|- app/
|  `- runtime/
src-tauri/
|- capabilities/
|- icons/
|- src/
|- Cargo.toml
|- build.rs
`- tauri.conf.json
```

**Structure Decision**: Se mantiene una sola UI compartida para web y desktop,
porque el valor de esta fase esta en envolver el host del ring como software
instalable, no en duplicar la interfaz ni bifurcar la logica de scoring.

## Phase 0 - Research

- Confirmar prerequisitos oficiales de Tauri para Windows
- Elegir `Tauri` como shell nativo y mantener `Cloudflare` fuera del camino
  critico del ring
- Elegir bundle inicial de Windows orientado a instalador ejecutable

## Phase 1 - Foundation Build

- Agregar dependencias `Tauri` al repo actual
- Crear `src-tauri/` con configuracion minima del shell
- Exponer scripts `desktop:doctor`, `desktop:dev` y `desktop:build`
- Agregar runtime metadata para que la UI sepa si corre en web o desktop

## Phase 2 - Validation

- Validar que el repo siga pasando lint, typecheck, test y build web
- Validar que el chequeo de prerequisitos falle claramente cuando falte Rust
- Dejar documentado el bloqueo real del entorno para correr `tauri dev`

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Ninguna | N/A | N/A |
