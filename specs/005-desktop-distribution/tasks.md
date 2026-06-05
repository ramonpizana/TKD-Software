# Tasks: Desktop Distribution

## Phase 1: Setup

- [x] T001 Crear artefactos Speckit para `specs/005-desktop-distribution/`

## Phase 2: Distribution hardening

- [x] T002 Endurecer `scripts/run-tauri.mjs` para limpiar procesos desktop stale
- [x] T003 Agregar script para localizar artefactos desktop
- [x] T004 Ajustar configuracion de bundle y docs para instalador Windows

## Phase 3: GitHub distribution

- [x] T005 Crear workflow `.github/workflows/desktop-release.yml`
- [x] T006 Documentar clonacion, build local y descarga de artefactos

## Final Phase: Validation

- [x] T007 Ejecutar `npm run validate`
- [x] T008 Verificar `npm run desktop:build` o el mejor equivalente posible en la maquina actual
