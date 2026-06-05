# Feature Specification: Desktop Distribution

**Feature Branch**: `005-desktop-distribution`
**Created**: 2026-06-04
**Status**: Draft
**Input**: "Permitir que el software se comparta y use como app de escritorio instalable, sin depender de localhost"

## User Stories

### User Story 1 - Generar instalador local

Como operador del torneo,
quiero generar un instalador de Windows desde mi maquina,
para compartir una app real sin pedir que el usuario final use `localhost`.

### User Story 2 - Compartir build desde GitHub

Como mantenedor del repositorio,
quiero que GitHub pueda compilar y adjuntar artefactos de escritorio,
para que otras personas clonen o descarguen el build con un flujo repetible.

### User Story 3 - Evitar bloqueos al recompilar

Como desarrollador del proyecto,
quiero que el flujo `desktop:dev` y `desktop:build` limpie procesos viejos del host,
para no fallar por locks del `.exe` ni por puertos colgados.

## Functional Requirements

- El proyecto DEBE poder generar un instalador Windows con `npm run desktop:build`.
- El proyecto DEBE documentar la ruta de salida de los artefactos desktop.
- El proyecto DEBE ofrecer una forma clara de localizar el instalador generado.
- El flujo `desktop:dev` DEBE tolerar procesos viejos del host de escritorio.
- El flujo `desktop:build` DEBE tolerar procesos viejos del host de escritorio.
- El repositorio DEBE incluir un workflow de GitHub Actions para compilar la app desktop en Windows.
- El workflow DEBE publicar artefactos descargables aunque no se cree un release.
- El workflow DEBE poder crear o adjuntar un instalador a un release cuando se use un tag `v*`.

## Success Criteria

- `desktop:dev` deja de fallar por `Access is denied` sobre `tkd-software.exe` cuando existe un proceso previo del host.
- `desktop:build` produce un bundle NSIS localizable.
- Un mantenedor puede disparar un workflow y descargar el instalador compilado desde GitHub.
