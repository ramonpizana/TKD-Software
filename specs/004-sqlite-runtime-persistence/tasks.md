# Tasks: SQLite Runtime Persistence

**Input**: Design documents from `/specs/004-sqlite-runtime-persistence/`

## Phase 1: Setup

- [x] T001 Crear artefactos de especificacion para `specs/004-sqlite-runtime-persistence/`

## Phase 2: Foundational

- [x] T002 Crear fachada runtime-aware de persistencia en `src/domain/tournament/model/`
- [x] T003 Registrar migraciones y preload de SQLite en `src-tauri/`
- [x] T004 Exponer diagnostico de storage desde `src/pages/ring-control/model/useRingControl.ts`

## Phase 3: User Story 1 - Guardar el torneo en base local real

- [x] T005 [US1] Implementar lectura y escritura del workspace en `src/domain/tournament/model/persistence.tauri-sql.ts`
- [x] T006 [US1] Integrar la nueva fachada de almacenamiento en `src/pages/ring-control/model/useRingControl.ts`

## Phase 4: User Story 2 - Entender donde se guardan los datos

- [x] T007 [US2] Mostrar diagnostico visible de storage en `src/pages/ring-control/ui/RingControlPage.tsx`
- [x] T008 [US2] Extender la portada operativa en `src/features/product-home/ui/ProductHomePanel.tsx`
- [x] T009 [US2] Documentar la ubicacion y verificacion del storage en `docs/desktop/sqlite-tauri.md`

## Phase 5: User Story 3 - Fallback operativo

- [x] T010 [US3] Implementar fallback y migracion inicial desde `localStorage`
- [x] T011 [US3] Aplicar workaround de configuracion para `desktop:dev` en `src-tauri/tauri.conf.json`

## Final Phase: Polish

- [x] T012 Ejecutar `npm run test`, `npm run lint`, `npm run typecheck`, `node scripts/build.mjs` y la mejor verificacion posible de `npm run desktop:dev`
