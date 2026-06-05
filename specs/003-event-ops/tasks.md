# Tasks: Event Operations Workspace

## Phase 1: Setup

- [x] T001 Crear artefactos de especificacion y plan para `specs/003-event-ops/`

## Phase 2: Foundational

- [x] T002 Extender los esquemas de dominio en `src/domain/ring/model/schemas.ts`
- [x] T003 Crear persistencia de workspace de eventos en `src/domain/tournament/model/`
- [x] T004 Adaptar el hook principal en `src/pages/ring-control/model/useRingControl.ts`

## Phase 3: User Story 1 - Preparar un evento competitivo

- [x] T005 [US1] Implementar modelo de eventos y atletas locales en `src/domain/tournament/model/`
- [x] T006 [US1] Crear panel de configuracion y registro en `src/features/event-workspace/ui/EventWorkspacePanel.tsx`
- [x] T007 [US1] Integrar el panel en `src/pages/ring-control/ui/RingControlPage.tsx`

## Phase 4: User Story 2 - Guardar resultados por atleta

- [x] T008 [US2] Implementar guardado de resultados y tabla de posiciones en `src/domain/tournament/model/`
- [x] T009 [US2] Extender `src/features/result-panel/ui/ResultPanel.tsx` con acciones de guardado y posiciones
- [x] T010 [US2] Agregar pruebas de dominio para persistencia y resultados

## Phase 5: User Story 3 - Administrar varios brackets o rondas

- [x] T011 [US3] Implementar cambio de evento activo y creacion de multiples eventos locales
- [x] T012 [US3] Mostrar selector de eventos y resumen operativo en `src/features/event-workspace/ui/EventWorkspacePanel.tsx`

## Phase 6: User Story 4 - Operacion por pestanas

- [x] T013 [US4] Separar portada, configuracion, jueceo y seguimiento del evento en `src/pages/ring-control/ui/RingControlPage.tsx`
- [x] T014 [US4] Crear componentes de portada, tabs y vistas operativas en `src/features/`
- [x] T015 [US4] Ajustar estilos para evitar traslapes y mejorar legibilidad en `src/app/styles/app.css`

## Final Phase: Polish

- [x] T016 Actualizar `README.md`, `ARCHITECTURE.md` y guias de escritorio
- [x] T017 Documentar e integrar la ruta inicial a `SQLite` en `Tauri`
- [x] T018 Ejecutar `npm run validate` y revisar la UI local
