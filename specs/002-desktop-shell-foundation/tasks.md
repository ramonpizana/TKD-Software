# Tasks: Desktop Shell Foundation

## Phase 1 - Setup

- [x] T001 Crear artefactos `speckit` de escritorio en `specs/002-desktop-shell-foundation/`
- [x] T002 Agregar dependencias y scripts de escritorio en `package.json`
- [x] T003 Crear el chequeo `scripts/check-desktop-prereqs.mjs`

## Phase 2 - Foundational

- [x] T004 Crear `src-tauri/` con `Cargo.toml`, `build.rs`, `tauri.conf.json`, `src/main.rs`, `src/lib.rs` y `capabilities/default.json`
- [x] T005 Actualizar `.gitignore`, `AGENTS.md` y `scripts/validate-repo.mjs` para incluir la fase de escritorio
- [x] T006 Agregar capa de runtime en `src/app/runtime/useDesktopRuntimeInfo.ts`

## Phase 3 - User Story 1 - Operar el ring desde app instalada (P1)

- [x] T007 [US1] Mostrar el runtime activo en `src/pages/ring-control/ui/RingControlPage.tsx`
- [ ] T008 [US1] Ejecutar `npm run desktop:dev` con el shell real una vez que exista Rust en la maquina

## Phase 4 - User Story 2 - Preparar bundle distribuible (P2)

- [x] T009 [US2] Documentar el flujo de escritorio en `README.md`
- [x] T010 [US2] Documentar prerequisitos de Windows en `docs/desktop/windows-setup.md`
- [x] T011 [US2] Fijar identidad, ventana principal y target de bundle en `src-tauri/tauri.conf.json`

## Phase 5 - User Story 3 - Detectar prerequisitos (P3)

- [x] T012 [US3] Exponer `npm run desktop:doctor` como gate local del entorno
- [ ] T013 [US3] Verificar el chequeo en una maquina ya preparada para escritorio

## Phase 6 - Polish

- [x] T014 Actualizar `README.md`, `ARCHITECTURE.md` y `.specify/feature.json`
- [ ] T015 Ejecutar el flujo nativo completo despues de instalar `rustc` y `cargo`
