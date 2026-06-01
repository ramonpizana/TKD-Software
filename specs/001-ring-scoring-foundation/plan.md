# Implementation Plan: Ring Scoring Foundation

**Branch**: `[001-ring-scoring-foundation]` | **Date**: 2026-05-31 | **Spec**: [spec.md](/C:/Users/ramon/Documents/TKD/specs/001-ring-scoring-foundation/spec.md)

**Input**: Feature specification from `/specs/001-ring-scoring-foundation/spec.md`

## Summary

Construir una fundacion del producto centrada en scoring local, trazabilidad del
atleta y calidad operativa del repositorio. La primera entrega materializa una
consola local del operador, un motor de scoring probado, persistencia local y
flujo `speckit` para mantener el proyecto auditable.

## Technical Context

**Language/Version**: TypeScript 5.9

**Primary Dependencies**: React 19, Vite 7, Zod 4, Vitest 4, ESLint 9

**Storage**: Local storage del navegador en esta fase; almacenamiento embebido
transaccional en fase posterior

**Testing**: Vitest para reglas de scoring y `npm run validate` como gate global

**Target Platform**: Navegador moderno para el prototipo local del operador

**Project Type**: Aplicacion web local-first rumbo a software de escritorio de
competencia

**Performance Goals**: Recalculo de score perceptiblemente inmediato en entorno
local; actualizacion de UI por deduccion bajo 100 ms

**Constraints**: Debe seguir funcionando sin internet, ser entendible bajo
presion de torneo y no depender aun de backend publico

**Scale/Scope**: Primer corte enfocado en un ring, 3-5-7 jueces y cola local de
atletas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `Local-First Ring Operation`: cumple
- `Authoritative Scoring and Auditability`: cumple a nivel de snapshot local
- `Secure Pairing and Secret Boundary`: cumple para esta fase sin credenciales
- `Validation and Recovery Gate`: cumple con tests, lint, typecheck y validate
- `Documentation-Backed Tournament Delivery`: cumple con docs y artifacts

## Project Structure

### Documentation (this feature)

```text
specs/001-ring-scoring-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── tasks.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
.github/workflows/
.specify/
scripts/
src/
├── components/
├── data/
├── lib/
└── styles/
```

**Structure Decision**: Se eligio una app unica para el prototipo fundacional
porque reduce complejidad mientras validamos scoring, UX operativa y reglas del
ring. La arquitectura objetivo multi-componente queda documentada, pero no se
materializa aun en procesos separados.

## Phase 0 - Research

- Confirmar direccion de reglas oficiales y patrones de mercado
- Elegir enfoque local-first y no cloud-first

## Phase 1 - Foundation Build

- Crear estructura `speckit` y constitucion del repositorio
- Preparar configuracion de TypeScript, Vite, ESLint, Vitest y CI
- Implementar motor de scoring y validacion de snapshots
- Implementar UI del operador con cola de atletas y panel de jueces

## Phase 2 - Validation

- Pruebas unitarias del motor
- Gate `npm run validate`
- Verificacion visual manual local

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Ninguna | N/A | N/A |

